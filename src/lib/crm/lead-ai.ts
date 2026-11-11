// CHỈ dùng ở máy chủ (gọi Gemini bằng GEMINI_API_KEY).
import type { SupabaseClient } from "@supabase/supabase-js";
import { callGeminiWithFallback } from "@/app/api/radar/services/gemini-client";
import { CORE_SERVICES, PRICING_TIERS } from "@/app/dich-vu/data/services-data";
import { COMPANY_INFO } from "@/lib/company-data";
import { LEAD_STATUS_LABELS, isLeadStatus } from "@/app/admin/_components/admin-types";
import { STAGE_GUIDE, getLeadStatus, normalizePhone } from "@/lib/lead-funnel";

/* ------------------------------------------------------------------ */
/* KIỂU DỮ LIỆU                                                       */
/* ------------------------------------------------------------------ */

export type AiScore = "HOT" | "WARM" | "COLD";

export const AI_SCORE_LABELS: Record<AiScore, string> = {
  HOT: "Nóng",
  WARM: "Ấm",
  COLD: "Lạnh",
};

export interface AiNeeds {
  event_type?: string | null;
  event_date?: string | null;
  location?: string | null;
  guest_count?: string | null;
  budget?: string | null;
  requirements?: string[];
  /** Thông tin còn thiếu, sale cần hỏi thêm. */
  missing_info?: string[];
}

export interface AiAnalysis {
  score: AiScore;
  score_reason: string;
  summary: string;
  needs: AiNeeds;
  suggested_package: string;
  next_action: string;
  /** Tin nhắn soạn sẵn để sale gửi khách qua Zalo / Messenger. */
  message: string;
}

/** Dữ liệu lead tối thiểu để phân tích. */
export interface LeadForAi {
  id: string;
  full_name: string;
  phone?: string | null;
  email?: string | null;
  company_name?: string | null;
  event_type?: string | null;
  guest_count?: number | null;
  budget?: number | null;
  event_date?: string | null;
  location?: string | null;
  notes?: string | null;
  source?: string | null;
  status?: string | null;
  created_at?: string | null;
}

export interface PriceItem {
  id: string;
  category: string;
  name: string;
  unit: string;
  unit_price: number;
  description: string | null;
}

export interface DraftQuoteItem {
  title: string;
  unit: string;
  quantity: number;
  unitPrice: number;
}

/* ------------------------------------------------------------------ */
/* TIỆN ÍCH                                                           */
/* ------------------------------------------------------------------ */

function apiKey() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("Thiếu GEMINI_API_KEY trên máy chủ.");
  return key;
}

function parseJson<T>(text: string): T {
  const cleaned = text.trim().replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  return JSON.parse(cleaned) as T;
}

const str = (v: unknown, max = 2000) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const strList = (v: unknown, max = 10) =>
  Array.isArray(v) ? v.map((x) => str(x, 300)).filter(Boolean).slice(0, max) : [];

function describeLead(lead: LeadForAi) {
  const status = getLeadStatus(lead);
  return [
    `Họ tên: ${lead.full_name}`,
    `Công ty: ${lead.company_name || "—"}`,
    `Có số điện thoại: ${normalizePhone(lead.phone) ? "có" : "CHƯA"}`,
    `Email: ${lead.email ? "có" : "chưa"}`,
    `Nguồn: ${lead.source || "—"}`,
    `Loại sự kiện: ${lead.event_type || "—"}`,
    `Số khách: ${lead.guest_count ?? "—"}`,
    `Ngân sách dự kiến (VND): ${lead.budget ?? "—"}`,
    `Ngày tổ chức: ${lead.event_date || "—"}`,
    `Địa điểm: ${lead.location || "—"}`,
    `Ghi chú / yêu cầu của khách: ${lead.notes || "—"}`,
    `Trạng thái phễu hiện tại: ${LEAD_STATUS_LABELS[status]} (${status})`,
    `Ngày tiếp nhận: ${lead.created_at || "—"}`,
  ].join("\n");
}

/* ------------------------------------------------------------------ */
/* 1. PHÂN TÍCH LEAD                                                  */
/* ------------------------------------------------------------------ */

/**
 * Phân tích lead theo đúng bước hiện tại trong phễu:
 * chấm điểm, tóm tắt nhu cầu, gợi ý gói, việc cần làm tiếp và soạn tin nhắn cho sale.
 */
export async function analyzeLead(
  lead: LeadForAi,
  history: { type: string; note: string | null; created_at: string }[] = []
): Promise<AiAnalysis> {
  const status = getLeadStatus(lead);
  const packages = PRICING_TIERS.map((t) => `- ${t.name} (${t.scale}): ${t.description}`).join("\n");
  const services = CORE_SERVICES.map((s) => `- ${s.title}`).join("\n");
  const historyText = history.length
    ? history
        .slice(0, 12)
        .map((h) => `- ${h.created_at}: ${h.type}${h.note ? ` — ${h.note}` : ""}`)
        .join("\n")
    : "(chưa có)";

  const prompt = `Bạn là trưởng phòng kinh doanh của ${COMPANY_INFO.brandName} (tổ chức sự kiện & du lịch doanh nghiệp, Hà Nội, hotline ${COMPANY_INFO.hotlineDisplay}).
Hãy phân tích lead dưới đây để hỗ trợ nhân viên sale. Trả lời bằng tiếng Việt, ngắn gọn, thực tế, KHÔNG bịa thông tin khách chưa cung cấp.

THÔNG TIN LEAD
${describeLead(lead)}

LỊCH SỬ TƯƠNG TÁC (mới nhất trước)
${historyText}

BƯỚC PHỄU HIỆN TẠI: ${LEAD_STATUS_LABELS[status]}
- Điều kiện của bước: ${STAGE_GUIDE[status].entryRule}
- Mục tiêu tiếp theo: ${STAGE_GUIDE[status].nextAction}

CÁC GÓI DỊCH VỤ CỦA CÔNG TY
${packages}

CÁC DÒNG DỊCH VỤ
${services}

QUY TẮC CHẤM ĐIỂM
- HOT: có SĐT + nhu cầu rõ (loại sự kiện, thời gian gần hoặc cụ thể, quy mô/ngân sách) hoặc khách đang thương lượng tích cực.
- WARM: có liên hệ nhưng thiếu nhiều thông tin, hoặc thời gian còn xa / chưa rõ.
- COLD: chưa có SĐT và chưa có nhu cầu, hoặc im lặng lâu sau báo giá.

YÊU CẦU ĐẦU RA: CHỈ trả về JSON đúng cấu trúc:
{
  "score": "HOT" | "WARM" | "COLD",
  "score_reason": "1 câu lý do",
  "summary": "tóm tắt nhu cầu khách trong 1-2 câu",
  "needs": {
    "event_type": "...hoặc null", "event_date": "...hoặc null", "location": "...hoặc null",
    "guest_count": "...hoặc null", "budget": "...hoặc null",
    "requirements": ["hạng mục khách yêu cầu"],
    "missing_info": ["thông tin sale cần hỏi thêm để báo giá chính xác"]
  },
  "suggested_package": "tên 1 gói phù hợp nhất trong danh sách trên, kèm 1 câu lý do",
  "next_action": "việc cụ thể sale cần làm NGAY để đưa lead sang bước tiếp theo",
  "message": "tin nhắn Zalo/Messenger sale gửi khách cho bước hiện tại: xưng 'em', gọi khách 'anh/chị', lịch sự, tối đa 5 câu, hỏi các thông tin còn thiếu, không đưa ra giá cụ thể"
}`;

  const raw = await callGeminiWithFallback({ apiKey: apiKey(), prompt, temperature: 0.3 });
  const data = parseJson<Record<string, unknown>>(raw);
  const needs = (data.needs || {}) as Record<string, unknown>;
  const score = String(data.score || "").toUpperCase();

  return {
    score: score === "HOT" || score === "WARM" || score === "COLD" ? score : "WARM",
    score_reason: str(data.score_reason, 300),
    summary: str(data.summary, 600),
    needs: {
      event_type: str(needs.event_type, 200) || null,
      event_date: str(needs.event_date, 100) || null,
      location: str(needs.location, 200) || null,
      guest_count: str(needs.guest_count, 100) || null,
      budget: str(needs.budget, 100) || null,
      requirements: strList(needs.requirements),
      missing_info: strList(needs.missing_info),
    },
    suggested_package: str(data.suggested_package, 300),
    next_action: str(data.next_action, 400),
    message: str(data.message, 1500),
  };
}

/** Lưu kết quả phân tích vào lead + ghi nhật ký. */
export async function saveAnalysis(client: SupabaseClient, leadId: string, a: AiAnalysis, actor = "AI") {
  const { error } = await client
    .from("leads")
    .update({
      ai_score: a.score,
      ai_score_reason: a.score_reason,
      ai_summary: a.summary,
      ai_needs: a.needs,
      ai_suggested_package: a.suggested_package,
      ai_next_action: a.next_action,
      ai_message: a.message,
      ai_analyzed_at: new Date().toISOString(),
    })
    .eq("id", leadId);
  if (error) throw error;
  await client.from("lead_activities").insert([
    {
      lead_id: leadId,
      type: "ai_analysis",
      actor,
      note: `Lead ${AI_SCORE_LABELS[a.score]}: ${a.score_reason}\nViệc tiếp theo: ${a.next_action}`,
    },
  ]);
}

/** Tải lead + lịch sử, phân tích rồi lưu. Dùng chung cho tác vụ nền và nút "Phân tích AI". */
export async function analyzeAndSaveLead(client: SupabaseClient, leadId: string, actor = "AI") {
  const { data: lead, error } = await client.from("leads").select("*").eq("id", leadId).single();
  if (error || !lead) throw error || new Error("Không tìm thấy lead");
  const { data: history } = await client
    .from("lead_activities")
    .select("type,note,created_at")
    .eq("lead_id", leadId)
    .order("created_at", { ascending: false })
    .limit(12);
  const analysis = await analyzeLead(lead as LeadForAi, history ?? []);
  await saveAnalysis(client, leadId, analysis, actor);
  return { lead: lead as LeadForAi, analysis };
}

/* ------------------------------------------------------------------ */
/* 2. LẬP BÁO GIÁ NHÁP TỪ BẢNG ĐƠN GIÁ                                */
/* ------------------------------------------------------------------ */

/**
 * AI chọn hạng mục + số lượng theo nhu cầu khách. GIÁ LUÔN LẤY TỪ BẢNG ĐƠN GIÁ,
 * AI không được đặt giá; hạng mục không có trong bảng giá bị loại bỏ.
 */
export async function draftQuote(
  lead: LeadForAi,
  priceItems: PriceItem[]
): Promise<{ items: DraftQuoteItem[]; rationale: string }> {
  if (priceItems.length === 0) {
    throw new Error("Bảng đơn giá đang trống. Vào Admin → Bảng đơn giá để nhập giá trước.");
  }
  const catalog = priceItems
    .map((p, i) => `${i + 1}. [${p.id}] (${p.category}) ${p.name} — ĐVT: ${p.unit}${p.description ? ` — ${p.description}` : ""}`)
    .join("\n");

  const prompt = `Bạn là chuyên viên dự toán của ${COMPANY_INFO.brandName}. Lập báo giá NHÁP cho khách dưới đây
bằng cách CHỌN hạng mục trong BẢNG ĐƠN GIÁ và ước lượng SỐ LƯỢNG phù hợp với quy mô, loại sự kiện, yêu cầu.

THÔNG TIN KHÁCH
${describeLead(lead)}

BẢNG ĐƠN GIÁ (chỉ được chọn các mã trong ngoặc vuông)
${catalog}

QUY TẮC
- Chỉ dùng mã có trong bảng. Không tự tạo hạng mục, không đưa ra giá.
- Chọn đủ hạng mục cốt lõi cho loại sự kiện; nếu có ngân sách, ưu tiên phương án nằm trong ngân sách.
- Số lượng là số dương hợp lý theo đơn vị tính.

CHỈ trả về JSON: {"items":[{"id":"mã","quantity":số}],"rationale":"1-2 câu giải thích phương án"}`;

  const raw = await callGeminiWithFallback({ apiKey: apiKey(), prompt, temperature: 0.2 });
  const data = parseJson<{ items?: { id?: string; quantity?: number }[]; rationale?: string }>(raw);
  const byId = new Map(priceItems.map((p) => [p.id, p]));
  const items: DraftQuoteItem[] = [];
  for (const pick of data.items || []) {
    const price = pick.id ? byId.get(pick.id) : undefined;
    const quantity = Number(pick.quantity);
    if (!price || !Number.isFinite(quantity) || quantity <= 0) continue;
    items.push({
      title: price.name,
      unit: price.unit,
      quantity: Math.min(Math.round(quantity * 100) / 100, 100000),
      unitPrice: Number(price.unit_price),
    });
  }
  if (items.length === 0) throw new Error("AI chưa chọn được hạng mục phù hợp từ bảng giá.");
  return { items, rationale: str(data.rationale, 500) };
}

export function statusLabel(status?: string | null) {
  return status && isLeadStatus(status) ? LEAD_STATUS_LABELS[status] : status || "";
}
