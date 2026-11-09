import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { runCompareBatch, runScrapeBatch, runSerpScan } from "@/lib/radar/run";

/** Ca chạy tự động mỗi tuần: quét top Google → cào bài → so sánh & tạo đề xuất. */
export const maxDuration = 300;

/**
 * Gọi bởi Vercel Cron (vercel.json). Bảo vệ bằng CRON_SECRET (Vercel tự gửi header
 * "Authorization: Bearer <CRON_SECRET>"). Cần SUPABASE_SERVICE_ROLE_KEY để ghi dữ liệu không qua đăng nhập.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Không có quyền." }, { status: 401 });
  }
  const client = createServiceClient();
  if (!client) return NextResponse.json({ error: "Thiếu SUPABASE_SERVICE_ROLE_KEY." }, { status: 503 });

  const started = Date.now();
  const timeLeft = () => 270_000 - (Date.now() - started);
  const report: Record<string, unknown> = {};
  try {
    report.scan = await runSerpScan(client, { actor: "Lịch tự chạy", kind: "cron" });
  } catch (err) {
    report.scan = { error: err instanceof Error ? err.message : "lỗi" };
  }
  let scraped = 0;
  while (timeLeft() > 90_000) {
    const r = await runScrapeBatch(client, 6, "Lịch tự chạy");
    scraped += r.ok;
    if (!r.processed || !r.remaining) break;
  }
  report.scraped = scraped;
  let proposals = 0;
  while (timeLeft() > 60_000 && process.env.GEMINI_API_KEY) {
    const r = await runCompareBatch(client, 2, "Lịch tự chạy");
    proposals += r.proposals;
    if (!r.compared || !r.remaining) break;
  }
  report.proposals = proposals;
  return NextResponse.json(report);
}
