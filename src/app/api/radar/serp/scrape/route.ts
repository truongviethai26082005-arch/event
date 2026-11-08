import { NextResponse } from "next/server";
import { getAdminSupabaseClient } from "@/lib/supabase/server";
import { readCompetitorPage } from "@/lib/radar/page-reader";
import { scrapeQueue } from "@/lib/radar/serp-store";

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

  const queue = await scrapeQueue(supabase);
  const batch = queue.pending.slice(0, limit);
  let ok = 0;
  const failed: string[] = [];

  // 2 bài song song cho nhẹ dịch vụ đọc trang
  for (let i = 0; i < batch.length; i += 2) {
    await Promise.all(
      batch.slice(i, i + 2).map(async (item) => {
        let row;
        try {
          const page = await readCompetitorPage(item.url);
          row = {
            url: item.url,
            domain: item.domain,
            title: page.title || item.url,
            headings: page.headings,
            clean_text: page.text.slice(0, 80_000),
            word_count: page.wordCount,
            scrape_error: null,
          };
          ok += 1;
        } catch (err) {
          const reason = err instanceof Error ? err.message.slice(0, 300) : "Không đọc được";
          row = { url: item.url, domain: item.domain, title: item.url, scrape_error: reason };
          failed.push(`${item.domain}: ${reason}`);
        }
        await supabase.from("serp_pages").upsert([row], { onConflict: "url" });
      })
    );
  }

  const remaining = Math.max(queue.pending.length - batch.length, 0);
  if (batch.length) {
    await supabase.from("radar_runs").insert([
      {
        kind: "scrape",
        status: failed.length ? (ok ? "warning" : "error") : "success",
        pages_count: ok,
        message: `Cào ${ok}/${batch.length} bài đối thủ${failed.length ? `, ${failed.length} trang không đọc được` : ""}. Còn ${remaining} bài chờ.`,
        details: { failed },
        actor: auth.user?.email || "admin",
      },
    ]);
  }
  return NextResponse.json({ processed: batch.length, ok, failed, remaining });
}
