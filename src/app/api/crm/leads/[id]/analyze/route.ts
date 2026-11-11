import { NextResponse } from "next/server";
import { getAdminSupabaseClient } from "@/lib/supabase/server";
import { analyzeAndSaveLead } from "@/lib/crm/lead-ai";

export const maxDuration = 60;

/** Sale bấm "Phân tích AI" / "Phân tích lại": AI phân tích lead theo bước hiện tại và lưu kết quả. */
export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await getAdminSupabaseClient();
  if (!supabase) return NextResponse.json({ error: "Chưa đăng nhập quản trị." }, { status: 401 });
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ error: "Máy chủ chưa cấu hình GEMINI_API_KEY." }, { status: 503 });
  }

  const { id } = await params;
  const { data: auth } = await supabase.auth.getUser();
  try {
    const { analysis } = await analyzeAndSaveLead(supabase, id, auth.user?.email ? `AI (${auth.user.email})` : "AI");
    return NextResponse.json({ analysis });
  } catch (err) {
    console.error("[analyze lead]", err);
    const message = err instanceof Error ? err.message : "AI phân tích thất bại.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
