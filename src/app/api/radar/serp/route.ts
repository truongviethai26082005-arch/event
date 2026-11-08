import { NextResponse } from "next/server";
import { getAdminSupabaseClient } from "@/lib/supabase/server";
import { SERPER_MONTHLY_LIMIT, searchGoogle } from "@/lib/radar/serper";
import { keywordsNeedingCompare, runSerpScan } from "@/lib/radar/run";
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

  const [used, queue, kw, lastRuns, needCompare] = await Promise.all([
    serperUsageThisMonth(supabase),
    scrapeQueue(supabase),
    supabase.from("seo_keywords").select("id,is_tracked"),
    supabase.from("radar_runs").select("*").order("created_at", { ascending: false }).limit(8),
    keywordsNeedingCompare(supabase).catch(() => []),
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
    compareNeeded: needCompare.length,
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    // Lịch tự chạy hằng tuần (vercel.json) cần CRON_SECRET + SUPABASE_SERVICE_ROLE_KEY trên Vercel
    cronReady: Boolean(process.env.CRON_SECRET && process.env.SUPABASE_SERVICE_ROLE_KEY),
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
      const r = await runSerpScan(supabase, { keywordIds: body.keywordIds, actor, kind: "serp-live" });
      const queue = await scrapeQueue(supabase);
      return NextResponse.json({ ...r, pending: queue.pending.length });
    }

    return NextResponse.json({ error: "Thao tác không hợp lệ." }, { status: 400 });
  } catch (err) {
    console.error("[radar/serp]", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "Lỗi không xác định." }, { status: 500 });
  }
}
