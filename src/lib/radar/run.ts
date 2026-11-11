// CHỈ dùng ở máy chủ. Luồng chạy dùng chung cho nút bấm (admin) và lịch tự chạy (cron).
import type { SupabaseClient } from "@supabase/supabase-js";
import { SERPER_MONTHLY_LIMIT, searchGoogle } from "@/lib/radar/serper";
import { scrapeQueue, serperUsageThisMonth } from "@/lib/radar/serp-store";
import { readCompetitorPage } from "@/lib/radar/page-reader";
import { compareKeyword } from "@/lib/radar/compare";

/* ------------------------------------------------------------------ */
/* BƯỚC 2: quét top Google                                             */
/* ------------------------------------------------------------------ */
export interface ScanResult {
  saved: number;
  credits: number;
  skipped: number;
  errors: string[];
  dropped: { keyword: string; from: number; to: number | null }[];
  message: string;
}

export async function runSerpScan(
  client: SupabaseClient,
  opts: { keywordIds?: string[]; actor: string; kind: "serp-live" | "cron" }
): Promise<ScanResult> {
  let query = client.from("seo_keywords").select("id,keyword,our_position").eq("is_tracked", true).order("created_at");
  if (opts.keywordIds?.length) query = query.in("id", opts.keywordIds);
  const { data: keywords, error } = await query;
  if (error) throw error;
  if (!keywords?.length) throw new Error("Chưa có từ khóa nào đang theo dõi.");

  const remaining = SERPER_MONTHLY_LIMIT - (await serperUsageThisMonth(client));
  if (remaining < 1) throw new Error(`Đã dùng hết ${SERPER_MONTHLY_LIMIT} lượt Serper của tháng.`);

  const batch = keywords.slice(0, remaining);
  const skipped = keywords.length - batch.length;
  const errors: string[] = [];
  const dropped: ScanResult["dropped"] = [];
  let credits = 0;
  let saved = 0;

  for (let i = 0; i < batch.length; i += 3) {
    await Promise.all(
      batch.slice(i, i + 3).map(async (k) => {
        try {
          const r = await searchGoogle(k.keyword);
          credits += r.credits;
          const now = new Date().toISOString();
          const { error: snapError } = await client.from("serp_snapshots").insert([
            {
              keyword_id: k.id,
              scanned_at: now,
              results: r.results,
              our_position: r.ourPosition,
              people_also_ask: r.peopleAlsoAsk,
              related_searches: r.relatedSearches,
              credits_used: r.credits,
            },
          ]);
          if (snapError) throw snapError;
          // Bước 7: tụt hạng (tụt ≥ 3 bậc hoặc rơi khỏi top 10)
          const prev = k.our_position as number | null;
          if (prev && (!r.ourPosition || r.ourPosition - prev >= 3)) {
            dropped.push({ keyword: k.keyword, from: prev, to: r.ourPosition });
          }
          await client
            .from("seo_keywords")
            .update({ our_position: r.ourPosition, top_competitor: r.topCompetitor, last_scanned_at: now })
            .eq("id", k.id);
          saved += 1;
        } catch (err) {
          errors.push(`${k.keyword}: ${err instanceof Error ? err.message : "lỗi"}`);
        }
      })
    );
  }

  const queue = await scrapeQueue(client);
  const status = errors.length ? (saved ? "warning" : "error") : skipped || dropped.length ? "warning" : "success";
  const message =
    `Quét ${saved}/${keywords.length} từ khóa, dùng ${credits} lượt Serper. ${queue.pending.length} bài đối thủ chờ cào.` +
    (dropped.length ? ` ${dropped.length} từ khóa TỤT HẠNG.` : "") +
    (skipped ? ` Bỏ qua ${skipped} từ khóa vì chạm giới hạn ${SERPER_MONTHLY_LIMIT} lượt/tháng.` : "") +
    (errors.length ? ` ${errors.length} lỗi.` : "");
  await client.from("radar_runs").insert([
    { kind: opts.kind, status, credits, keywords_count: saved, message, details: { errors, dropped, source: "serper" }, actor: opts.actor },
  ]);
  return { saved, credits, skipped, errors, dropped, message };
}

/* ------------------------------------------------------------------ */
/* BƯỚC 3: cào bài (1 đợt)                                             */
/* ------------------------------------------------------------------ */
export async function runScrapeBatch(client: SupabaseClient, limit: number, actor: string) {
  const queue = await scrapeQueue(client);
  const batch = queue.pending.slice(0, limit);
  let ok = 0;
  const failed: string[] = [];
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
        await client.from("serp_pages").upsert([row], { onConflict: "url" });
      })
    );
  }
  const remaining = Math.max(queue.pending.length - batch.length, 0);
  if (batch.length) {
    await client.from("radar_runs").insert([
      {
        kind: "scrape",
        status: failed.length ? (ok ? "warning" : "error") : "success",
        pages_count: ok,
        message: `Cào ${ok}/${batch.length} bài đối thủ${failed.length ? `, ${failed.length} trang không đọc được` : ""}. Còn ${remaining} bài chờ.`,
        details: { failed },
        actor,
      },
    ]);
  }
  return { processed: batch.length, ok, failed, remaining };
}

/* ------------------------------------------------------------------ */
/* BƯỚC 4–5: so sánh các từ khóa cần so sánh lại                        */
/* ------------------------------------------------------------------ */

/** Từ khóa có lần quét mới hơn lần so sánh gần nhất (hoặc chưa so sánh) và đã có ≥ 2 bài đối thủ cào được. */
export async function keywordsNeedingCompare(client: SupabaseClient) {
  const [{ data: keywords }, { data: comparisons }, { data: snaps }] = await Promise.all([
    client.from("seo_keywords").select("id,keyword,last_scanned_at").eq("is_tracked", true).not("last_scanned_at", "is", null),
    client.from("serp_comparisons").select("keyword_id,created_at").order("created_at", { ascending: false }),
    client.from("serp_snapshots").select("keyword_id,results,scanned_at").order("scanned_at", { ascending: false }),
  ]);
  const lastCompare = new Map<string, string>();
  (comparisons ?? []).forEach((c) => !lastCompare.has(c.keyword_id) && lastCompare.set(c.keyword_id, c.created_at));
  const latestSnap = new Map<string, { link: string; kind: string }[]>();
  (snaps ?? []).forEach((s) => !latestSnap.has(s.keyword_id) && latestSnap.set(s.keyword_id, s.results as { link: string; kind: string }[]));

  const candidates = (keywords ?? []).filter((k) => {
    const lc = lastCompare.get(k.id);
    return !lc || (k.last_scanned_at && k.last_scanned_at > lc);
  });
  const allLinks = [...new Set(candidates.flatMap((k) => (latestSnap.get(k.id) || []).filter((r) => r.kind === "competitor").map((r) => r.link)))];
  const okLinks = new Set<string>();
  for (let i = 0; i < allLinks.length; i += 100) {
    const { data } = await client.from("serp_pages").select("url").is("scrape_error", null).in("url", allLinks.slice(i, i + 100));
    (data ?? []).forEach((p) => okLinks.add(p.url));
  }
  return candidates.filter((k) => (latestSnap.get(k.id) || []).filter((r) => r.kind === "competitor" && okLinks.has(r.link)).length >= 2);
}

export async function runCompareBatch(client: SupabaseClient, limit: number, actor: string, keywordId?: string) {
  const targets = keywordId ? [{ id: keywordId, keyword: "" }] : (await keywordsNeedingCompare(client)).slice(0, limit);
  let proposals = 0;
  const errors: string[] = [];
  const skipped: string[] = [];
  for (const k of targets) {
    try {
      const out = await compareKeyword(client, k.id);
      if (out.proposalId) proposals += 1;
      if (out.skippedReason) skipped.push(`${k.keyword}: ${out.skippedReason}`);
    } catch (err) {
      errors.push(`${k.keyword || "từ khóa"}: ${err instanceof Error ? err.message : "lỗi"}`);
    }
  }
  const remaining = keywordId ? 0 : Math.max((await keywordsNeedingCompare(client)).length, 0);
  if (targets.length) {
    await client.from("radar_runs").insert([
      {
        kind: "compare",
        status: errors.length ? (proposals ? "warning" : "error") : "success",
        keywords_count: targets.length - errors.length,
        message: `So sánh ${targets.length - errors.length}/${targets.length} từ khóa, tạo/cập nhật ${proposals} đề xuất viết.${skipped.length ? ` ${skipped.length} từ khóa đang tốt, không cần viết.` : ""}${errors.length ? ` ${errors.length} lỗi.` : ""}`,
        details: { errors, skipped },
        actor,
      },
    ]);
  }
  return { compared: targets.length - errors.length, proposals, errors, skipped, remaining };
}
