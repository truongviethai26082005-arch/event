import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

/**
 * API GHI NHẬN TƯƠNG TÁC LEAD THẬT TỪ LANDING PAGE
 * Phân loại thành 4 nguồn: GG Form, Zalo, Hotline, Facebook
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawSource = String(body.source || "").toUpperCase();

    let dbSource = "WEBSITE_FORM";
    let channelName = "GG Form / Website";
    let defaultName = "Khách điền form báo giá";

    if (rawSource.includes("ZALO")) {
      dbSource = "ZALO_OA";
      channelName = "Zalo";
      defaultName = "Khách liên hệ qua Zalo";
    } else if (rawSource.includes("HOTLINE") || rawSource.includes("CALL")) {
      dbSource = "HOTLINE";
      channelName = "Hotline";
      defaultName = "Khách bấm gọi Hotline";
    } else if (rawSource.includes("FACEBOOK") || rawSource.includes("FB")) {
      dbSource = "REFERRAL";
      channelName = "Facebook";
      defaultName = "Khách liên hệ qua Facebook";
    }

    const leadData = {
      full_name: body.fullName || defaultName,
      phone: body.phone || (rawSource.includes("HOTLINE") ? "0844 198 333" : "Chờ cập nhật"),
      email: body.email || null,
      event_type: body.eventType || "Tư vấn sự kiện & báo giá",
      notes: body.notes || `Khách hàng tương tác qua kênh ${channelName} từ Landing Page vào lúc ${new Date().toLocaleString("vi-VN")}`,
      source: dbSource,
      status: "NEW",
    };

    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from("leads").insert([leadData]).select();
      if (error) {
        console.warn("Lỗi ghi nhận lead vào Supabase:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }
      return NextResponse.json({ success: true, lead: data?.[0] });
    }

    return NextResponse.json({ success: true, message: "Ghi nhận lead tương tác" });
  } catch (error) {
    console.error("Lỗi track lead:", error);
    return NextResponse.json({ success: false, error: "Internal Error" }, { status: 500 });
  }
}
