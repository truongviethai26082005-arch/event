// CHỈ dùng ở máy chủ. Gọi bên trong after() để không làm chậm phản hồi cho khách.
import { createServiceClient } from "@/lib/supabase/service";
import { AI_SCORE_LABELS, AiAnalysis, analyzeAndSaveLead } from "@/lib/crm/lead-ai";
import { escapeHtml, sendTelegram } from "@/lib/crm/telegram";
import { LEAD_SOURCE_LABELS, isLeadSource } from "@/app/admin/_components/admin-types";

const SCORE_ICON: Record<string, string> = { HOT: "🔥", WARM: "🌤", COLD: "❄️" };

interface IntakeInput {
  /** "form": khách để lại thông tin; "click": khách chỉ bấm nút liên hệ. */
  kind: "form" | "click";
  leadId?: string | null;
  formToken?: string | null;
  /** Gốc website (https://...) để tạo link mở lead trong CRM. */
  origin: string;
  fallback: { fullName: string; phone?: string; source: string; eventType?: string };
}

/**
 * TỰ ĐỘNG HÓA KHI CÓ LEAD MỚI
 *  1. Khách để lại thông tin -> AI phân tích (chấm điểm, nhu cầu, gói, tin nhắn soạn sẵn) và lưu vào lead
 *  2. Báo ngay vào nhóm Telegram của sale, kèm link mở hồ sơ
 * Không bao giờ ném lỗi (chạy nền).
 */
export async function runIntakeAutomation(input: IntakeInput) {
  const service = createServiceClient();
  let leadId = input.leadId || null;
  let analysis: AiAnalysis | null = null;

  try {
    if (!leadId && input.formToken && service) {
      const { data } = await service.from("leads").select("id").eq("form_token", input.formToken).maybeSingle();
      leadId = data?.id ?? null;
    }
    if (input.kind === "form" && leadId && service && process.env.GEMINI_API_KEY) {
      analysis = (await analyzeAndSaveLead(service, leadId)).analysis;
    }
  } catch (err) {
    console.warn("[CRM automation] AI phân tích lỗi:", err);
  }

  const source = isLeadSource(input.fallback.source) ? LEAD_SOURCE_LABELS[input.fallback.source] : input.fallback.source;
  const link = leadId ? `${input.origin}/admin/leads?lead=${leadId}` : `${input.origin}/admin/leads`;

  const lines =
    input.kind === "click"
      ? [
          `👆 <b>Khách bấm nút ${escapeHtml(source)}</b> trên website`,
          `Chưa có SĐT. Kiểm tra tin nhắn ${escapeHtml(source)} và gửi link form cho khách.`,
          `<a href="${link}">Mở lead trong CRM</a>`,
        ]
      : [
          `🆕 <b>Lead mới</b>${analysis ? ` · ${SCORE_ICON[analysis.score]} <b>${AI_SCORE_LABELS[analysis.score]}</b>` : ""}`,
          `👤 ${escapeHtml(input.fallback.fullName)} · 📞 ${escapeHtml(input.fallback.phone || "")}`,
          `📥 Nguồn: ${escapeHtml(source)}`,
          analysis
            ? `📝 ${escapeHtml(analysis.summary)}`
            : `🎪 ${escapeHtml(input.fallback.eventType || "Tư vấn sự kiện")}`,
          analysis?.suggested_package ? `📦 Gợi ý: ${escapeHtml(analysis.suggested_package)}` : "",
          analysis?.next_action ? `👉 <b>Việc cần làm:</b> ${escapeHtml(analysis.next_action)}` : "👉 Gọi lại khách trong 30 phút",
          `<a href="${link}">Mở hồ sơ & tin nhắn AI soạn sẵn</a>`,
        ];

  await sendTelegram(lines.filter(Boolean).join("\n"));
}
