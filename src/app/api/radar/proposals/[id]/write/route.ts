import { NextResponse } from "next/server";
import { getAdminSupabaseClient } from "@/lib/supabase/server";
import { writeProposal } from "@/lib/radar/writer";

export const maxDuration = 180;

/** Bước 6: AI viết bài theo brief của đề xuất (viết mới -> bài nháp; viết lại -> bản chờ áp dụng). */
export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await getAdminSupabaseClient();
  if (!supabase) return NextResponse.json({ error: "Chưa đăng nhập quản trị." }, { status: 401 });
  if (!process.env.GEMINI_API_KEY) return NextResponse.json({ error: "Máy chủ chưa cấu hình GEMINI_API_KEY." }, { status: 503 });
  const { id } = await params;
  const { data: auth } = await supabase.auth.getUser();
  try {
    const draft = await writeProposal(supabase, id, auth.user?.email || "admin");
    return NextResponse.json({ draft });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "AI viết bài thất bại." }, { status: 500 });
  }
}
