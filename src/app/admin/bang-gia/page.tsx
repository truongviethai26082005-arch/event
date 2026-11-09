"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { CircleAlert, ClipboardPaste, Plus, Save, Trash2 } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { formatCurrency, isMissingSchemaError } from "@/app/admin/_components/admin-types";

interface PriceRow {
  id: string;
  category: string;
  name: string;
  unit: string;
  unit_price: number;
  description: string | null;
  is_active: boolean;
  sort_order: number;
}

/** "1.500.000", "1,500,000đ", "1500000" -> 1500000 */
function parsePrice(text: string) {
  const digits = text.replace(/[^\d]/g, "");
  return digits ? Number(digits) : NaN;
}

const input = "h-9 w-full rounded-lg border border-slate-200 px-2.5 text-sm text-slate-800 outline-none focus:border-[#0A1E5E]";

/**
 * BẢNG ĐƠN GIÁ: nguồn giá duy nhất để AI lập báo giá nháp.
 * AI chỉ chọn hạng mục + số lượng; đơn giá luôn lấy từ bảng này.
 */
export default function PriceListPage() {
  const [rows, setRows] = useState<PriceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [dirty, setDirty] = useState<Record<string, Partial<PriceRow>>>({});
  const [paste, setPaste] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    const supabase = createSupabaseBrowserClient();
    const { data, error: loadError } = await supabase
      .from("price_items")
      .select("*")
      .order("category")
      .order("sort_order")
      .order("name");
    if (loadError) {
      setError(
        isMissingSchemaError(loadError)
          ? "Chưa có bảng đơn giá. Hãy chạy migration supabase/migrations/20261109010000_crm_ai_pricing.sql."
          : loadError.message
      );
    } else {
      setRows((data ?? []) as PriceRow[]);
      setError("");
    }
    setLoading(false);
  }

  useEffect(() => {
    const t = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(t);
  }, []);

  const grouped = useMemo(() => {
    const map = new Map<string, PriceRow[]>();
    rows.forEach((r) => map.set(r.category, [...(map.get(r.category) || []), r]));
    return [...map.entries()];
  }, [rows]);

  const value = <K extends keyof PriceRow>(row: PriceRow, key: K): PriceRow[K] =>
    (dirty[row.id]?.[key] ?? row[key]) as PriceRow[K];
  const change = (id: string, patch: Partial<PriceRow>) =>
    setDirty((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));

  const saveAll = async () => {
    const entries = Object.entries(dirty);
    if (!entries.length) return;
    for (const [, patch] of entries) {
      if (patch.unit_price !== undefined && (!Number.isFinite(patch.unit_price) || patch.unit_price < 0)) {
        setError("Đơn giá phải là số không âm.");
        return;
      }
    }
    setBusy(true);
    const supabase = createSupabaseBrowserClient();
    for (const [id, patch] of entries) {
      const { error: updateError } = await supabase.from("price_items").update(patch).eq("id", id);
      if (updateError) {
        setError(updateError.message);
        setBusy(false);
        return;
      }
    }
    setDirty({});
    setBusy(false);
    setNotice(`Đã lưu ${entries.length} hạng mục.`);
    await load();
  };

  const addOne = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const price = parsePrice(String(form.get("unit_price") || ""));
    const name = String(form.get("name") || "").trim();
    if (!name || !Number.isFinite(price)) {
      setError("Nhập tên hạng mục và đơn giá.");
      return;
    }
    const supabase = createSupabaseBrowserClient();
    const { error: insertError } = await supabase.from("price_items").insert([
      {
        category: String(form.get("category") || "").trim() || "Khác",
        name,
        unit: String(form.get("unit") || "").trim() || "Gói",
        unit_price: price,
        description: String(form.get("description") || "").trim() || null,
      },
    ]);
    if (insertError) return setError(insertError.message);
    event.currentTarget.reset();
    setNotice("Đã thêm hạng mục.");
    await load();
  };

  /** Dán từ Excel: mỗi dòng "Nhóm <Tab> Hạng mục <Tab> ĐVT <Tab> Đơn giá <Tab> Mô tả". */
  const importPaste = async () => {
    const lines = paste.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    const parsed = lines
      .map((line) => line.split(/\t|\s\|\s|;/).map((c) => c.trim()))
      .filter((cols) => cols.length >= 4 && Number.isFinite(parsePrice(cols[3])))
      .map((cols, i) => ({
        category: cols[0] || "Khác",
        name: cols[1],
        unit: cols[2] || "Gói",
        unit_price: parsePrice(cols[3]),
        description: cols[4] || null,
        sort_order: i,
      }))
      .filter((r) => r.name);
    if (!parsed.length) {
      setError("Không đọc được dòng nào. Mỗi dòng cần: Nhóm, Hạng mục, ĐVT, Đơn giá (cách nhau bằng Tab khi copy từ Excel).");
      return;
    }
    setBusy(true);
    const supabase = createSupabaseBrowserClient();
    const { error: insertError } = await supabase.from("price_items").insert(parsed);
    setBusy(false);
    if (insertError) return setError(insertError.message);
    setPaste("");
    setNotice(`Đã nhập ${parsed.length} hạng mục${parsed.length < lines.length ? ` (bỏ qua ${lines.length - parsed.length} dòng không hợp lệ)` : ""}.`);
    await load();
  };

  const remove = async (row: PriceRow) => {
    if (!window.confirm(`Xóa hạng mục “${row.name}”? Báo giá đã gửi trước đây không bị ảnh hưởng.`)) return;
    const supabase = createSupabaseBrowserClient();
    const { error: deleteError } = await supabase.from("price_items").delete().eq("id", row.id);
    if (deleteError) return setError(deleteError.message);
    await load();
  };

  const dirtyCount = Object.keys(dirty).length;

  return (
    <div className="mx-auto max-w-[1300px] space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#A78113]">Bán hàng</p>
          <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Bảng đơn giá</h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            AI dùng bảng này để lập báo giá nháp theo nhu cầu từng khách. AI chỉ chọn hạng mục và số lượng; đơn giá luôn
            lấy từ đây. Hạng mục tắt “Đang dùng” sẽ không được AI chọn.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void saveAll()}
          disabled={!dirtyCount || busy}
          className="inline-flex items-center gap-2 rounded-xl bg-[#0A1E5E] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-40"
        >
          <Save className="h-4 w-4" /> Lưu thay đổi{dirtyCount ? ` (${dirtyCount})` : ""}
        </button>
      </header>

      {(error || notice) && (
        <div
          role={error ? "alert" : "status"}
          className={`flex items-start gap-2 rounded-xl border p-3 text-sm ${
            error ? "border-rose-200 bg-rose-50 text-rose-800" : "border-emerald-200 bg-emerald-50 text-emerald-800"
          }`}
        >
          {error && <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />}
          <span className="flex-1">{error || notice}</span>
          <button type="button" onClick={() => { setError(""); setNotice(""); }} className="opacity-60 hover:opacity-100">✕</button>
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-2">
        <form onSubmit={addOne} className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="flex items-center gap-2 text-sm font-extrabold text-slate-900">
            <Plus className="h-4 w-4" /> Thêm 1 hạng mục
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <input name="category" placeholder="Nhóm (VD: Âm thanh)" className={input} />
            <input name="unit" placeholder="ĐVT (VD: Bộ, Ngày, m²)" className={input} />
          </div>
          <input name="name" required placeholder="Tên hạng mục (VD: Loa Line Array RCF 2 bên)" className={input} />
          <div className="grid grid-cols-2 gap-3">
            <input name="unit_price" required inputMode="numeric" placeholder="Đơn giá (VD: 8.500.000)" className={input} />
            <input name="description" placeholder="Mô tả ngắn (không bắt buộc)" className={input} />
          </div>
          <button type="submit" className="w-full rounded-lg bg-slate-900 px-3 py-2 text-sm font-bold text-white">Thêm</button>
        </form>

        <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="flex items-center gap-2 text-sm font-extrabold text-slate-900">
            <ClipboardPaste className="h-4 w-4" /> Dán hàng loạt từ Excel
          </h2>
          <p className="text-xs text-slate-500">
            Trong Excel, sắp xếp 5 cột theo thứ tự <strong>Nhóm · Hạng mục · ĐVT · Đơn giá · Mô tả</strong>, bôi đen các dòng (không
            lấy dòng tiêu đề), Ctrl+C rồi dán vào đây.
          </p>
          <textarea
            rows={5}
            value={paste}
            onChange={(e) => setPaste(e.target.value)}
            placeholder={"Âm thanh\tLoa Line Array RCF 2 bên\tBộ\t8500000\tKèm mixer + kỹ thuật\nSân khấu\tSân khấu lắp ghép trải thảm\tm²\t250000"}
            className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 font-mono text-xs outline-none focus:border-[#0A1E5E]"
          />
          <button
            type="button"
            onClick={() => void importPaste()}
            disabled={!paste.trim() || busy}
            className="w-full rounded-lg bg-slate-900 px-3 py-2 text-sm font-bold text-white disabled:opacity-40"
          >
            Nhập các dòng đã dán
          </button>
        </div>
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-3 py-3">Nhóm</th>
                <th className="px-3 py-3">Hạng mục</th>
                <th className="px-3 py-3">ĐVT</th>
                <th className="px-3 py-3">Đơn giá</th>
                <th className="px-3 py-3">Mô tả</th>
                <th className="px-3 py-3 text-center">Đang dùng</th>
                <th className="px-3 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={7} className="px-3 py-10 text-center text-slate-500">Đang tải...</td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan={7} className="px-3 py-10 text-center text-slate-500">Chưa có hạng mục nào. Thêm hoặc dán từ Excel ở trên.</td></tr>
              ) : (
                grouped.flatMap(([, items]) =>
                  items.map((row) => (
                    <tr key={row.id} className={dirty[row.id] ? "bg-amber-50/60" : ""}>
                      <td className="px-3 py-2 w-40">
                        <input className={input} value={value(row, "category")} onChange={(e) => change(row.id, { category: e.target.value })} />
                      </td>
                      <td className="px-3 py-2">
                        <input className={input} value={value(row, "name")} onChange={(e) => change(row.id, { name: e.target.value })} />
                      </td>
                      <td className="px-3 py-2 w-24">
                        <input className={input} value={value(row, "unit")} onChange={(e) => change(row.id, { unit: e.target.value })} />
                      </td>
                      <td className="px-3 py-2 w-40">
                        <input
                          className={input}
                          inputMode="numeric"
                          value={String(value(row, "unit_price"))}
                          onChange={(e) => change(row.id, { unit_price: parsePrice(e.target.value) || 0 })}
                        />
                        <span className="text-[11px] text-slate-400">{formatCurrency(Number(value(row, "unit_price")))}</span>
                      </td>
                      <td className="px-3 py-2">
                        <input
                          className={input}
                          value={value(row, "description") || ""}
                          onChange={(e) => change(row.id, { description: e.target.value || null })}
                        />
                      </td>
                      <td className="px-3 py-2 text-center">
                        <input
                          type="checkbox"
                          checked={Boolean(value(row, "is_active"))}
                          onChange={(e) => change(row.id, { is_active: e.target.checked })}
                          className="h-4 w-4"
                          aria-label="Đang dùng"
                        />
                      </td>
                      <td className="px-3 py-2 text-right">
                        <button type="button" onClick={() => void remove(row)} aria-label="Xóa" className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
