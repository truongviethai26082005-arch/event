"use client";

import { useMemo, useState } from "react";
import { Loader2, Scale } from "lucide-react";
import { Badge, Card, Comparison, Empty, Keyword, api, fmtTime } from "./shared";

interface Props {
  keywords: Keyword[];
  comparisons: Comparison[];
  compareNeeded: number;
  onChanged: () => void;
  setNotice: (s: string) => void;
  setError: (s: string) => void;
}

/** Bước 4 – So sánh: họ có gì mình chưa có (A mục bắt buộc / B từ khóa top / C khe hở). */
export default function CompareTab({ keywords, comparisons, compareNeeded, onChanged, setNotice, setError }: Props) {
  const [busy, setBusy] = useState<string | null>(null);
  const [progress, setProgress] = useState("");
  const latest = useMemo(() => {
    const map = new Map<string, Comparison>();
    comparisons.forEach((c) => !map.has(c.keyword_id) && map.set(c.keyword_id, c));
    return map;
  }, [comparisons]);
  const compared = keywords.filter((k) => latest.has(k.id));
  const [selected, setSelected] = useState<string | null>(null);
  const current = latest.get(selected || compared[0]?.id || "");
  const currentKw = keywords.find((k) => k.id === current?.keyword_id);

  const compareAll = async () => {
    setBusy("all");
    setError("");
    try {
      let done = 0;
      let proposals = 0;
      for (let round = 0; round < 30; round += 1) {
        const r = await api<{ compared: number; proposals: number; errors: string[]; remaining: number }>("/api/radar/compare", {});
        done += r.compared;
        proposals += r.proposals;
        if (r.errors.length) setError(r.errors.slice(0, 3).join(" · "));
        setProgress(`Đã so sánh ${done} từ khóa, tạo ${proposals} đề xuất. Còn ${r.remaining}…`);
        if (!r.compared || !r.remaining) break;
      }
      setNotice(`So sánh xong ${done} từ khóa, tạo / cập nhật ${proposals} đề xuất viết (xem tab 5).`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "So sánh thất bại.");
    } finally {
      setBusy(null);
      setProgress("");
      onChanged();
    }
  };

  const compareOne = async (keywordId: string) => {
    setBusy(keywordId);
    setError("");
    try {
      const r = await api<{ errors: string[]; skipped: string[]; proposals: number }>("/api/radar/compare", { keywordId });
      if (r.errors.length) throw new Error(r.errors[0]);
      setNotice(r.skipped.length ? r.skipped[0] : `So sánh xong${r.proposals ? ", đã cập nhật đề xuất viết" : ""}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "So sánh thất bại.");
    } finally {
      setBusy(null);
      onChanged();
    }
  };

  return (
    <div className="space-y-5">
      <Card
        title="Giai đoạn 2: So sánh nội dung Top Google với website Trường Hải"
        hint="AI đọc các bài đối thủ đã cào, so sánh trực tiếp với bài của Trường Hải để tìm lỗ hổng: số chữ, báo giá, FAQ, hình ảnh thực tế."
        actions={
          <button
            type="button"
            onClick={() => void compareAll()}
            disabled={!!busy || !compareNeeded}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#0A1E5E] px-4 py-2 text-xs font-bold text-white disabled:opacity-40"
          >
            {busy === "all" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Scale className="h-4 w-4" />}
            So sánh {compareNeeded} từ khóa đang chờ
          </button>
        }
      >
        {progress && <p className="mb-3 text-xs text-slate-600">{progress}</p>}
        {compared.length === 0 ? (
          <Empty>
            Chưa có phiếu so sánh. Cần: quét top Google (bước 2) → cào bài (bước 3) → bấm &ldquo;So sánh&rdquo;. Mỗi từ khóa cần ít nhất 2 bài đối thủ đọc được.
          </Empty>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {compared.map((k) => (
              <button
                key={k.id}
                type="button"
                onClick={() => setSelected(k.id)}
                className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                  current?.keyword_id === k.id ? "border-[#0A1E5E] bg-[#0A1E5E] text-white" : "border-slate-200 text-slate-700 hover:border-[#0A1E5E]"
                }`}
              >
                {k.keyword}
              </button>
            ))}
          </div>
        )}
      </Card>

      {current && currentKw && (
        <>
          <Card
            title={`Phiếu so sánh: "${currentKw.keyword}"`}
            hint={`So sánh lúc ${fmtTime(current.created_at)} · dùng ${current.pages_used} bài đối thủ · bài của mình: ${current.our_post_id ? "CÓ" : "CHƯA CÓ"} · vị trí mình: ${currentKw.our_position ? `#${currentKw.our_position}` : "ngoài top 10"}`}
            actions={
              <button
                type="button"
                onClick={() => void compareOne(currentKw.id)}
                disabled={!!busy}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-bold text-slate-700 disabled:opacity-40"
              >
                {busy === currentKw.id && <Loader2 className="h-3.5 w-3.5 animate-spin" />} So sánh lại
              </button>
            }
          >
            {current.summary && <p className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700">{current.summary}</p>}
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
              <Signal label="Số chữ trung bình bài top" value={String(current.signals.avgWords ?? "—")} />
              <Signal label="Bài top có giá cụ thể" value={`${current.signals.pctWithPrice ?? 0}%`} />
              <Signal label="Bài top có FAQ" value={`${current.signals.pctWithFaq ?? 0}%`} />
              <Signal label="Bài top nêu dự án / khách" value={`${current.signals.pctMentionProjects ?? 0}%`} />
            </div>
          </Card>

          <div className="grid gap-5 xl:grid-cols-3">
            <Card title="A. Mục bắt buộc" hint="Mục mà đa số bài top đều có. Thiếu thì khó lên top.">
              <ul className="space-y-2 text-xs">
                {current.must_have.map((m) => (
                  <li key={m.item} className="flex gap-2">
                    <span className={m.we_have ? "text-emerald-600" : "text-rose-600"}>{m.we_have ? "✓" : "✗"}</span>
                    <span>
                      <strong className="text-slate-800">{m.item}</strong>
                      <span className="block text-slate-400">{m.count} bài · {m.sources.slice(0, 3).join(", ")}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
            <Card title="B. Từ khóa top" hint="Từ khóa phụ bài top dùng ở tiêu đề / mục lục. ✗ = bài mình chưa dùng.">
              <div className="flex flex-wrap gap-1.5">
                {current.top_keywords.map((k) => (
                  <span key={k.keyword} className={`rounded-full px-2.5 py-1 text-[11px] ring-1 ring-inset ${k.we_use ? "bg-emerald-50 text-emerald-800 ring-emerald-200" : "bg-rose-50 text-rose-700 ring-rose-200"}`}>
                    {k.we_use ? "✓" : "✗"} {k.keyword} <span className="opacity-60">({k.count})</span>
                  </span>
                ))}
              </div>
            </Card>
            <Card title="C. Khe hở đối thủ" hint="Điều khách cần mà bài top làm kém. Lấp bằng chất liệu thật của Trường Hải.">
              <ul className="space-y-3 text-xs">
                {current.gaps.map((g) => (
                  <li key={g.gap}>
                    <p className="font-bold text-slate-800">
                      {g.has_material ? <Badge tone="green">Có chất liệu</Badge> : <Badge tone="amber">Thiếu chất liệu</Badge>} {g.gap}
                    </p>
                    <p className="mt-0.5 text-slate-500">Dẫn chứng: {g.evidence}</p>
                    <p className="mt-0.5 text-emerald-800">→ {g.how_we_fill}</p>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {!!current.signals.pages?.length && (
            <Card title="Các bài đối thủ đã dùng để so sánh">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] text-left text-xs">
                  <thead className="text-[10px] uppercase text-slate-400">
                    <tr>
                      <th className="py-1.5">#</th>
                      <th>Đối thủ</th>
                      <th>Số chữ</th>
                      <th>Có giá</th>
                      <th>Có FAQ</th>
                      <th>Năm mới nhất</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {current.signals.pages.map((p) => (
                      <tr key={p.domain + p.position}>
                        <td className="py-1.5 font-bold">{p.position}</td>
                        <td>{p.domain}</td>
                        <td>{p.words.toLocaleString("vi-VN")}</td>
                        <td>{p.hasPrice ? "✓" : "—"}</td>
                        <td>{p.hasFaq ? "✓" : "—"}</td>
                        <td>{p.latestYear ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

function Signal({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-2.5">
      <p className="text-[10px] text-slate-500">{label}</p>
      <p className="text-base font-black text-slate-900">{value}</p>
    </div>
  );
}
