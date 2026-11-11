import { NextResponse } from "next/server";
import { getAdminSupabaseClient } from "@/lib/supabase/server";
import { runCompareBatch } from "@/lib/radar/run";

export const maxDuration = 180;

/**
 * Bước 4–5: so sánh (A mục bắt buộc / B từ khóa top / C khe hở) và tạo đề xuất viết.
 * Body: { keywordId } để so sánh 1 từ khóa, hoặc {} để so sánh tối đa 3 từ khóa đang cần (gọi lặp tới khi remaining = 0).
 */
export async function POST(request: Request) {
  const supabase = await getAdminSupabaseClient();
  if (!supabase) return NextResponse.json({ error: "Chưa đăng nhập quản trị." }, { status: 401 });
  if (!process.env.GEMINI_API_KEY) return NextResponse.json({ error: "Máy chủ chưa cấu hình GEMINI_API_KEY." }, { status: 503 });
  const { data: auth } = await supabase.auth.getUser();
  const body = (await request.json().catch(() => ({}))) as { keywordId?: string };
  try {
    return NextResponse.json(await runCompareBatch(supabase, 3, auth.user?.email || "admin", body.keywordId));
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "So sánh thất bại." }, { status: 500 });
  }
}
