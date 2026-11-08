import { NextResponse } from "next/server";
import { getAdminSupabaseClient } from "@/lib/supabase/server";
import { runScrapeBatch } from "@/lib/radar/run";

export const maxDuration = 120;

/**
 * Bước 3, cào bài: lấy nội dung các bài đối thủ đang top (hàng chờ), mỗi lần gọi xử lý `limit` bài.
 * Trình duyệt gọi lặp lại tới khi hàng chờ = 0 (hiện tiến độ cho người dùng).
 */
export async function POST(request: Request) {
  const supabase = await getAdminSupabaseClient();
  if (!supabase) return NextResponse.json({ error: "Chưa đăng nhập quản trị." }, { status: 401 });
  const { data: auth } = await supabase.auth.getUser();
  const body = (await request.json().catch(() => ({}))) as { limit?: number };
  const limit = Math.min(Math.max(Number(body.limit) || 5, 1), 8);
  return NextResponse.json(await runScrapeBatch(supabase, limit, auth.user?.email || "admin"));
}
