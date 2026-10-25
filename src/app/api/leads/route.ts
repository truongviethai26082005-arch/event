import { NextResponse } from "next/server";
import { getSupabasePublicConfig } from "@/lib/supabase/config";
import { createClient } from "@supabase/supabase-js";

function parseGuestCount(text: string): number | null {
  if (!text) return null;
  if (text.includes("Dưới 50")) return 40;
  if (text.includes("50 - 150")) return 100;
  if (text.includes("150 - 300")) return 200;
  if (text.includes("300 - 600")) return 450;
  if (text.includes("Trên 600")) return 700;
  const match = text.match(/\d+/);
  return match ? parseInt(match[0], 10) : null;
}

function parseBudget(text: string): number | null {
  if (!text) return null;
  if (text.includes("Dưới 20")) return 15_000_000;
  if (text.includes("20.000.000") && text.includes("50.000.000")) return 35_000_000;
  if (text.includes("50.000.000") && text.includes("100.000.000")) return 75_000_000;
  if (text.includes("100.000.000") && text.includes("250.000.000")) return 175_000_000;
  if (text.includes("Trên 250")) return 300_000_000;
  return null;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      fullName,
      phone,
      email,
      eventType,
      estimatedGuests,
      budgetRange,
      eventDate,
      location,
      notes,
      promoCode,
      promoTitle,
    } = body;

    if (!fullName || !phone) {
      return NextResponse.json(
        { error: "Họ tên và số điện thoại là bắt buộc" },
        { status: 400 }
      );
    }

    const config = getSupabasePublicConfig();
    if (!config) {
      return NextResponse.json(
        { error: "Supabase chưa được cấu hình trên máy chủ." },
        { status: 503 }
      );
    }

    const supabase = createClient(config.url, config.key);

    const guestCount = parseGuestCount(estimatedGuests || "");
    const budget = parseBudget(budgetRange || "");

    const detailedNotes = [
      notes ? `Yêu cầu: ${notes}` : "",
      estimatedGuests ? `Quy mô: ${estimatedGuests}` : "",
      budgetRange ? `Ngân sách: ${budgetRange}` : "",
      promoCode ? `Ưu đãi áp dụng: [${promoCode}] ${promoTitle || ""}` : "",
    ]
      .filter(Boolean)
      .join(" | ");

    const record = {
      full_name: String(fullName).trim(),
      phone: String(phone).trim(),
      email: email ? String(email).trim() : null,
      event_type: String(eventType || "Tư vấn sự kiện & tour").trim(),
      guest_count: guestCount,
      budget: budget,
      event_date: eventDate ? String(eventDate).trim() : null,
      location: location ? String(location).trim() : "Hà Nội",
      notes: detailedNotes || null,
      status: "NEW",
      source: "WEBSITE_FORM",
      event_status: "PENDING",
    };

    const { data, error } = await supabase.from("leads").insert([record]).select();

    if (error) {
      console.error("[/api/leads] Lỗi Supabase insert:", error);
      // Fallback: nếu select bị RLS block nhưng insert thành công
      if (error.code === "42501" && error.message?.includes("row-level security")) {
        const insertOnly = await supabase.from("leads").insert([record]);
        if (insertOnly.error) {
          throw insertOnly.error;
        }
        return NextResponse.json({ success: true, message: "Ghi nhận thành công" });
      }
      throw error;
    }

    return NextResponse.json({ success: true, lead: data?.[0] || record });
  } catch (error: any) {
    console.error("[/api/leads] Ngoại lệ:", error);
    return NextResponse.json(
      { error: error?.message || "Không thể lưu thông tin khách hàng" },
      { status: 500 }
    );
  }
}
