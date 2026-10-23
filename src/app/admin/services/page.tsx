"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  Check,
  CircleAlert,
  Edit3,
  Eye,
  EyeOff,
  Package,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { AdminService } from "@/app/admin/_components/admin-types";

type ServiceForm = {
  title: string;
  slug: string;
  category: "su-kien" | "du-lich";
  description: string;
  price_range: string;
  features: string;
  image_url: string;
  is_active: boolean;
};

const emptyForm: ServiceForm = {
  title: "",
  slug: "",
  category: "su-kien",
  description: "",
  price_range: "",
  features: "",
  image_url: "",
  is_active: true,
};

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<AdminService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [editing, setEditing] = useState<AdminService | null | "new">(null);
  const [form, setForm] = useState<ServiceForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  async function loadServices() {
    setLoading(true);
    setError("");
    try {
      const supabase = createSupabaseBrowserClient();
      const { data, error: queryError } = await supabase
        .from("services")
        .select("*")
        .order("created_at", { ascending: false });
      if (queryError) throw queryError;
      setServices((data ?? []) as AdminService[]);
    } catch (loadError) {
      const message =
        loadError instanceof Error ? loadError.message : "Không thể tải dịch vụ.";
      setError(
        message.includes("column") || message.includes("schema cache")
          ? "Cơ sở dữ liệu chưa có trường quản trị dịch vụ. Hãy áp dụng migration Supabase."
          : message
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadServices();
  }, []);

  const openCreate = () => {
    setForm(emptyForm);
    setEditing("new");
  };

  const openEdit = (service: AdminService) => {
    setForm({
      title: service.title,
      slug: service.slug,
      category: service.category,
      description: service.description || "",
      price_range: service.price_range || "",
      features: (service.features || []).join("\n"),
      image_url: service.image_url || "",
      is_active: service.is_active,
    });
    setEditing(service);
  };

  const saveService = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (editing === null) return;
    if (!form.title.trim() || !form.slug.trim() || !form.description.trim()) {
      setError("Vui lòng nhập tên dịch vụ, đường dẫn và mô tả.");
      return;
    }
    setSaving(true);
    setError("");
    setNotice("");
    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim(),
      category: form.category,
      description: form.description.trim(),
      price_range: form.price_range.trim() || null,
      features: form.features.split("\n").map((item) => item.trim()).filter(Boolean),
      image_url: form.image_url.trim() || null,
      is_active: form.is_active,
    };
    try {
      const supabase = createSupabaseBrowserClient();
      const result =
        editing === "new"
          ? await supabase.from("services").insert(payload).select("*").single()
          : await supabase
              .from("services")
              .update(payload)
              .eq("id", editing.id)
              .select("*")
              .single();
      if (result.error) throw result.error;
      const saved = result.data as AdminService;
      setServices((previous) =>
        editing === "new"
          ? [saved, ...previous]
          : previous.map((service) => (service.id === saved.id ? saved : service))
      );
      setEditing(null);
      setNotice(editing === "new" ? "Đã tạo dịch vụ." : "Đã cập nhật dịch vụ.");
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message.includes("duplicate key")
            ? "Đường dẫn này đã được sử dụng. Hãy chọn slug khác."
            : saveError.message
          : "Không thể lưu dịch vụ."
      );
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (service: AdminService) => {
    setError("");
    setNotice("");
    try {
      const supabase = createSupabaseBrowserClient();
      const { data, error: updateError } = await supabase
        .from("services")
        .update({ is_active: !service.is_active })
        .eq("id", service.id)
        .select("*")
        .single();
      if (updateError) throw updateError;
      const updated = data as AdminService;
      setServices((previous) =>
        previous.map((item) => (item.id === updated.id ? updated : item))
      );
      setNotice(updated.is_active ? "Đã kích hoạt dịch vụ." : "Đã chuyển dịch vụ sang bản nháp.");
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Không thể đổi trạng thái.");
    }
  };

  const deleteService = async (service: AdminService) => {
    if (!window.confirm(`Xóa dịch vụ "${service.title}"? Thao tác này không thể hoàn tác.`)) {
      return;
    }
    setError("");
    setNotice("");
    try {
      const supabase = createSupabaseBrowserClient();
      const { error: deleteError } = await supabase
        .from("services")
        .delete()
        .eq("id", service.id);
      if (deleteError) throw deleteError;
      setServices((previous) => previous.filter((item) => item.id !== service.id));
      setNotice("Đã xóa dịch vụ.");
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Không thể xóa dịch vụ.");
    }
  };

  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#A78113]">SERVICE CATALOG</p>
          <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Dịch vụ &amp; gói sự kiện</h1>
          <p className="mt-1 text-sm text-slate-500">Quản lý nội dung dịch vụ đang hiển thị trên website.</p>
        </div>
        <button type="button" onClick={openCreate} className="inline-flex items-center gap-2 rounded-xl bg-[#0A1E5E] px-4 py-2.5 text-sm font-bold text-white">
          <Plus className="h-4 w-4" /> Thêm dịch vụ
        </button>
      </header>

      {(error || notice) && <Alert message={error || notice} isError={Boolean(error)} onClose={() => { setError(""); setNotice(""); }} />}

      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCard label="Tổng dịch vụ" value={services.length} icon={<Package className="h-4 w-4" />} />
        <SummaryCard label="Đang hoạt động" value={services.filter((service) => service.is_active).length} icon={<Eye className="h-4 w-4" />} />
        <SummaryCard label="Bản nháp" value={services.filter((service) => !service.is_active).length} icon={<EyeOff className="h-4 w-4" />} />
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left">
            <thead><tr className="border-b border-slate-200 bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
              <th className="px-5 py-3 font-bold">Dịch vụ</th><th className="px-5 py-3 font-bold">Danh mục</th><th className="px-5 py-3 font-bold">Khoảng giá</th><th className="px-5 py-3 font-bold">Trạng thái</th><th className="px-5 py-3 text-right font-bold">Thao tác</th>
            </tr></thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? <tr><td colSpan={5} className="px-5 py-12 text-center text-sm text-slate-500">Đang tải dịch vụ...</td></tr> :
                services.length === 0 ? <tr><td colSpan={5} className="px-5 py-12 text-center text-sm text-slate-500">Chưa có dữ liệu dịch vụ. Hãy áp dụng migration và tải lại.</td></tr> :
                  services.map((service) => (
                    <tr key={service.id} className="hover:bg-slate-50/70">
                      <td className="px-5 py-4">
                        <p className="font-bold text-slate-900">{service.title}</p>
                        <p className="mt-1 text-xs text-slate-500">/{service.slug}</p>
                        {service.features?.length ? <p className="mt-1 text-xs text-slate-500">{service.features.length} hạng mục nổi bật</p> : null}
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600">{service.category === "du-lich" ? "Du lịch" : "Sự kiện"}</td>
                      <td className="px-5 py-4 text-sm text-slate-700">{service.price_range || "Liên hệ báo giá"}</td>
                      <td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${service.is_active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{service.is_active ? "Đang hoạt động" : "Bản nháp"}</span></td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button type="button" onClick={() => openEdit(service)} className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:border-blue-300 hover:text-blue-700" aria-label={`Sửa ${service.title}`}><Edit3 className="h-4 w-4" /></button>
                          <button type="button" onClick={() => void toggleStatus(service)} className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:border-amber-300 hover:text-amber-700" aria-label={service.is_active ? "Chuyển thành bản nháp" : "Kích hoạt"}>{service.is_active ? <EyeOff className="h-4 w-4" /> : <Check className="h-4 w-4" />}</button>
                          <button type="button" onClick={() => void deleteService(service)} className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:border-rose-300 hover:text-rose-600" aria-label={`Xóa ${service.title}`}><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </section>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4">
          <section role="dialog" aria-modal="true" aria-labelledby="service-editor-title" className="my-auto w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-7">
              <div><p className="text-xs font-bold uppercase tracking-wider text-[#A78113]">Service editor</p><h2 id="service-editor-title" className="mt-1 text-xl font-extrabold text-slate-900">{editing === "new" ? "Tạo dịch vụ mới" : "Chỉnh sửa dịch vụ"}</h2></div>
              <button type="button" aria-label="Đóng biểu mẫu" onClick={() => setEditing(null)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={saveService} className="grid gap-4 p-5 sm:grid-cols-2 sm:p-7">
              <Field label="Tên dịch vụ *"><input required value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value, slug: editing === "new" ? slugify(event.target.value) : current.slug }))} className={inputClass} /></Field>
              <Field label="Slug *"><input required value={form.slug} onChange={(event) => setForm((current) => ({ ...current, slug: slugify(event.target.value) }))} className={inputClass} /></Field>
              <Field label="Danh mục"><select value={form.category} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value as ServiceForm["category"] }))} className={inputClass}><option value="su-kien">Sự kiện</option><option value="du-lich">Du lịch</option></select></Field>
              <Field label="Khoảng giá / giá từ"><input value={form.price_range} onChange={(event) => setForm((current) => ({ ...current, price_range: event.target.value }))} placeholder="Ví dụ: Từ 25.000.000đ" className={inputClass} /></Field>
              <Field label="Ảnh đại diện (URL)" className="sm:col-span-2"><input type="url" value={form.image_url} onChange={(event) => setForm((current) => ({ ...current, image_url: event.target.value }))} placeholder="https://" className={inputClass} /></Field>
              <Field label="Mô tả *" className="sm:col-span-2"><textarea required rows={3} value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} className={inputClass} /></Field>
              <Field label="Điểm nổi bật (mỗi dòng một ý)" className="sm:col-span-2"><textarea rows={4} value={form.features} onChange={(event) => setForm((current) => ({ ...current, features: event.target.value }))} className={inputClass} /></Field>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 sm:col-span-2"><input type="checkbox" checked={form.is_active} onChange={(event) => setForm((current) => ({ ...current, is_active: event.target.checked }))} className="h-4 w-4 accent-[#0A1E5E]" /> Hiển thị công khai trên website</label>
              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 sm:col-span-2">
                <button type="button" onClick={() => setEditing(null)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600">Hủy</button>
                <button type="submit" disabled={saving} className="rounded-lg bg-[#0A1E5E] px-5 py-2 text-sm font-bold text-white disabled:opacity-60">{saving ? "Đang lưu..." : "Lưu dịch vụ"}</button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

const inputClass = "mt-1.5 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none focus:border-[#0A1E5E] focus:ring-2 focus:ring-blue-100";

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return <label className={`block text-xs font-semibold text-slate-600 ${className}`}>{label}{children}</label>;
}

function SummaryCard({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><div><p className="text-xs font-semibold text-slate-500">{label}</p><p className="mt-1 text-2xl font-black text-slate-900">{value}</p></div><span className="rounded-xl bg-blue-50 p-2.5 text-[#0A1E5E]">{icon}</span></div>;
}

function Alert({ message, isError, onClose }: { message: string; isError: boolean; onClose: () => void }) {
  return <div role={isError ? "alert" : "status"} className={`flex items-start gap-2 rounded-xl border p-3 text-sm ${isError ? "border-rose-200 bg-rose-50 text-rose-800" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`}>{isError && <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />}<span>{message}</span><button type="button" aria-label="Đóng thông báo" onClick={onClose} className="ml-auto"><X className="h-4 w-4" /></button></div>;
}
