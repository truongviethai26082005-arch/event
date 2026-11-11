// CHỈ dùng ở máy chủ.
import type { SupabaseClient } from "@supabase/supabase-js";
import type { SerpResult } from "@/lib/radar/serper";

/** Số lượt Serper đã dùng từ đầu tháng (cộng cột credits của radar_runs). */
export async function serperUsageThisMonth(client: SupabaseClient) {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const { data } = await client
    .from("radar_runs")
    .select("credits")
    .gte("created_at", monthStart)
    .in("kind", ["serp-dry", "serp-live", "cron"]);
  return (data ?? []).reduce((sum, row) => sum + (Number(row.credits) || 0), 0);
}

export interface QueueItem {
  url: string;
  domain: string;
  keyword: string;
  position: number;
}

/**
 * Hàng chờ cào bài (bước 3): các bài ĐỐI THỦ trong top 10 ở lần quét gần nhất của mỗi từ khóa
 * mà chưa có trong serp_pages (kể cả bản ghi lỗi, để không cào lại mãi).
 */
export async function scrapeQueue(client: SupabaseClient) {
  const since = new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString();
  const { data: snaps } = await client
    .from("serp_snapshots")
    .select("keyword_id,results,scanned_at,seo_keywords(keyword)")
    .gte("scanned_at", since)
    .order("scanned_at", { ascending: false });

  const seenKeyword = new Set<string>();
  const byUrl = new Map<string, QueueItem>();
  (snaps ?? []).forEach((s) => {
    if (seenKeyword.has(s.keyword_id)) return; // chỉ lấy lần quét mới nhất của mỗi từ khóa
    seenKeyword.add(s.keyword_id);
    const kw = (s.seo_keywords as unknown as { keyword?: string } | null)?.keyword || "";
    ((s.results || []) as SerpResult[])
      .filter((r) => r.kind === "competitor" && r.link)
      .forEach((r) => {
        if (!byUrl.has(r.link)) byUrl.set(r.link, { url: r.link, domain: r.domain, keyword: kw, position: r.position });
      });
  });

  const urls = [...byUrl.keys()];
  const done = new Set<string>();
  let failed = 0;
  for (let i = 0; i < urls.length; i += 100) {
    const { data } = await client.from("serp_pages").select("url,scrape_error").in("url", urls.slice(i, i + 100));
    (data ?? []).forEach((p) => {
      done.add(p.url);
      if (p.scrape_error) failed += 1;
    });
  }
  const pending = urls.filter((u) => !done.has(u)).map((u) => byUrl.get(u)!);
  return { pending, total: urls.length, scraped: done.size - failed, failed };
}
