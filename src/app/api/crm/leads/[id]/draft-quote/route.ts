import { NextResponse } from "next/server";
import { getAdminSupabaseClient } from "@/lib/supabase/server";
import { LeadForAi, PriceItem, draftQuote } from "@/lib/crm/lead-ai";

export const maxDuration = 60;

/** "AI lập báo giá nháp": chọn hạng mục + số lượng từ Bảng đơn giá theo nhu cầu của lead. */
export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await getAdminSupabaseClient();
  if (!supabase) return NextResponse.json({ error: "Chưa đăng nhập quản trị." }, { status: 401 });
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ error: "Máy chủ chưa cấu hình GEMINI_API_KEY." }, { status: 503 });
  }

  const { id } = await params;
  const [leadRes, priceRes] = await Promise.all([
    supabase.from("leads").select("*").eq("id", id).single(),
    supabase
      .from("price_items")
      .select("id,category,name,unit,unit_price,description")
      .eq("is_active", true)
      .order("category")
      .order("sort_order"),
  ]);
  if (leadRes.error || !leadRes.data) {
    return NextResponse.json({ error: "Không tìm thấy lead." }, { status: 404 });
  }
  if (priceRes.error) {
    return NextResponse.json(
      { error: "Chưa có bảng đơn giá. Hãy chạy migration 20261109010000_crm_ai_pricing.sql." },
      { status: 500 }
    );
  }

  try {
    const result = await draftQuote(leadRes.data as LeadForAi, (priceRes.data ?? []) as PriceItem[]);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[draft quote]", err);
    const message = err instanceof Error ? err.message : "AI lập báo giá thất bại.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
