import { NextResponse } from "next/server";
import { getAdminSupabaseClient } from "@/lib/supabase/server";
import { SERPER_MONTHLY_LIMIT, searchGoogle } from "@/lib/radar/serper";
import { scrapeQueue, serperUsageThisMonth } from "@/lib/radar/serp-store";
import clustersFile from "@/app/api/radar/brand/clusters.json";

/** Quét nhiều từ khóa có thể mất 1–2 phút. */
export const maxDuration = 300;

type Admin = NonNullable<Awaited<ReturnType<typeof getAdminSupabaseClient>>>;

async function requireAdmin() {
  const supabase = await getAdminSupabaseClient();
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return { supabase, actor: data.user?.email || "admin" };
}

/** GET: trạng thái cho khung "Máy đang tự làm gì". */
export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Chưa đăng nhập quản trị." }, { status: 401 });
  const { supabase } = admin;

  const [used, queue, kw, lastRuns] = await Promise.all([
    serperUsageThisMonth(supabase),
    scrapeQueue(supabase),
    supabase.from("seo_keywords").select("id,is_tracked"),
    supabase.from("radar_runs").select("*").order("created_at", { ascending: false }).limit(5),
  ]);
  if (kw.error) {
    return NextResponse.json(
      { error: "Chưa có bảng Radar. Hãy chạy migration supabase/migrations/20261109020000_radar_serp.sql." },
      { status: 500 }
    );
  }
  return NextResponse.json({
    serperConfigured: Boolean(process.env.SERPER_API_KEY),
    usedThisMonth: used,
    monthlyLimit: SERPER_MONTHLY_LIMIT,
    keywordsTotal: kw.data?.length ?? 0,
    keywordsTracked: kw.data?.filter((k) => k.is_tracked).length ?? 0,
    queue: { pending: queue.pending.length, scraped: queue.scraped, failed: queue.failed, total: queue.total },
    recentRuns: lastRuns.data ?? [],
  });
}

interface SeedCluster {
  id: string;
  seed_keywords?: string[];
}

/** Nạp từ khóa gốc trong brand/clusters.json (chỉ thêm từ khóa chưa có). */
async function seedKeywords({ supabase }: { supabase: Admin }) {
  const clusters = (clustersFile as { clusters: SeedCluster[] }).clusters.filter((c) => c.id !== "ngoai-pham-vi");
  const { data: existing } = await supabase.from("seo_keywords").select("keyword");
  const have = new Set((existing ?? []).map((k) => String(k.keyword).toLowerCase().trim()));
  const rows = clusters.flatMap((c) =>
    (c.seed_keywords || [])
      .map((k) => k.trim())
      .filter((k) => k && !have.has(k.toLowerCase()))
      .map((keyword) => ({ keyword, cluster_id: c.id }))
  );
  if (rows.length) {
    const { error } = await supabase.from("seo_keywords").insert(rows);
    if (error) throw error;
  }
  return NextResponse.json({ added: rows.length });
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Chưa đăng nhập quản trị." }, { status: 401 });
  const { supabase, actor } = admin;
  const body = (await request.json().catch(() => ({}))) as {
    action?: "seed" | "dry-run" | "live";
    keyword?: string;
    keywordIds?: string[];
  };

  try {
    if (body.action === "seed") return await seedKeywords({ supabase });

    if (!process.env.SERPER_API_KEY) {
      return NextResponse.json({ error: "Máy chủ chưa cấu hình SERPER_API_KEY." }, { status: 503 });
    }
    const used = await serperUsageThisMonth(supabase);
    const remaining = SERPER_MONTHLY_LIMIT - used;

    /* ---------- CHẠY THỬ: 1 từ khóa, xem kết quả, KHÔNG lưu ---------- */
    if (body.action === "dry-run") {
      const keyword = String(body.keyword || "").trim();
      if (!keyword) return NextResponse.json({ error: "Nhập từ khóa để chạy thử." }, { status: 400 });
      if (remaining < 1) {
        return NextResponse.json({ error: `Đã dùng hết ${SERPER_MONTHLY_LIMIT} lượt Serper của tháng.` }, { status: 429 });
      }
      const result = await searchGoogle(keyword);
      await supabase.from("radar_runs").insert([
        {
          kind: "serp-dry",
          credits: result.credits,
          keywords_count: 1,
          message: `Chạy thử "${keyword}": ${result.results.filter((r) => r.kind === "competitor").length} đối thủ trong top 10`,
          actor,
        },
      ]);
      return NextResponse.json({ result, usedThisMonth: used + result.credits });
    }

    /* ---------- CHẠY THẬT: các từ khóa đang theo dõi, lưu kết quả ---------- */
    if (body.action === "live") {
      let query = supabase.from("seo_keywords").select("id,keyword").eq("is_tracked", true).order("created_at");
      if (body.keywordIds?.length) query = query.in("id", body.keywordIds);
      const { data: keywords, error } = await query;
      if (error) throw error;
      if (!keywords?.length) return NextResponse.json({ error: "Chưa có từ khóa nào đang theo dõi." }, { status: 400 });
      if (remaining < 1) {
        return NextResponse.json({ error: `Đã dùng hết ${SERPER_MONTHLY_LIMIT} lượt Serper của tháng.` }, { status: 429 });
      }

      const batch = keywords.slice(0, remaining); // không vượt giới hạn tháng
      const skipped = keywords.length - batch.length;
      const errors: string[] = [];
      let credits = 0;
      let saved = 0;

      // Chạy 3 từ khóa song song
      for (let i = 0; i < batch.length; i += 3) {
        await Promise.all(
          batch.slice(i, i + 3).map(async (k) => {
            try {
              const r = await searchGoogle(k.keyword);
              credits += r.credits;
              const now = new Date().toISOString();
              const { error: snapError } = await supabase.from("serp_snapshots").insert([
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
              await supabase
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

      const queue = await scrapeQueue(supabase);
      const status = errors.length ? (saved ? "warning" : "error") : skipped ? "warning" : "success";
      const message =
        `Quét ${saved}/${keywords.length} từ khóa, dùng ${credits} lượt Serper. ` +
        `${queue.pending.length} bài đối thủ chờ cào.` +
        (skipped ? ` Bỏ qua ${skipped} từ khóa vì chạm giới hạn ${SERPER_MONTHLY_LIMIT} lượt/tháng.` : "") +
        (errors.length ? ` ${errors.length} lỗi.` : "");
      await supabase.from("radar_runs").insert([
        { kind: "serp-live", status, credits, keywords_count: saved, message, details: { errors }, actor },
      ]);
      return NextResponse.json({ saved, credits, skipped, errors, message, pending: queue.pending.length });
    }

    return NextResponse.json({ error: "Thao tác không hợp lệ." }, { status: 400 });
  } catch (err) {
    console.error("[radar/serp]", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "Lỗi không xác định." }, { status: 500 });
  }
}
