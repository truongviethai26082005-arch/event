"use client";

import React, { useMemo, useState } from "react";
import {
  Award,
  Check,
  CheckCircle2,
  Edit3,
  ExternalLink,
  Flame,
  Gift,
  Layers,
  ListChecks,
  Package,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  Tag,
  Trash2,
  Wrench,
  X,
} from "lucide-react";

export interface ServiceEquipmentGroup {
  category: string;
  items: string[];
}

export interface ServiceWorkflowStep {
  step: number;
  title: string;
  desc: string;
}

export interface ServiceData {
  id: string;
  name: string;
  short_name?: string;
  category?: "su-kien" | "du-lich" | string;
  badge?: string;
  page_url: string;
  cluster_ids: string[];
  description?: string;
  offerings?: string[];
  equipment_groups?: ServiceEquipmentGroup[];
  workflow?: ServiceWorkflowStep[];
  target_audience?: string;
  price_policy?: string;
}

export interface PackageTierData {
  id: string;
  name: string;
  scale: string;
  price_display: string;
  unit: string;
  description: string;
  is_featured?: boolean;
  features: string[];
  unsupported_features?: string[];
  cta_text?: string;
}

export interface ComboPromoData {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  category: "su-kien" | "du-lich" | "all" | string;
  service_group: string;
  discount_badge: string;
  valid_until: string;
  is_popular?: boolean;
  gift_items: string[];
  conditions: string[];
  recommended_for: string;
}

export interface ServicesBrainFile {
  _meta?: {
    id?: string;
    title?: string;
    source?: string;
    rule?: string;
    note?: string;
    updated_at?: string;
  };
  services: ServiceData[];
  packages: PackageTierData[];
  combos: ComboPromoData[];
}

interface ServicesPackagesManagerProps {
  servicesData: ServicesBrainFile;
  clusters: { id: string; name: string }[];
  onUpdated: (nextData: ServicesBrainFile) => void;
}

type SectionFilter = "all" | "services" | "packages" | "combos";
type CategoryFilter = "all" | "su-kien" | "du-lich";

function toSlugId(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function linesToArray(raw: string): string[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function arrayToLines(items?: string[]): string {
  return (items || []).join("\n");
}

function formatCategoryLabel(category?: string): string {
  if (category === "du-lich") return "Du lịch & Tour";
  if (category === "su-kien") return "Sự kiện";
  return "Tất cả mảng";
}

interface ModalShellProps {
  title: string;
  subtitle: string;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  saving: boolean;
  error: string;
  submitLabel: string;
  children: React.ReactNode;
}

function ModalShell({
  title,
  subtitle,
  onClose,
  onSubmit,
  saving,
  error,
  submitLabel,
  children,
}: ModalShellProps) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex items-start justify-between gap-3 bg-slate-50">
          <div>
            <h4 className="text-base font-bold text-[#0A1E5E]">{title}</h4>
            <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="p-5 overflow-y-auto space-y-4 text-xs">
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-medium">
                {error}
              </div>
            )}
            {children}
          </div>

          <div className="px-5 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 cursor-pointer disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#0A1E5E] hover:bg-[#132d7e] flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
            >
              {saving ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Check className="w-3.5 h-3.5" />
              )}
              {saving ? "Đang lưu JSON..." : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ServicesPackagesManager({
  servicesData,
  clusters,
  onUpdated,
}: ServicesPackagesManagerProps) {
  const [sectionFilter, setSectionFilter] = useState<SectionFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [confirmDeleteKey, setConfirmDeleteKey] = useState<string | null>(null);

  // Editor modal state
  const [editingService, setEditingService] = useState<{
    mode: "create" | "edit";
    originalId?: string;
    draft: ServiceData;
    offeringsText: string;
  } | null>(null);

  const [editingPackage, setEditingPackage] = useState<{
    mode: "create" | "edit";
    originalId?: string;
    draft: PackageTierData;
    featuresText: string;
    unsupportedText: string;
  } | null>(null);

  const [editingCombo, setEditingCombo] = useState<{
    mode: "create" | "edit";
    originalId?: string;
    draft: ComboPromoData;
    giftItemsText: string;
    conditionsText: string;
  } | null>(null);

  const [modalError, setModalError] = useState("");

  const services = useMemo(() => servicesData.services || [], [servicesData.services]);
  const packages = useMemo(() => servicesData.packages || [], [servicesData.packages]);
  const combos = useMemo(() => servicesData.combos || [], [servicesData.combos]);

  const selectableClusters = useMemo(
    () => clusters.filter((c) => c.id !== "ngoai-pham-vi"),
    [clusters]
  );

  const filteredServices = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return services.filter((svc) => {
      const matchCat =
        categoryFilter === "all" || (svc.category || "su-kien") === categoryFilter;
      if (!matchCat) return false;
      if (!q) return true;
      return (
        svc.name.toLowerCase().includes(q) ||
        (svc.short_name || "").toLowerCase().includes(q) ||
        svc.id.toLowerCase().includes(q) ||
        (svc.description || "").toLowerCase().includes(q) ||
        (svc.offerings || []).some((o) => o.toLowerCase().includes(q))
      );
    });
  }, [services, categoryFilter, searchQuery]);

  const filteredPackages = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return packages.filter((pkg) => {
      if (!q) return true;
      return (
        pkg.name.toLowerCase().includes(q) ||
        pkg.scale.toLowerCase().includes(q) ||
        pkg.description.toLowerCase().includes(q) ||
        pkg.features.some((f) => f.toLowerCase().includes(q))
      );
    });
  }, [packages, searchQuery]);

  const filteredCombos = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return combos.filter((combo) => {
      const matchCat =
        categoryFilter === "all" ||
        combo.category === "all" ||
        combo.category === categoryFilter;
      if (!matchCat) return false;
      if (!q) return true;
      return (
        combo.title.toLowerCase().includes(q) ||
        combo.code.toLowerCase().includes(q) ||
        combo.subtitle.toLowerCase().includes(q) ||
        combo.service_group.toLowerCase().includes(q) ||
        combo.gift_items.some((g) => g.toLowerCase().includes(q))
      );
    });
  }, [combos, categoryFilter, searchQuery]);

  const persistFile = async (
    nextFile: ServicesBrainFile,
    successText: string
  ): Promise<boolean> => {
    setSaving(true);
    setStatusMessage(null);
    setModalError("");
    try {
      const res = await fetch("/api/radar/brand", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target: "services", data: nextFile }),
      });
      const json = (await res.json()) as {
        success?: boolean;
        error?: string;
        data?: ServicesBrainFile;
      };
      if (!res.ok || !json.success) {
        const msg = json.error || "Không thể lưu dữ liệu vào services.json";
        setStatusMessage({ type: "error", text: msg });
        setModalError(msg);
        return false;
      }
      onUpdated(json.data || nextFile);
      setStatusMessage({ type: "success", text: successText });
      setConfirmDeleteKey(null);
      return true;
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Lỗi kết nối khi lưu services.json";
      setStatusMessage({ type: "error", text: msg });
      setModalError(msg);
      return false;
    } finally {
      setSaving(false);
    }
  };

  // --- Service CRUD handlers ---
  const openCreateService = () => {
    setModalError("");
    setEditingService({
      mode: "create",
      draft: {
        id: "",
        name: "",
        short_name: "",
        category: "su-kien",
        badge: "",
        page_url: "/dich-vu#",
        cluster_ids: [],
        description: "",
        offerings: [],
        equipment_groups: [],
        workflow: [],
        target_audience: "",
        price_policy: "Liên hệ nhận báo giá",
      },
      offeringsText: "",
    });
  };

  const openEditService = (svc: ServiceData) => {
    setModalError("");
    setEditingService({
      mode: "edit",
      originalId: svc.id,
      draft: {
        ...svc,
        cluster_ids: [...(svc.cluster_ids || [])],
        equipment_groups: (svc.equipment_groups || []).map((g) => ({
          category: g.category,
          items: [...g.items],
        })),
        workflow: (svc.workflow || []).map((w) => ({ ...w })),
      },
      offeringsText: arrayToLines(svc.offerings),
    });
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    const { mode, originalId, draft, offeringsText } = editingService;
    const trimmedName = draft.name.trim();
    const resolvedId = (draft.id.trim() || toSlugId(trimmedName)).trim();
    if (!trimmedName || !resolvedId) {
      setModalError("Vui lòng nhập đầy đủ Tên dịch vụ và Mã ID (slug).");
      return;
    }
    const isDuplicate = services.some(
      (s) => s.id === resolvedId && (mode === "create" || s.id !== originalId)
    );
    if (isDuplicate) {
      setModalError(`Mã ID "${resolvedId}" đã tồn tại. Vui lòng chọn ID khác.`);
      return;
    }

    const cleanEquipment = (draft.equipment_groups || [])
      .map((g) => ({
        category: g.category.trim(),
        items: g.items.map((it) => it.trim()).filter(Boolean),
      }))
      .filter((g) => g.category && g.items.length > 0);

    const cleanWorkflow = (draft.workflow || [])
      .map((w, idx) => ({
        step: idx + 1,
        title: w.title.trim(),
        desc: w.desc.trim(),
      }))
      .filter((w) => w.title || w.desc);

    const normalized: ServiceData = {
      id: resolvedId,
      name: trimmedName,
      short_name: draft.short_name?.trim() || trimmedName,
      category: draft.category || "su-kien",
      ...(draft.badge?.trim() ? { badge: draft.badge.trim() } : {}),
      page_url: draft.page_url.trim() || `/dich-vu#${resolvedId}`,
      cluster_ids: draft.cluster_ids,
      description: draft.description?.trim() || "",
      offerings: linesToArray(offeringsText),
      ...(cleanEquipment.length ? { equipment_groups: cleanEquipment } : {}),
      ...(cleanWorkflow.length ? { workflow: cleanWorkflow } : {}),
      ...(draft.target_audience?.trim()
        ? { target_audience: draft.target_audience.trim() }
        : {}),
      price_policy: draft.price_policy?.trim() || "Liên hệ nhận báo giá",
    };

    const nextServices =
      mode === "create"
        ? [...services, normalized]
        : services.map((s) => (s.id === originalId ? normalized : s));

    const ok = await persistFile(
      { ...servicesData, services: nextServices, packages, combos },
      mode === "create"
        ? `Đã thêm dịch vụ "${normalized.name}" vào services.json`
        : `Đã cập nhật dịch vụ "${normalized.name}"`
    );
    if (ok) setEditingService(null);
  };

  const handleDeleteService = async (id: string) => {
    const nextServices = services.filter((s) => s.id !== id);
    await persistFile(
      { ...servicesData, services: nextServices, packages, combos },
      `Đã xóa dịch vụ "${id}" khỏi services.json`
    );
  };

  // --- Package CRUD handlers ---
  const openCreatePackage = () => {
    setModalError("");
    setEditingPackage({
      mode: "create",
      draft: {
        id: "",
        name: "",
        scale: "",
        price_display: "Liên hệ báo giá",
        unit: "theo quy mô sự kiện",
        description: "",
        is_featured: false,
        features: [],
        unsupported_features: [],
        cta_text: "Nhận tư vấn gói này",
      },
      featuresText: "",
      unsupportedText: "",
    });
  };

  const openEditPackage = (pkg: PackageTierData) => {
    setModalError("");
    setEditingPackage({
      mode: "edit",
      originalId: pkg.id,
      draft: { ...pkg },
      featuresText: arrayToLines(pkg.features),
      unsupportedText: arrayToLines(pkg.unsupported_features),
    });
  };

  const handleSavePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPackage) return;
    const { mode, originalId, draft, featuresText, unsupportedText } =
      editingPackage;
    const trimmedName = draft.name.trim();
    const resolvedId = (draft.id.trim() || toSlugId(trimmedName)).trim();
    if (!trimmedName || !resolvedId) {
      setModalError("Vui lòng nhập Tên gói và Mã ID.");
      return;
    }
    const isDuplicate = packages.some(
      (p) => p.id === resolvedId && (mode === "create" || p.id !== originalId)
    );
    if (isDuplicate) {
      setModalError(`Mã gói "${resolvedId}" đã tồn tại.`);
      return;
    }

    const normalized: PackageTierData = {
      id: resolvedId,
      name: trimmedName,
      scale: draft.scale.trim() || "Theo yêu cầu",
      price_display: draft.price_display.trim() || "Liên hệ báo giá",
      unit: draft.unit.trim() || "theo quy mô sự kiện",
      description: draft.description.trim(),
      is_featured: Boolean(draft.is_featured),
      features: linesToArray(featuresText),
      unsupported_features: linesToArray(unsupportedText),
      ...(draft.cta_text?.trim() ? { cta_text: draft.cta_text.trim() } : {}),
    };

    const nextPackages =
      mode === "create"
        ? [...packages, normalized]
        : packages.map((p) => (p.id === originalId ? normalized : p));

    const ok = await persistFile(
      { ...servicesData, services, packages: nextPackages, combos },
      mode === "create"
        ? `Đã thêm gói "${normalized.name}" vào services.json`
        : `Đã cập nhật gói "${normalized.name}"`
    );
    if (ok) setEditingPackage(null);
  };

  const handleDeletePackage = async (id: string) => {
    const nextPackages = packages.filter((p) => p.id !== id);
    await persistFile(
      { ...servicesData, services, packages: nextPackages, combos },
      `Đã xóa gói "${id}" khỏi services.json`
    );
  };

  // --- Combo CRUD handlers ---
  const openCreateCombo = () => {
    setModalError("");
    setEditingCombo({
      mode: "create",
      draft: {
        id: "",
        code: "",
        title: "",
        subtitle: "",
        category: "su-kien",
        service_group: "",
        discount_badge: "Ưu đãi đặc biệt",
        valid_until: "",
        is_popular: false,
        gift_items: [],
        conditions: [],
        recommended_for: "",
      },
      giftItemsText: "",
      conditionsText: "",
    });
  };

  const openEditCombo = (combo: ComboPromoData) => {
    setModalError("");
    setEditingCombo({
      mode: "edit",
      originalId: combo.id,
      draft: { ...combo },
      giftItemsText: arrayToLines(combo.gift_items),
      conditionsText: arrayToLines(combo.conditions),
    });
  };

  const handleSaveCombo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCombo) return;
    const { mode, originalId, draft, giftItemsText, conditionsText } =
      editingCombo;
    const trimmedTitle = draft.title.trim();
    const resolvedId = (draft.id.trim() || toSlugId(trimmedTitle)).trim();
    if (!trimmedTitle || !resolvedId) {
      setModalError("Vui lòng nhập Tên Combo và Mã ID.");
      return;
    }
    const isDuplicate = combos.some(
      (c) => c.id === resolvedId && (mode === "create" || c.id !== originalId)
    );
    if (isDuplicate) {
      setModalError(`Mã Combo "${resolvedId}" đã tồn tại.`);
      return;
    }

    const normalized: ComboPromoData = {
      id: resolvedId,
      code: draft.code.trim() || resolvedId.toUpperCase(),
      title: trimmedTitle,
      subtitle: draft.subtitle.trim(),
      category: draft.category || "su-kien",
      service_group: draft.service_group.trim(),
      discount_badge: draft.discount_badge.trim() || "Ưu đãi",
      valid_until: draft.valid_until.trim(),
      is_popular: Boolean(draft.is_popular),
      gift_items: linesToArray(giftItemsText),
      conditions: linesToArray(conditionsText),
      recommended_for: draft.recommended_for.trim(),
    };

    const nextCombos =
      mode === "create"
        ? [...combos, normalized]
        : combos.map((c) => (c.id === originalId ? normalized : c));

    const ok = await persistFile(
      { ...servicesData, services, packages, combos: nextCombos },
      mode === "create"
        ? `Đã thêm combo "${normalized.title}" vào services.json`
        : `Đã cập nhật combo "${normalized.title}"`
    );
    if (ok) setEditingCombo(null);
  };

  const handleDeleteCombo = async (id: string) => {
    const nextCombos = combos.filter((c) => c.id !== id);
    await persistFile(
      { ...servicesData, services, packages, combos: nextCombos },
      `Đã xóa combo "${id}" khỏi services.json`
    );
  };

  const showServices = sectionFilter === "all" || sectionFilter === "services";
  const showPackages = sectionFilter === "all" || sectionFilter === "packages";
  const showCombos = sectionFilter === "all" || sectionFilter === "combos";

  return (
    <div className="space-y-6">
      {/* Info & Controls Toolbar */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#0A1E5E]" />
              Dữ liệu Dịch vụ & Gói sự kiện (Đồng bộ từ trang /dich-vu)
            </h4>
            <p className="text-xs text-slate-600 max-w-3xl">
              Toàn bộ danh mục dịch vụ, gói theo quy mô và combo ưu đãi được nạp từ trang{" "}
              <code>/dich-vu</code> vào <code>src/app/api/radar/brand/services.json</code>. Khi có thay đổi
              về dịch vụ, hạng mục hoặc ưu đãi, chỉnh sửa trực tiếp tại đây — hệ thống Radar AI sẽ tự
              động dùng dữ liệu mới để lập dàn ý, viết bài và gắn đúng liên kết{" "}
              <code>/dich-vu#*</code>.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={openCreateService}
              className="px-3 py-2 rounded-xl bg-[#0A1E5E] hover:bg-[#132d7e] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Thêm dịch vụ
            </button>
            <button
              type="button"
              onClick={openCreatePackage}
              className="px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Thêm gói
            </button>
            <button
              type="button"
              onClick={openCreateCombo}
              className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Thêm combo
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2 border-t border-slate-200">
          <div className="flex flex-wrap items-center gap-1.5">
            {(
              [
                {
                  id: "all",
                  label: `Tất cả (${services.length + packages.length + combos.length})`,
                },
                { id: "services", label: `Dịch vụ (${services.length})` },
                { id: "packages", label: `Gói theo quy mô (${packages.length})` },
                { id: "combos", label: `Combo ưu đãi (${combos.length})` },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSectionFilter(item.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  sectionFilter === item.id
                    ? "bg-[#0A1E5E] text-white"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                {item.label}
              </button>
            ))}

            <span className="text-slate-300 mx-1 hidden sm:inline">|</span>

            {(
              [
                { id: "all", label: "Mọi mảng" },
                { id: "su-kien", label: "Sự kiện" },
                { id: "du-lich", label: "Du lịch" },
              ] as const
            ).map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                  categoryFilter === cat.id
                    ? "bg-amber-100 text-amber-900 border border-amber-300"
                    : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm tên dịch vụ, gói, mã combo..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>

        {statusMessage && (
          <div
            className={`px-3.5 py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between ${
              statusMessage.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-rose-50 border-rose-200 text-rose-700"
            }`}
          >
            <span>{statusMessage.text}</span>
            <button
              type="button"
              onClick={() => setStatusMessage(null)}
              className="text-current opacity-70 hover:opacity-100 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* SECTION 1: DANH MỤC DỊCH VỤ */}
      {showServices && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h5 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              1. Danh mục Dịch vụ chuẩn ({filteredServices.length})
            </h5>
          </div>

          {filteredServices.length === 0 ? (
            <div className="p-6 rounded-2xl border border-dashed border-slate-300 text-center text-xs text-slate-500">
              Không có dịch vụ nào khớp với bộ lọc hiện tại.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredServices.map((svc) => {
                const delKey = `svc:${svc.id}`;
                return (
                  <div
                    key={svc.id}
                    className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-amber-400 transition-all flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                              svc.category === "du-lich"
                                ? "bg-teal-50 text-teal-800 border border-teal-200"
                                : "bg-blue-50 text-blue-700 border border-blue-200"
                            }`}
                          >
                            {formatCategoryLabel(svc.category)}
                          </span>
                          {svc.badge && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                              {svc.badge}
                            </span>
                          )}
                        </div>
                        <a
                          href={svc.page_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-amber-600 hover:underline flex items-center gap-1 font-semibold shrink-0"
                        >
                          Xem trang <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>

                      <div>
                        <span className="text-[10px] font-mono text-slate-400 block">
                          ID: {svc.id}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 mt-0.5 leading-snug">
                          {svc.name}
                        </h4>
                        {svc.description && (
                          <p className="text-xs text-slate-600 mt-1.5 line-clamp-3 leading-relaxed">
                            {svc.description}
                          </p>
                        )}
                      </div>

                      {svc.offerings && svc.offerings.length > 0 && (
                        <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 space-y-1">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            Hạng mục chính ({svc.offerings.length})
                          </div>
                          <ul className="space-y-1">
                            {svc.offerings.slice(0, 3).map((item, idx) => (
                              <li
                                key={idx}
                                className="text-[11px] text-slate-700 flex items-start gap-1.5"
                              >
                                <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                                <span className="line-clamp-1">{item}</span>
                              </li>
                            ))}
                            {svc.offerings.length > 3 && (
                              <li className="text-[10px] font-semibold text-amber-700 pl-4">
                                + {svc.offerings.length - 3} hạng mục khác...
                              </li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2.5 pt-2 border-t border-slate-100">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200/70">
                          {svc.price_policy || "Liên hệ báo giá"}
                        </span>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium">
                          {svc.equipment_groups?.length ? (
                            <span className="flex items-center gap-0.5">
                              <Wrench className="w-3 h-3" />
                              {svc.equipment_groups.length} nhóm TB
                            </span>
                          ) : null}
                          {svc.workflow?.length ? (
                            <span className="flex items-center gap-0.5">
                              <ListChecks className="w-3 h-3" />
                              {svc.workflow.length} bước
                            </span>
                          ) : null}
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2 text-[11px] text-slate-500">
                        <span className="truncate" title={svc.page_url}>
                          Link: {svc.page_url}
                        </span>
                        <span
                          className="font-semibold text-slate-700 truncate max-w-[140px]"
                          title={svc.cluster_ids?.join(", ")}
                        >
                          Cụm: {svc.cluster_ids?.length ? svc.cluster_ids.join(", ") : "Chưa gắn"}
                        </span>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-1">
                        {confirmDeleteKey === delKey ? (
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => void handleDeleteService(svc.id)}
                              disabled={saving}
                              className="px-2.5 py-1 rounded-lg bg-rose-600 text-white text-[11px] font-bold hover:bg-rose-700 cursor-pointer"
                            >
                              Xác nhận xóa
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteKey(null)}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-[11px] font-semibold hover:bg-slate-200 cursor-pointer"
                            >
                              Hủy
                            </button>
                          </div>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => openEditService(svc)}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-[#0A1E5E] hover:text-white text-slate-700 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <Edit3 className="w-3 h-3" /> Chỉnh sửa
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteKey(delKey)}
                              className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-700 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" /> Xóa
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SECTION 2: GÓI DỊCH VỤ THEO QUY MÔ */}
      {showPackages && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h5 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Package className="w-4 h-4 text-[#0A1E5E]" />
              2. Gói dịch vụ theo quy mô sự kiện ({filteredPackages.length})
            </h5>
          </div>

          {filteredPackages.length === 0 ? (
            <div className="p-6 rounded-2xl border border-dashed border-slate-300 text-center text-xs text-slate-500">
              Chưa có gói dịch vụ nào khớp bộ lọc.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {filteredPackages.map((pkg) => {
                const delKey = `pkg:${pkg.id}`;
                return (
                  <div
                    key={pkg.id}
                    className={`bg-white p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                      pkg.is_featured
                        ? "border-amber-400 ring-2 ring-amber-200/70"
                        : "border-slate-200 hover:border-amber-300"
                    }`}
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-mono text-slate-400 block">
                            ID: {pkg.id}
                          </span>
                          <h4 className="text-sm font-black text-[#0A1E5E]">{pkg.name}</h4>
                        </div>
                        {pkg.is_featured && (
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1 shrink-0">
                            <Award className="w-3 h-3" /> Phổ biến
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-[11px]">
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 font-bold border border-blue-200">
                          {pkg.scale}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
                          {pkg.price_display} ({pkg.unit})
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">{pkg.description}</p>

                      <div className="space-y-1.5 pt-1">
                        <div className="text-[10px] font-bold uppercase text-slate-500">
                          Bao gồm ({pkg.features.length} hạng mục)
                        </div>
                        <ul className="space-y-1">
                          {pkg.features.slice(0, 5).map((feat, idx) => (
                            <li
                              key={idx}
                              className="text-[11px] text-slate-700 flex items-start gap-1.5"
                            >
                              <Check className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{feat}</span>
                            </li>
                          ))}
                          {pkg.features.length > 5 && (
                            <li className="text-[10px] font-semibold text-amber-700 pl-4">
                              + {pkg.features.length - 5} hạng mục khác...
                            </li>
                          )}
                        </ul>
                      </div>

                      {pkg.unsupported_features && pkg.unsupported_features.length > 0 && (
                        <div className="space-y-1 pt-1">
                          <div className="text-[10px] font-bold uppercase text-slate-400">
                            Chưa bao gồm ({pkg.unsupported_features.length})
                          </div>
                          <ul className="space-y-1">
                            {pkg.unsupported_features.slice(0, 3).map((item, idx) => (
                              <li
                                key={idx}
                                className="text-[11px] text-slate-400 flex items-start gap-1.5 line-through"
                              >
                                <X className="w-3 h-3 shrink-0 mt-0.5" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                      {confirmDeleteKey === delKey ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => void handleDeletePackage(pkg.id)}
                            disabled={saving}
                            className="px-2.5 py-1 rounded-lg bg-rose-600 text-white text-[11px] font-bold hover:bg-rose-700 cursor-pointer"
                          >
                            Xác nhận xóa
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteKey(null)}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-[11px] font-semibold hover:bg-slate-200 cursor-pointer"
                          >
                            Hủy
                          </button>
                        </div>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => openEditPackage(pkg)}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-[#0A1E5E] hover:text-white text-slate-700 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-3 h-3" /> Chỉnh sửa
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteKey(delKey)}
                            className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-700 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" /> Xóa
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SECTION 3: COMBO ƯU ĐÃI */}
      {showCombos && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h5 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Gift className="w-4 h-4 text-emerald-600" />
              3. Combo ưu đãi & Quà tặng kèm ({filteredCombos.length})
            </h5>
          </div>

          {filteredCombos.length === 0 ? (
            <div className="p-6 rounded-2xl border border-dashed border-slate-300 text-center text-xs text-slate-500">
              Không có combo nào khớp bộ lọc.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCombos.map((combo) => {
                const delKey = `combo:${combo.id}`;
                return (
                  <div
                    key={combo.id}
                    className={`bg-white p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                      combo.is_popular
                        ? "border-amber-400 shadow-xs"
                        : "border-slate-200 hover:border-amber-300"
                    }`}
                  >
                    <div className="space-y-2.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-900 text-amber-300 flex items-center gap-1">
                            <Tag className="w-2.5 h-2.5" /> {combo.code}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              combo.category === "du-lich"
                                ? "bg-teal-50 text-teal-800 border border-teal-200"
                                : "bg-blue-50 text-blue-700 border border-blue-200"
                            }`}
                          >
                            {formatCategoryLabel(combo.category)}
                          </span>
                          {combo.is_popular && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                              <Flame className="w-3 h-3 text-amber-600" /> Nổi bật
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900">
                          {combo.discount_badge}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-[#0A1E5E]">{combo.title}</h4>
                        <p className="text-xs text-slate-600 mt-0.5">{combo.subtitle}</p>
                        {combo.valid_until && (
                          <p className="text-[11px] font-semibold text-amber-700 mt-1">
                            Hiệu lực: {combo.valid_until} • Nhóm: {combo.service_group}
                          </p>
                        )}
                      </div>

                      <div className="bg-amber-50/70 border border-amber-200/70 rounded-xl p-3 space-y-1">
                        <div className="text-[10px] font-bold uppercase text-amber-900">
                          Ưu đãi / Quà tặng ({combo.gift_items.length})
                        </div>
                        <ul className="space-y-1">
                          {combo.gift_items.map((gift, idx) => (
                            <li
                              key={idx}
                              className="text-[11px] text-slate-700 flex items-start gap-1.5"
                            >
                              <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{gift}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {combo.conditions.length > 0 && (
                        <div className="text-[11px] text-slate-500 space-y-0.5">
                          <span className="font-bold text-slate-700">Điều kiện:</span>{" "}
                          {combo.conditions.join(" • ")}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                      <span className="text-[11px] text-slate-500 truncate max-w-[60%]">
                        Phù hợp: {combo.recommended_for}
                      </span>

                      {confirmDeleteKey === delKey ? (
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => void handleDeleteCombo(combo.id)}
                            disabled={saving}
                            className="px-2.5 py-1 rounded-lg bg-rose-600 text-white text-[11px] font-bold hover:bg-rose-700 cursor-pointer"
                          >
                            Xác nhận xóa
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteKey(null)}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-[11px] font-semibold hover:bg-slate-200 cursor-pointer"
                          >
                            Hủy
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => openEditCombo(combo)}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-[#0A1E5E] hover:text-white text-slate-700 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-3 h-3" /> Chỉnh sửa
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteKey(delKey)}
                            className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-700 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" /> Xóa
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* MODAL: SERVICE EDITOR */}
      {editingService && (
        <ModalShell
          title={
            editingService.mode === "create"
              ? "Thêm dịch vụ mới vào Brand Brain"
              : `Chỉnh sửa dịch vụ: ${editingService.draft.name}`
          }
          subtitle="Dữ liệu được lưu vào src/app/api/radar/brand/services.json (phân hệ admin-radar)."
          onClose={() => setEditingService(null)}
          onSubmit={handleSaveService}
          saving={saving}
          error={modalError}
          submitLabel="Lưu dịch vụ vào JSON"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Tên dịch vụ chính thức *
              </label>
              <input
                type="text"
                required
                value={editingService.draft.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setEditingService((prev) =>
                    prev
                      ? {
                          ...prev,
                          draft: {
                            ...prev.draft,
                            name,
                            ...(prev.mode === "create" && !prev.draft.id
                              ? { page_url: `/dich-vu#${toSlugId(name)}` }
                              : {}),
                          },
                        }
                      : null
                  );
                }}
                placeholder="VD: Tổ chức Lễ Khai trương trọn gói"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Mã ID (slug định danh) *
              </label>
              <input
                type="text"
                value={editingService.draft.id}
                readOnly={editingService.mode === "edit"}
                onChange={(e) =>
                  setEditingService((prev) =>
                    prev
                      ? { ...prev, draft: { ...prev.draft, id: e.target.value } }
                      : null
                  )
                }
                placeholder="Tự tạo từ tên nếu để trống"
                className={`w-full px-3 py-2 border border-slate-200 rounded-xl font-mono ${
                  editingService.mode === "edit"
                    ? "bg-slate-100 text-slate-500"
                    : "focus:outline-none focus:ring-1 focus:ring-amber-500"
                }`}
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Tên ngắn (Tag)</label>
              <input
                type="text"
                value={editingService.draft.short_name || ""}
                onChange={(e) =>
                  setEditingService((prev) =>
                    prev
                      ? { ...prev, draft: { ...prev.draft, short_name: e.target.value } }
                      : null
                  )
                }
                placeholder="VD: Khai trương & Khánh thành"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Phân mảng</label>
                <select
                  value={editingService.draft.category || "su-kien"}
                  onChange={(e) =>
                    setEditingService((prev) =>
                      prev
                        ? { ...prev, draft: { ...prev.draft, category: e.target.value } }
                        : null
                    )
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                >
                  <option value="su-kien">Sự kiện</option>
                  <option value="du-lich">Du lịch & Tour</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nhãn nổi bật</label>
                <input
                  type="text"
                  value={editingService.draft.badge || ""}
                  onChange={(e) =>
                    setEditingService((prev) =>
                      prev
                        ? { ...prev, draft: { ...prev.draft, badge: e.target.value } }
                        : null
                    )
                  }
                  placeholder="VD: Dịch Vụ Mũi Nhọn"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Đường dẫn trang đích (/dich-vu#*) *
              </label>
              <input
                type="text"
                required
                value={editingService.draft.page_url}
                onChange={(e) =>
                  setEditingService((prev) =>
                    prev
                      ? { ...prev, draft: { ...prev.draft, page_url: e.target.value } }
                      : null
                  )
                }
                placeholder="/dich-vu#khai-truong-khanh-thanh"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Chính sách báo giá (AI trích dẫn theo mục này)
              </label>
              <input
                type="text"
                value={editingService.draft.price_policy || ""}
                onChange={(e) =>
                  setEditingService((prev) =>
                    prev
                      ? { ...prev, draft: { ...prev.draft, price_policy: e.target.value } }
                      : null
                  )
                }
                placeholder="VD: Liên hệ nhận báo giá trọn gói"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Mô tả chi tiết dịch vụ
            </label>
            <textarea
              rows={3}
              value={editingService.draft.description || ""}
              onChange={(e) =>
                setEditingService((prev) =>
                  prev
                    ? { ...prev, draft: { ...prev.draft, description: e.target.value } }
                    : null
                )
              }
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Hạng mục triển khai (Mỗi dòng một hạng mục)
            </label>
            <textarea
              rows={4}
              value={editingService.offeringsText}
              onChange={(e) =>
                setEditingService((prev) =>
                  prev ? { ...prev, offeringsText: e.target.value } : null
                )
              }
              placeholder="Nhập mỗi hạng mục trên một dòng..."
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Đối tượng khách hàng mục tiêu
            </label>
            <input
              type="text"
              value={editingService.draft.target_audience || ""}
              onChange={(e) =>
                setEditingService((prev) =>
                  prev
                    ? {
                        ...prev,
                        draft: { ...prev.draft, target_audience: e.target.value },
                      }
                    : null
                )
              }
              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
            />
          </div>

          {/* Cluster Mapping */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
            <label className="block font-bold text-slate-700">
              Cụm chủ đề SEO liên kết (Cluster IDs)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-36 overflow-y-auto">
              {selectableClusters.map((c) => {
                const checked = editingService.draft.cluster_ids.includes(c.id);
                return (
                  <label
                    key={c.id}
                    className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border cursor-pointer text-[11px] ${
                      checked
                        ? "bg-amber-50 border-amber-300 text-amber-950 font-semibold"
                        : "bg-white border-slate-200 text-slate-600"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() =>
                        setEditingService((prev) => {
                          if (!prev) return null;
                          const nextIds = checked
                            ? prev.draft.cluster_ids.filter((id) => id !== c.id)
                            : [...prev.draft.cluster_ids, c.id];
                          return {
                            ...prev,
                            draft: { ...prev.draft, cluster_ids: nextIds },
                          };
                        })
                      }
                    />
                    <span className="truncate">
                      {c.name} <span className="text-slate-400">({c.id})</span>
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Equipment Groups Editor */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700">
                Bóc tách nhóm thiết bị ({editingService.draft.equipment_groups?.length || 0})
              </span>
              <button
                type="button"
                onClick={() =>
                  setEditingService((prev) =>
                    prev
                      ? {
                          ...prev,
                          draft: {
                            ...prev.draft,
                            equipment_groups: [
                              ...(prev.draft.equipment_groups || []),
                              { category: "", items: [] },
                            ],
                          },
                        }
                      : null
                  )
                }
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] font-bold text-[#0A1E5E] hover:bg-slate-100 cursor-pointer flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Thêm nhóm thiết bị
              </button>
            </div>
            {(editingService.draft.equipment_groups || []).map((grp, gIdx) => (
              <div
                key={gIdx}
                className="bg-white p-2.5 rounded-xl border border-slate-200 space-y-2"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={grp.category}
                    onChange={(e) =>
                      setEditingService((prev) => {
                        if (!prev) return null;
                        const next = [...(prev.draft.equipment_groups || [])];
                        next[gIdx] = { ...next[gIdx], category: e.target.value };
                        return { ...prev, draft: { ...prev.draft, equipment_groups: next } };
                      })
                    }
                    placeholder="Tên nhóm thiết bị (VD: Hệ thống Âm thanh)"
                    className="flex-1 px-2.5 py-1.5 border border-slate-200 rounded-lg font-semibold"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setEditingService((prev) => {
                        if (!prev) return null;
                        const next = (prev.draft.equipment_groups || []).filter(
                          (_, i) => i !== gIdx
                        );
                        return { ...prev, draft: { ...prev.draft, equipment_groups: next } };
                      })
                    }
                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={arrayToLines(grp.items)}
                  onChange={(e) =>
                    setEditingService((prev) => {
                      if (!prev) return null;
                      const next = [...(prev.draft.equipment_groups || [])];
                      next[gIdx] = {
                        ...next[gIdx],
                        items: e.target.value.split("\n"),
                      };
                      return { ...prev, draft: { ...prev.draft, equipment_groups: next } };
                    })
                  }
                  placeholder="Mỗi thiết bị trên một dòng..."
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-[11px]"
                />
              </div>
            ))}
          </div>

          {/* Workflow Editor */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700">
                Quy trình thực hiện ({editingService.draft.workflow?.length || 0} bước)
              </span>
              <button
                type="button"
                onClick={() =>
                  setEditingService((prev) =>
                    prev
                      ? {
                          ...prev,
                          draft: {
                            ...prev.draft,
                            workflow: [
                              ...(prev.draft.workflow || []),
                              {
                                step: (prev.draft.workflow?.length || 0) + 1,
                                title: "",
                                desc: "",
                              },
                            ],
                          },
                        }
                      : null
                  )
                }
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] font-bold text-[#0A1E5E] hover:bg-slate-100 cursor-pointer flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Thêm bước quy trình
              </button>
            </div>
            {(editingService.draft.workflow || []).map((stepItem, sIdx) => (
              <div
                key={sIdx}
                className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-start gap-2"
              >
                <span className="px-2 py-1 rounded bg-[#0A1E5E] text-white font-black text-[10px] shrink-0 mt-0.5">
                  B{sIdx + 1}
                </span>
                <div className="flex-1 space-y-1.5">
                  <input
                    type="text"
                    value={stepItem.title}
                    onChange={(e) =>
                      setEditingService((prev) => {
                        if (!prev) return null;
                        const next = [...(prev.draft.workflow || [])];
                        next[sIdx] = { ...next[sIdx], title: e.target.value };
                        return { ...prev, draft: { ...prev.draft, workflow: next } };
                      })
                    }
                    placeholder="Tên bước"
                    className="w-full px-2.5 py-1 border border-slate-200 rounded-lg font-semibold"
                  />
                  <input
                    type="text"
                    value={stepItem.desc}
                    onChange={(e) =>
                      setEditingService((prev) => {
                        if (!prev) return null;
                        const next = [...(prev.draft.workflow || [])];
                        next[sIdx] = { ...next[sIdx], desc: e.target.value };
                        return { ...prev, draft: { ...prev.draft, workflow: next } };
                      })
                    }
                    placeholder="Mô tả công việc của bước này"
                    className="w-full px-2.5 py-1 border border-slate-200 rounded-lg text-[11px]"
                  />
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setEditingService((prev) => {
                      if (!prev) return null;
                      const next = (prev.draft.workflow || []).filter((_, i) => i !== sIdx);
                      return { ...prev, draft: { ...prev.draft, workflow: next } };
                    })
                  }
                  className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </ModalShell>
      )}

      {/* MODAL: PACKAGE TIER EDITOR */}
      {editingPackage && (
        <ModalShell
          title={
            editingPackage.mode === "create"
              ? "Thêm gói dịch vụ mới"
              : `Chỉnh sửa gói: ${editingPackage.draft.name}`
          }
          subtitle="Cập nhật hạng mục, quy mô và chính sách báo giá cho các gói sự kiện."
          onClose={() => setEditingPackage(null)}
          onSubmit={handleSavePackage}
          saving={saving}
          error={modalError}
          submitLabel="Lưu gói vào JSON"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Tên gói *</label>
              <input
                type="text"
                required
                value={editingPackage.draft.name}
                onChange={(e) =>
                  setEditingPackage((prev) =>
                    prev
                      ? { ...prev, draft: { ...prev.draft, name: e.target.value } }
                      : null
                  )
                }
                placeholder="VD: Gói Tiêu Chuẩn (Chuyên Nghiệp)"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Mã ID *</label>
              <input
                type="text"
                value={editingPackage.draft.id}
                readOnly={editingPackage.mode === "edit"}
                onChange={(e) =>
                  setEditingPackage((prev) =>
                    prev
                      ? { ...prev, draft: { ...prev.draft, id: e.target.value } }
                      : null
                  )
                }
                placeholder="Tự tạo từ tên gói nếu để trống"
                className={`w-full px-3 py-2 border border-slate-200 rounded-xl font-mono ${
                  editingPackage.mode === "edit" ? "bg-slate-100 text-slate-500" : ""
                }`}
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Quy mô áp dụng</label>
              <input
                type="text"
                value={editingPackage.draft.scale}
                onChange={(e) =>
                  setEditingPackage((prev) =>
                    prev
                      ? { ...prev, draft: { ...prev.draft, scale: e.target.value } }
                      : null
                  )
                }
                placeholder="VD: Quy mô 100 - 300 khách"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Hiển thị giá</label>
                <input
                  type="text"
                  value={editingPackage.draft.price_display}
                  onChange={(e) =>
                    setEditingPackage((prev) =>
                      prev
                        ? {
                            ...prev,
                            draft: { ...prev.draft, price_display: e.target.value },
                          }
                        : null
                    )
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Đơn vị / Ghi chú</label>
                <input
                  type="text"
                  value={editingPackage.draft.unit}
                  onChange={(e) =>
                    setEditingPackage((prev) =>
                      prev
                        ? { ...prev, draft: { ...prev.draft, unit: e.target.value } }
                        : null
                    )
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>
            </div>
          </div>

          <label className="inline-flex items-center gap-2 font-bold text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={Boolean(editingPackage.draft.is_featured)}
              onChange={(e) =>
                setEditingPackage((prev) =>
                  prev
                    ? {
                        ...prev,
                        draft: { ...prev.draft, is_featured: e.target.checked },
                      }
                    : null
                )
              }
            />
            Đánh dấu là gói nổi bật / phổ biến nhất
          </label>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Mô tả gói</label>
            <textarea
              rows={2}
              value={editingPackage.draft.description}
              onChange={(e) =>
                setEditingPackage((prev) =>
                  prev
                    ? { ...prev, draft: { ...prev.draft, description: e.target.value } }
                    : null
                )
              }
              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Hạng mục bao gồm trong gói (Mỗi dòng một hạng mục)
            </label>
            <textarea
              rows={5}
              value={editingPackage.featuresText}
              onChange={(e) =>
                setEditingPackage((prev) =>
                  prev ? { ...prev, featuresText: e.target.value } : null
                )
              }
              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Hạng mục chưa bao gồm (Mỗi dòng một hạng mục)
            </label>
            <textarea
              rows={3}
              value={editingPackage.unsupportedText}
              onChange={(e) =>
                setEditingPackage((prev) =>
                  prev ? { ...prev, unsupportedText: e.target.value } : null
                )
              }
              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
            />
          </div>
        </ModalShell>
      )}

      {/* MODAL: COMBO PROMO EDITOR */}
      {editingCombo && (
        <ModalShell
          title={
            editingCombo.mode === "create"
              ? "Thêm Combo ưu đãi mới"
              : `Chỉnh sửa Combo: ${editingCombo.draft.title}`
          }
          subtitle="Quản lý mã combo, quà tặng đi kèm và điều kiện áp dụng từ trang /dich-vu."
          onClose={() => setEditingCombo(null)}
          onSubmit={handleSaveCombo}
          saving={saving}
          error={modalError}
          submitLabel="Lưu combo vào JSON"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Tên Combo *</label>
              <input
                type="text"
                required
                value={editingCombo.draft.title}
                onChange={(e) =>
                  setEditingCombo((prev) =>
                    prev
                      ? { ...prev, draft: { ...prev.draft, title: e.target.value } }
                      : null
                  )
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Mã Code</label>
                <input
                  type="text"
                  value={editingCombo.draft.code}
                  onChange={(e) =>
                    setEditingCombo((prev) =>
                      prev
                        ? { ...prev, draft: { ...prev.draft, code: e.target.value } }
                        : null
                    )
                  }
                  placeholder="COMBO-..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Mã ID *</label>
                <input
                  type="text"
                  value={editingCombo.draft.id}
                  readOnly={editingCombo.mode === "edit"}
                  onChange={(e) =>
                    setEditingCombo((prev) =>
                      prev ? { ...prev, draft: { ...prev.draft, id: e.target.value } } : null
                    )
                  }
                  placeholder="Auto slug"
                  className={`w-full px-3 py-2 border border-slate-200 rounded-xl font-mono ${
                    editingCombo.mode === "edit" ? "bg-slate-100 text-slate-500" : ""
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Mô tả ngắn (Subtitle)</label>
              <input
                type="text"
                value={editingCombo.draft.subtitle}
                onChange={(e) =>
                  setEditingCombo((prev) =>
                    prev
                      ? { ...prev, draft: { ...prev.draft, subtitle: e.target.value } }
                      : null
                  )
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Nhóm dịch vụ</label>
              <input
                type="text"
                value={editingCombo.draft.service_group}
                onChange={(e) =>
                  setEditingCombo((prev) =>
                    prev
                      ? { ...prev, draft: { ...prev.draft, service_group: e.target.value } }
                      : null
                  )
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Mảng</label>
                <select
                  value={editingCombo.draft.category}
                  onChange={(e) =>
                    setEditingCombo((prev) =>
                      prev
                        ? { ...prev, draft: { ...prev.draft, category: e.target.value } }
                        : null
                    )
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                >
                  <option value="su-kien">Sự kiện</option>
                  <option value="du-lich">Du lịch & MICE</option>
                  <option value="all">Tất cả</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nhãn ưu đãi</label>
                <input
                  type="text"
                  value={editingCombo.draft.discount_badge}
                  onChange={(e) =>
                    setEditingCombo((prev) =>
                      prev
                        ? { ...prev, draft: { ...prev.draft, discount_badge: e.target.value } }
                        : null
                    )
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Thời hạn / Phạm vi</label>
              <input
                type="text"
                value={editingCombo.draft.valid_until}
                onChange={(e) =>
                  setEditingCombo((prev) =>
                    prev
                      ? { ...prev, draft: { ...prev.draft, valid_until: e.target.value } }
                      : null
                  )
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <label className="inline-flex items-center gap-2 font-bold text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={Boolean(editingCombo.draft.is_popular)}
              onChange={(e) =>
                setEditingCombo((prev) =>
                  prev
                    ? { ...prev, draft: { ...prev.draft, is_popular: e.target.checked } }
                    : null
                )
              }
            />
            Đánh dấu combo nổi bật
          </label>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Quà tặng & ưu đãi đi kèm (Mỗi dòng một mục)
            </label>
            <textarea
              rows={4}
              value={editingCombo.giftItemsText}
              onChange={(e) =>
                setEditingCombo((prev) =>
                  prev ? { ...prev, giftItemsText: e.target.value } : null
                )
              }
              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Điều kiện áp dụng (Mỗi dòng một điều kiện)
            </label>
            <textarea
              rows={3}
              value={editingCombo.conditionsText}
              onChange={(e) =>
                setEditingCombo((prev) =>
                  prev ? { ...prev, conditionsText: e.target.value } : null
                )
              }
              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Khuyên dùng cho</label>
            <input
              type="text"
              value={editingCombo.draft.recommended_for}
              onChange={(e) =>
                setEditingCombo((prev) =>
                  prev
                    ? { ...prev, draft: { ...prev.draft, recommended_for: e.target.value } }
                    : null
                )
              }
              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
            />
          </div>
        </ModalShell>
      )}
    </div>
  );
}

