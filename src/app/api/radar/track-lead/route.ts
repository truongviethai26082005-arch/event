import { NextRequest, NextResponse, after } from "next/server";
import { runIntakeAutomation } from "@/lib/crm/automation";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { LEAD_SOURCE_LABELS } from "@/app/admin/_components/admin-types";
import {
  CHANNEL_TO_SOURCE,
  LeadChannel,
  PENDING_PHONE,
  isLeadChannel,
} from "@/lib/lead-funnel";

/**
 * CỔNG VÀO PHỄU CHO CÁC KÊNH LIÊN HỆ TRÊN WEBSITE
 * Kênh (GG_FORM | ZALO | HOTLINE | FACEBOOK) -> lead mới trạng thái NEW trong bảng `leads`.
 * Quy tắc ánh xạ nằm ở src/lib/lead-funnel.ts.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawChannel = String(body.source || "").toUpperCase();
    const channel: LeadChannel = isLeadChannel(rawChannel) ? rawChannel : "GG_FORM";
    const source = CHANNEL_TO_SOURCE[channel];
    const channelName = LEAD_SOURCE_LABELS[source];

    const fullName = typeof body.fullName === "string" ? body.fullName.trim() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const isFormSubmission = Boolean(fullName && phone);
    const timestamp = new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });

    const leadData = {
      full_name: fullName || `Khách bấm nút ${channelName}`,
      phone: phone || PENDING_PHONE,
      email: typeof body.email === "string" && body.email.trim() ? body.email.trim() : null,
      event_type: body.eventType || "Tư vấn sự kiện & báo giá",
      notes:
        body.notes ||
        (isFormSubmission
          ? `Khách gửi form qua kênh ${channelName} lúc ${timestamp}`
          : `[Lượt bấm nút ${channelName}] Khách bấm liên hệ lúc ${timestamp}. Chưa có số điện thoại, sale cần xác minh và cập nhật.`),
      source,
      status: "NEW",
      landing_path: typeof body.landingPath === "string" ? body.landingPath.slice(0, 500) : null,
      referrer: typeof body.referrer === "string" && body.referrer ? body.referrer.slice(0, 200) : null,
    };

    if (!isSupabaseConfigured) {
      return NextResponse.json({ success: true, message: "Ghi nhận lead (chưa cấu hình Supabase)" });
    }

    // Token để form popup (khách điền ngay sau khi bấm) cập nhật đúng lead này thay vì tạo lead mới
    let formToken: string | null = crypto.randomUUID();
    const insert = (row: Record<string, unknown>) => supabase.from("leads").insert([row]);

    let { error } = await insert({ ...leadData, form_token: formToken });

    // DB chưa chạy migration 20261108000000 (chưa có cột form_token)
    if (error && (error.code === "PGRST204" || error.code === "42703")) {
      // DB cũ: thử lại không có landing_path / referrer, rồi không có form_token
      const { landing_path: _l, referrer: _r, ...legacy } = leadData;
      void _l;
      void _r;
      ({ error } = await insert({ ...legacy, form_token: formToken }));
      if (error && (error.code === "PGRST204" || error.code === "42703")) {
        formToken = null;
        ({ error } = await insert(legacy));
      }
    }

    // DB chưa chạy migration thêm nguồn FACEBOOK -> lưu tạm vào REFERRAL (ghi chú có chữ "Facebook"
    // nên resolveLeadSource vẫn nhận đúng là Facebook).
    if (error && error.code === "23514" && source === "FACEBOOK") {
      ({ error } = await insert({
        ...leadData,
        ...(formToken ? { form_token: formToken } : {}),
        source: "REFERRAL",
        notes: `[Facebook] ${leadData.notes}`,
      }));
    }

    if (error) {
      console.warn("Lỗi ghi nhận lead vào Supabase:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
    // Báo Telegram (và AI phân tích nếu là form có thông tin) chạy nền
    after(() =>
      runIntakeAutomation({
        kind: isFormSubmission ? "form" : "click",
        formToken,
        origin: new URL(req.url).origin,
        fallback: { fullName: leadData.full_name, phone, source, eventType: leadData.event_type },
      })
    );
    return NextResponse.json({ success: true, token: formToken });
  } catch (error) {
    console.error("Lỗi track lead:", error);
    return NextResponse.json({ success: false, error: "Internal Error" }, { status: 500 });
  }
}
