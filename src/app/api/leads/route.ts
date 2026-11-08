import { NextResponse, after } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSupabasePublicConfig } from "@/lib/supabase/config";
import {
  LeadFormInput,
  buildLeadNotes,
  isValidPhone,
  parseBudget,
  parseEventDate,
  parseGuestCount,
} from "@/lib/lead-form-options";
import { CHANNEL_TO_SOURCE, isLeadChannel } from "@/lib/lead-funnel";
import { runIntakeAutomation } from "@/lib/crm/automation";

/** Cho phép tác vụ nền (AI phân tích + Telegram) chạy tối đa 60 giây. */
export const maxDuration = 60;

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * CỔNG VÀO PHỄU CHO MỌI FORM "NHẬN KỊCH BẢN & BÁO GIÁ"
 *  - Form trên /dich-vu
 *  - Popup hiện khi khách bấm Hotline / Zalo / Facebook / Messenger
 *  - Trang /dich-vu/nhan-bao-gia?ma=... (link sale gửi khách qua chat)
 *
 * Body: LeadFormInput + { token?: uuid, channel?: GG_FORM|ZALO|HOTLINE|FACEBOOK }
 * Có token khớp lead cũ -> cập nhật lead đó (không tạo trùng). Không có -> tạo lead mới.
 */
export async function POST(request: Request) {
  let body: LeadFormInput & { token?: string; channel?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Dữ liệu không hợp lệ" }, { status: 400 });
  }

  const fullName = String(body.fullName || "").trim();
  const phone = String(body.phone || "").trim();
  if (!fullName || !phone) {
    return NextResponse.json({ error: "Họ tên và số điện thoại là bắt buộc" }, { status: 400 });
  }
  if (!isValidPhone(phone)) {
    return NextResponse.json({ error: "Số điện thoại không hợp lệ" }, { status: 400 });
  }

  const config = getSupabasePublicConfig();
  if (!config) {
    return NextResponse.json({ error: "Supabase chưa được cấu hình trên máy chủ." }, { status: 503 });
  }
  const supabase = createClient(config.url, config.key);

  const channel = String(body.channel || "").toUpperCase();
  const lead = {
    full_name: fullName,
    phone,
    email: body.email ? String(body.email).trim() : null,
    company_name: body.companyName ? String(body.companyName).trim() : null,
    event_type: String(body.eventType || "Tư vấn sự kiện & báo giá").trim(),
    guest_count: parseGuestCount(body.estimatedGuests),
    budget: parseBudget(body.budgetRange),
    event_date: parseEventDate(body.eventDate),
    location: body.location ? String(body.location).trim() : null,
    notes: buildLeadNotes(body) || null,
    source: isLeadChannel(channel) ? CHANNEL_TO_SOURCE[channel] : "WEBSITE_FORM",
  };
  const token = body.token && UUID_RE.test(body.token) ? body.token : null;

  let { data: leadId, error } = await supabase.rpc("submit_lead_form", {
    p_token: token,
    p_lead: lead,
  });

  // DB chưa chạy migration thêm nguồn FACEBOOK -> lưu tạm vào REFERRAL
  if (error?.code === "23514" && lead.source === "FACEBOOK") {
    ({ data: leadId, error } = await supabase.rpc("submit_lead_form", {
      p_token: token,
      p_lead: { ...lead, source: "REFERRAL", notes: `[Facebook] ${lead.notes || ""}` },
    }));
  }

  if (!error) {
    // Tự động hóa chạy nền sau khi đã trả kết quả cho khách
    after(() =>
      runIntakeAutomation({
        kind: "form",
        leadId: typeof leadId === "string" ? leadId : null,
        origin: new URL(request.url).origin,
        fallback: { fullName, phone, source: lead.source, eventType: lead.event_type },
      })
    );
    return NextResponse.json({ success: true, leadId });
  }

  // DB chưa chạy migration 20261108000000 (chưa có hàm submit_lead_form) -> tạo lead mới như cũ
  if (error.code === "PGRST202" || error.code === "42883") {
    const insert = await supabase.from("leads").insert([{ ...lead, status: "NEW" }]);
    if (!insert.error) return NextResponse.json({ success: true });
    // DB cũ chưa có nguồn FACEBOOK
    if (insert.error.code === "23514") {
      const retry = await supabase
        .from("leads")
        .insert([{ ...lead, status: "NEW", source: "REFERRAL", notes: `[Facebook] ${lead.notes || ""}` }]);
      if (!retry.error) return NextResponse.json({ success: true });
    }
    console.error("[/api/leads] Lỗi insert:", insert.error);
    return NextResponse.json({ error: "Không thể lưu thông tin khách hàng" }, { status: 500 });
  }

  console.error("[/api/leads] Lỗi submit_lead_form:", error);
  return NextResponse.json({ error: "Không thể lưu thông tin khách hàng" }, { status: 500 });
}
