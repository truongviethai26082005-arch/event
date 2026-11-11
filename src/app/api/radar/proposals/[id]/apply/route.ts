import { NextResponse } from "next/server";
import { getAdminSupabaseClient } from "@/lib/supabase/server";
import { applyRewrite } from "@/lib/radar/writer";

/** Áp dụng bản viết lại vào bài cũ (giữ nguyên đường dẫn), chặn nếu còn [CẦN SỐ LIỆU]. */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await getAdminSupabaseClient();
  if (!supabase) return NextResponse.json({ error: "Chưa đăng nhập quản trị." }, { status: 401 });
  const { id } = await params;
  const body = (await request.json().catch(() => ({}))) as { content?: string; title?: string };
  try {
    await applyRewrite(supabase, id, body);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Không áp dụng được." }, { status: 400 });
  }
}
