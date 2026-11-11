"use client";

import { useEffect, useMemo, useState } from "react";
import { ExternalLink } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Badge, Card, Empty, Keyword, Status } from "./shared";

interface Snap { keyword_id: string; our_position: number | null; scanned_at: string }
interface PostRow { id: string; title: string; slug: string; status: string }
interface LeadRow { landing_path: string | null; referrer: string | null; status: string; budget: number | null; actual_revenue: number | null }

const vnd = (n: number) => `${Math.round(n).toLocaleString("vi-VN")}đ`;

/** Bước 7 – Theo dõi: thứ hạng theo thời gian + bài nào mang về khách. */
export default function TrackTab({ keywords, status }: { keywords: Keyword[]; status: Status | null }) {
  const [snaps, setSnaps] = useState<Snap[]>([]);
  const [posts, setPosts] = useState<PostRow[]>([]);
  const [leads, setLeads] = useState<LeadRow[] | null>(null);

  useEffect(() => {
    const t = window.setTimeout(async () => {
      const supabase = createSupabaseBrowserClient();
      const [s, p, l] = await Promise.all([
        supabase.from("serp_snapshots").select("keyword_id,our_position,scanned_at").order("scanned_at", { ascending: false }).limit(1500),
        supabase.from("posts").select("id,title,slug,status").eq("status", "published"),
        supabase.from("leads").select("landing_path,referrer,status,budget,actual_revenue").not("landing_path", "is", null),
      ]);
      setSnaps((s.data ?? []) as Snap[]);
      setPosts((p.data ?? []) as PostRow[]);
      setLeads(l.error ? null : ((l.data ?? []) as LeadRow[]));
    }, 0);
    return () => window.clearTimeout(t);
  }, []);

  const history = useMemo(() => {
    const map = new Map<string, Snap[]>();
    snaps.forEach((s) => map.set(s.keyword_id, [...(map.get(s.keyword_id) || []), s]));
    return map;
  }, [snaps]);

  const perPost = useMemo(() => {
    if (!leads) return [];
    return posts
      .map((p) => {
        const mine = leads.filter((l) => l.landing_path === `/tin-tuc/${p.slug}`);
        const won = mine.filter((l) => l.status === "WON");
        return {
          post: p,
          leads: mine.length,
          fromGoogle: mine.filter((l) => (l.referrer || "").includes("google")).length,
          won: won.length,
          revenue: won.reduce((s, l) => s + Number(l.actual_revenue || l.budget || 0), 0),
        };
      })
      .sort((a, b) => b.leads - a.leads);
  }, [posts, leads]);

  const tracked = keywords.filter((k) => k.is_tracked && k.last_scanned_at);

  return (
    <div className="space-y-5">
      <Card title="Giai đoạn 5: Lịch quét tự động hằng tuần" hint="Mỗi 02:00 sáng Chủ nhật: quét top Google → cào bài mới → so sánh → tạo đề xuất. Sáng thứ Hai mở “Hôm nay làm gì” để xử lý.">
        {status?.cronReady ? (
          <p className="text-sm text-emerald-700">✓ Đã sẵn sàng trên máy chủ (cần website đang chạy trên Vercel).</p>
        ) : (
          <div className="text-xs text-slate-600">
            <p className="font-semibold text-amber-700">Chưa bật. Hiện tại bấm “Chạy thật” mỗi tuần một lần ở Giai đoạn 1.</p>
            <p className="mt-1">
              Để bật: trên Vercel → Settings → Environment Variables, thêm <code>CRON_SECRET</code> (chuỗi ngẫu nhiên tự đặt) và{" "}
              <code>SUPABASE_SERVICE_ROLE_KEY</code>, cùng <code>SERPER_API_KEY</code>, <code>GEMINI_API_KEY</code>. Lịch đã khai báo trong <code>vercel.json</code>.
            </p>
          </div>
        )}
      </Card>

      <Card title="Bảng theo dõi biến động thứ hạng từ khóa" hint="Vị trí của website mình trên Google qua các lần quét (mới nhất bên trái). Tụt ≥ 3 bậc hoặc rơi khỏi top 10 = tụt hạng.">
        {tracked.length === 0 ? (
          <Empty>Chưa có dữ liệu. Quét top Google ở tab 1–3.</Empty>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-xs">
              <thead className="text-[10px] uppercase text-slate-400">
                <tr>
                  <th className="py-1.5">Từ khóa</th>
                  <th>Hiện tại</th>
                  <th>Các lần quét trước</th>
                  <th>Đối thủ đứng đầu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tracked.map((k) => {
                  const h = history.get(k.id) || [];
                  const [now, prev] = h;
                  const dropped = prev?.our_position && (!now?.our_position || now.our_position - prev.our_position >= 3);
                  const rose = prev && now?.our_position && (!prev.our_position || prev.our_position - now.our_position >= 1);
                  return (
                    <tr key={k.id}>
                      <td className="py-2 font-semibold text-slate-800">{k.keyword}</td>
                      <td>
                        {k.our_position ? <strong className="text-emerald-700">#{k.our_position}</strong> : <span className="text-rose-600">ngoài top 10</span>}{" "}
                        {dropped && <Badge tone="red">Tụt hạng</Badge>}
                        {rose && <Badge tone="green">Tăng hạng</Badge>}
                      </td>
                      <td className="text-slate-500">
                        {h.slice(1, 7).map((s) => (s.our_position ? `#${s.our_position}` : "–")).join(" · ") || "—"}
                      </td>
                      <td className="text-slate-500">{k.top_competitor || "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Card title="Bài viết mang về bao nhiêu khách" hint="Đếm khách có trang đầu tiên vào website là bài viết đó (ghi tự động khi khách gửi form hoặc bấm liên hệ).">
        {leads === null ? (
          <Empty>Cần chạy migration 20261109030000_radar_pipeline.sql để bắt đầu ghi trang khách đến.</Empty>
        ) : posts.length === 0 ? (
          <Empty>Chưa có bài đã đăng.</Empty>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-xs">
              <thead className="text-[10px] uppercase text-slate-400">
                <tr>
                  <th className="py-1.5">Bài viết</th>
                  <th>Khách để lại thông tin</th>
                  <th>Đến từ Google</th>
                  <th>Đã chốt</th>
                  <th>Doanh thu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {perPost.map((r) => (
                  <tr key={r.post.id}>
                    <td className="py-2">
                      <a href={`/tin-tuc/${r.post.slug}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-slate-800 hover:underline">
                        {r.post.title.slice(0, 70)} <ExternalLink className="h-3 w-3" />
                      </a>
                    </td>
                    <td className="font-bold">{r.leads}</td>
                    <td>{r.fromGoogle}</td>
                    <td>{r.won}</td>
                    <td>{r.revenue ? vnd(r.revenue) : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-2 text-[10px] text-slate-400">Số liệu bắt đầu tính từ khi chạy migration ghi trang khách đến.</p>
          </div>
        )}
      </Card>
    </div>
  );
}
