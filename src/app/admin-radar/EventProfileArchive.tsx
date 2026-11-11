"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  addEventProfile,
  DEFAULT_EVENT_PROFILES,
  deleteEventProfile,
  EventCategory,
  EventProfile,
  fetchAndSyncRealEventProfiles,
  getEventVenueType,
  getStoredEventProfiles,
  setupRealtimeEventProfilesSync,
  updateEventProfile,
} from "./event-profiles-data";
import {
  formatVND,
  generateCaseStudyArticle,
  GeneratedCaseStudyResult,
  saveGeneratedCaseStudyToCMS,
} from "./event-case-study-generator";
import {
  buildRadarHref,
  CATEGORY_LABELS,
  getCategoryLabel,
  RadarEditablePostPayload,
  RadarTabId,
  savePendingRadarDraft,
  savePendingRadarProfileId,
} from "./radar-handoff";
import {
  CaseStudyPreviewModal,
  EventProfileDetailModal,
  EventProfileFormModal,
  MetricBreakdownModal,
  MetricModalType,
} from "./EventProfileModals";

export interface EventProfileArchiveProps {
  onOpenInRadarEditor?: (post: RadarEditablePostPayload) => void;
  onPostCreated?: (post: RadarEditablePostPayload) => void;
  onSelectForRadarWriter?: (profile: EventProfile) => void;
  onNavigateRadarTab?: (
    tab: RadarTabId,
    options?: { profileId?: string; postSlug?: string }
  ) => void;
  onProfilesChange?: (profiles: EventProfile[]) => void;
}

type ViewMode = "grid" | "table";
type SortBy = "newest" | "budget_desc" | "guests_desc";
type VenueFilter = "all" | "indoor" | "outdoor";
type SeoFilter = "all" | "pending" | "generated";
type SourceFilter = "all" | "crm" | "manual";

interface InlineNotice {
  type: "success" | "info" | "error";
  text: string;
  actionLabel?: string;
  actionTab?: RadarTabId;
}

function CardThumbnail({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="w-full h-40 bg-slate-100 flex items-center justify-center text-xs font-semibold text-slate-400">
        Chưa có ảnh hiện trường
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-[1.02]"
    />
  );
}

export default function EventProfileArchive({
  onOpenInRadarEditor,
  onPostCreated,
  onSelectForRadarWriter,
  onNavigateRadarTab,
  onProfilesChange,
}: EventProfileArchiveProps) {
  const [profiles, setProfiles] = useState<EventProfile[]>(DEFAULT_EVENT_PROFILES);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | "all">("all");
  const [venueFilter, setVenueFilter] = useState<VenueFilter>("all");
  const [seoFilter, setSeoFilter] = useState<SeoFilter>("all");
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>("all");
  const [sortBy, setSortBy] = useState<SortBy>("newest");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  // CRM sync status
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>("");
  const [syncLeadCount, setSyncLeadCount] = useState<number>(0);

  // Modals & inline feedback
  const [detailProfile, setDetailProfile] = useState<EventProfile | null>(null);
  const [editingProfile, setEditingProfile] = useState<EventProfile | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeMetricModal, setActiveMetricModal] = useState<MetricModalType>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [notice, setNotice] = useState<InlineNotice | null>(null);

  // Case study preview state
  const [caseStudyTarget, setCaseStudyTarget] = useState<EventProfile | null>(null);
  const [caseStudyDraft, setCaseStudyDraft] = useState<GeneratedCaseStudyResult | null>(null);
  const [isSavingPost, setIsSavingPost] = useState(false);
  const [savePostSuccess, setSavePostSuccess] = useState<string | null>(null);
  const [savePostError, setSavePostError] = useState<string | null>(null);

  const syncParentProfiles = useCallback(
    (nextProfiles: EventProfile[]) => {
      onProfilesChange?.(nextProfiles);
    },
    [onProfilesChange]
  );

  const handleSyncCRM = useCallback(
    async (silent = false) => {
      setIsSyncing(true);
      try {
        const res = await fetchAndSyncRealEventProfiles();
        setProfiles(res.profiles);
        syncParentProfiles(res.profiles);
        setLastSyncTime(res.lastSyncTime);
        setSyncLeadCount(res.syncedLeadCount);

        if (!silent) {
          setNotice({
            type: "success",
            text:
              res.newCount > 0
                ? `Đã đồng bộ thêm ${res.newCount} hồ sơ sự kiện mới từ CRM (${res.lastSyncTime}).`
                : `Đã đồng bộ xong dữ liệu CRM (${res.syncedLeadCount} hợp đồng đang khớp, lúc ${res.lastSyncTime}).`,
          });
        }
      } catch {
        if (!silent) {
          setNotice({
            type: "error",
            text: "Không thể kết nối CRM lúc này. Đang hiển thị dữ liệu lưu tại máy.",
          });
        }
      } finally {
        setIsSyncing(false);
      }
    },
    [syncParentProfiles]
  );

  // Khởi tạo từ localStorage + đồng bộ CRM + realtime listener (deferred khỏi render sync)
  useEffect(() => {
    let active = true;
    const initTimer = window.setTimeout(() => {
      if (!active) return;
      const stored = getStoredEventProfiles();
      setProfiles(stored);
      syncParentProfiles(stored);
      void handleSyncCRM(true);
    }, 0);

    const unsubscribe = setupRealtimeEventProfilesSync((updated) => {
      if (!active) return;
      setProfiles(updated);
      syncParentProfiles(updated);
      setNotice({
        type: "info",
        text: "CRM vừa cập nhật đơn hàng mới và đã tự động đồng bộ vào Hồ sơ sự kiện.",
      });
    });

    return () => {
      active = false;
      window.clearTimeout(initTimer);
      unsubscribe();
    };
  }, [handleSyncCRM, syncParentProfiles]);

  // Thống kê tổng quan
  const summaryStats = useMemo(() => {
    const total = profiles.length;
    const totalRevenue = profiles.reduce(
      (sum, item) => sum + (item.financials?.totalBudget || 0),
      0
    );
    const totalGuests = profiles.reduce((sum, item) => sum + (item.guestCount || 0), 0);
    const generatedCount = profiles.filter((p) => p.seoMeta?.isGenerated).length;
    const pendingSeoCount = total - generatedCount;
    const crmCount = profiles.filter((p) => p.isAutoSynced).length;

    return {
      total,
      totalRevenue,
      totalGuests,
      generatedCount,
      pendingSeoCount,
      crmCount,
    };
  }, [profiles]);

  // Danh sách đã lọc & sắp xếp
  const filteredProfiles = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase();

    const list = profiles.filter((p) => {
      if (selectedCategory !== "all" && p.category !== selectedCategory) return false;
      if (venueFilter !== "all" && getEventVenueType(p) !== venueFilter) return false;
      if (seoFilter === "generated" && !p.seoMeta?.isGenerated) return false;
      if (seoFilter === "pending" && p.seoMeta?.isGenerated) return false;
      if (sourceFilter === "crm" && !p.isAutoSynced) return false;
      if (sourceFilter === "manual" && p.isAutoSynced) return false;

      if (!keyword) return true;
      const haystacks = [
        p.title,
        p.client?.company,
        p.client?.name,
        p.location?.venue,
        p.location?.city,
        p.seoMeta?.suggestedKeyword,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystacks.includes(keyword);
    });

    return [...list].sort((a, b) => {
      if (sortBy === "budget_desc") {
        return (b.financials?.totalBudget || 0) - (a.financials?.totalBudget || 0);
      }
      if (sortBy === "guests_desc") {
        return (b.guestCount || 0) - (a.guestCount || 0);
      }
      return (b.date || "").localeCompare(a.date || "");
    });
  }, [
    profiles,
    searchQuery,
    selectedCategory,
    venueFilter,
    seoFilter,
    sourceFilter,
    sortBy,
  ]);

  const hasActiveFilter =
    searchQuery.trim() !== "" ||
    selectedCategory !== "all" ||
    venueFilter !== "all" ||
    seoFilter !== "all" ||
    sourceFilter !== "all" ||
    sortBy !== "newest";

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setVenueFilter("all");
    setSeoFilter("all");
    setSourceFilter("all");
    setSortBy("newest");
  };

  // Điều hướng thống nhất sang Radar SEO
  const goToRadar = (
    tab: RadarTabId,
    options?: { profileId?: string; postSlug?: string }
  ) => {
    if (onNavigateRadarTab) {
      onNavigateRadarTab(tab, options);
      return;
    }
    if (typeof window !== "undefined") {
      window.location.href = buildRadarHref(tab, options);
    }
  };

  const handleUseInRadarWriter = (profile: EventProfile) => {
    setDetailProfile(null);
    if (onSelectForRadarWriter) {
      onSelectForRadarWriter(profile);
      return;
    }
    savePendingRadarProfileId(profile.id);
    goToRadar("viet_bai", { profileId: profile.id });
  };

  const handleOpenCaseStudy = (profile: EventProfile) => {
    setDetailProfile(null);
    const draft = generateCaseStudyArticle(profile);
    setCaseStudyTarget(profile);
    setCaseStudyDraft(draft);
    setSavePostSuccess(null);
    setSavePostError(null);
  };

  const handleSaveCaseStudyToCms = async (publishImmediately: boolean) => {
    if (!caseStudyTarget || !caseStudyDraft) return;
    setIsSavingPost(true);
    setSavePostError(null);
    setSavePostSuccess(null);

    try {
      const payloadToSave: GeneratedCaseStudyResult = {
        ...caseStudyDraft,
        status: publishImmediately ? "published" : "draft",
      };

      const savedPost = await saveGeneratedCaseStudyToCMS(
        payloadToSave,
        caseStudyTarget.id,
        (created) => {
          onPostCreated?.(created);
        }
      );

      const refreshed = getStoredEventProfiles();
      setProfiles(refreshed);
      syncParentProfiles(refreshed);
      setCaseStudyDraft({ ...payloadToSave });

      const statusText = publishImmediately
        ? `Đã xuất bản bài "${savedPost?.title || payloadToSave.title}" vào Kho bài viết Radar SEO.`
        : `Đã lưu bản nháp "${savedPost?.title || payloadToSave.title}" vào Kho bài viết Radar SEO.`;

      setSavePostSuccess(statusText);
      setNotice({
        type: "success",
        text: statusText,
        actionLabel: "Mở Kho bài viết",
        actionTab: "duyet_bai",
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Không thể lưu bài viết vào hệ thống.";
      setSavePostError(message);
    } finally {
      setIsSavingPost(false);
    }
  };

  const handleOpenGeneratedDraftInEditor = () => {
    if (!caseStudyDraft || !caseStudyTarget) return;
    const editorPayload: RadarEditablePostPayload = {
      ...caseStudyDraft,
      sourceProfileId: caseStudyTarget.id,
    };
    setCaseStudyTarget(null);
    setCaseStudyDraft(null);

    if (onOpenInRadarEditor) {
      savePendingRadarDraft(editorPayload);
      onOpenInRadarEditor(editorPayload);
      return;
    }

    savePendingRadarDraft(editorPayload);
    if (typeof window !== "undefined") {
      window.location.href = buildRadarHref("viet_bai", {
        profileId: caseStudyTarget.id,
        fromDraft: true,
      });
    }
  };

  const handleSaveProfileForm = (
    payload: Omit<EventProfile, "id" | "created_at">,
    existingId?: string
  ) => {
    if (existingId) {
      const updatedList = updateEventProfile(existingId, payload);
      setProfiles(updatedList);
      syncParentProfiles(updatedList);
      setNotice({
        type: "success",
        text: `Đã cập nhật hồ sơ "${payload.title}".`,
      });
    } else {
      addEventProfile(payload);
      const updatedList = getStoredEventProfiles();
      setProfiles(updatedList);
      syncParentProfiles(updatedList);
      setNotice({
        type: "success",
        text: `Đã thêm hồ sơ mới "${payload.title}". Bạn có thể tạo bài SEO ngay bây giờ.`,
      });
    }
    setIsFormOpen(false);
    setEditingProfile(null);
  };

  const handleConfirmDelete = (id: string) => {
    const target = profiles.find((p) => p.id === id);
    const updatedList = deleteEventProfile(id);
    setProfiles(updatedList);
    syncParentProfiles(updatedList);
    setConfirmDeleteId(null);
    setNotice({
      type: "info",
      text: `Đã xóa hồ sơ "${target?.title || "sự kiện"}".`,
    });
  };

  const stepTwoActive = seoFilter === "pending";
  const stepOneActive = sourceFilter === "crm";
  const stepThreeActive = seoFilter === "generated";

  return (
    <div className="space-y-5 text-slate-900">
      {/* =================================================================== */}
      {/* 1. HEADER BAR THỐNG NHẤT VỚI RADAR SEO (KHÔNG ICON, NÚT TÊN RÕ RÀNG) */}
      {/* =================================================================== */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold">
              <span className="uppercase tracking-wider text-amber-700">
                HỒ SƠ SỰ KIỆN &amp; DỮ LIỆU MINH CHỨNG SEO
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700">
                {isSyncing
                  ? "Đang đồng bộ CRM..."
                  : lastSyncTime
                    ? `CRM đã đồng bộ lúc ${lastSyncTime} (${syncLeadCount} đơn)`
                    : "Sẵn sàng đồng bộ CRM"}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Hồ sơ sự kiện thực tế
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl">
              Lưu dự án đã triển khai (ảnh hiện trường, báo giá, thiết bị) làm nguồn dữ liệu thật để{" "}
              <span className="font-semibold text-slate-900">Radar SEO</span> viết bài chính xác và tăng tỷ lệ lên Top Google.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => void handleSyncCRM(false)}
              disabled={isSyncing}
              className="px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold disabled:opacity-50 cursor-pointer"
            >
              {isSyncing ? "Đang đồng bộ CRM..." : "Đồng bộ CRM"}
            </button>

            <button
              type="button"
              onClick={() => {
                setEditingProfile(null);
                setIsFormOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-[#0B1536] hover:bg-[#132252] text-white text-xs font-bold cursor-pointer"
            >
              Thêm hồ sơ mới
            </button>
          </div>
        </div>

        {/* ================================================================= */}
        {/* 2. SƠ ĐỒ QUY TRÌNH 3 BƯỚC RÕ RÀNG (GIỐNG GIAI ĐOẠN RADARPIPELINE)   */}
        {/* ================================================================= */}
        <div className="pt-4 border-t border-slate-200 space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Quy trình hoạt động (3 bước từ hồ sơ thật đến bài SEO trên Radar)
            </span>
            {(stepOneActive || stepTwoActive || stepThreeActive) && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs font-semibold text-[#0B1536] hover:underline cursor-pointer"
              >
                Bỏ lọc bước hiện tại (Xem tất cả)
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* BƯỚC 1 */}
            <div
              className={`rounded-2xl border p-4 flex flex-col justify-between gap-3 transition ${
                stepOneActive
                  ? "border-[#0B1536] bg-slate-50 ring-1 ring-[#0B1536]"
                  : "border-slate-200 bg-slate-50/40"
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                    Bước 1 · Thu thập dữ liệu
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-white border border-slate-200 text-[10px] font-bold text-slate-700">
                    {summaryStats.crmCount} từ CRM
                  </span>
                </div>
                <div className="text-sm font-bold text-slate-900">
                  Đồng bộ CRM hoặc thêm hồ sơ
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Lấy tự động các đơn sự kiện đã chốt hoặc nhập mới ngày tổ chức, số khách và địa điểm.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  resetFilters();
                  setSourceFilter(stepOneActive ? "all" : "crm");
                }}
                className={`w-full py-1.5 px-3 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                  stepOneActive
                    ? "bg-[#0B1536] border-[#0B1536] text-white"
                    : "bg-white border-slate-200 hover:border-slate-300 text-slate-700"
                }`}
              >
                {stepOneActive ? "Đang lọc hồ sơ từ CRM" : "Lọc hồ sơ từ CRM"}
              </button>
            </div>

            {/* BƯỚC 2 */}
            <div
              className={`rounded-2xl border p-4 flex flex-col justify-between gap-3 transition ${
                stepTwoActive
                  ? "border-[#0B1536] bg-slate-50 ring-1 ring-[#0B1536]"
                  : "border-slate-200 bg-slate-50/40"
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                    Bước 2 · Hoàn thiện minh chứng
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-[10px] font-bold text-amber-800">
                    {summaryStats.pendingSeoCount} chờ viết SEO
                  </span>
                </div>
                <div className="text-sm font-bold text-slate-900">
                  Rà ảnh thật, báo giá &amp; từ khóa
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Kiểm tra thiết bị triển khai, bóc tách chi phí và gắn từ khóa mục tiêu để bài viết có số liệu thật.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  resetFilters();
                  setSeoFilter(stepTwoActive ? "all" : "pending");
                }}
                className={`w-full py-1.5 px-3 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                  stepTwoActive
                    ? "bg-[#0B1536] border-[#0B1536] text-white"
                    : "bg-white border-slate-200 hover:border-slate-300 text-slate-700"
                }`}
              >
                {stepTwoActive ? "Đang lọc hồ sơ chờ viết" : "Xem hồ sơ cần viết SEO"}
              </button>
            </div>

            {/* BƯỚC 3 */}
            <div
              className={`rounded-2xl border p-4 flex flex-col justify-between gap-3 transition ${
                stepThreeActive
                  ? "border-[#0B1536] bg-slate-50 ring-1 ring-[#0B1536]"
                  : "border-slate-200 bg-slate-50/40"
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                    Bước 3 · Đẩy sang Radar SEO
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] font-bold text-emerald-800">
                    {summaryStats.generatedCount} đã có bài
                  </span>
                </div>
                <div className="text-sm font-bold text-slate-900">
                  Xuất Case Study hoặc AI viết bài
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Lưu bài vào Kho bài viết Radar để duyệt, hoặc đẩy trực tiếp hồ sơ sang tab Viết bài mới.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  resetFilters();
                  setSeoFilter(stepThreeActive ? "all" : "generated");
                }}
                className={`w-full py-1.5 px-3 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                  stepThreeActive
                    ? "bg-[#0B1536] border-[#0B1536] text-white"
                    : "bg-white border-slate-200 hover:border-slate-300 text-slate-700"
                }`}
              >
                {stepThreeActive ? "Đang lọc hồ sơ đã viết" : "Xem hồ sơ đã tạo bài"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Inline Notification Banner */}
      {notice && (
        <div
          className={`rounded-2xl border px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-semibold ${
            notice.type === "error"
              ? "bg-rose-50 border-rose-200 text-rose-800"
              : notice.type === "info"
                ? "bg-slate-50 border-slate-300 text-slate-800"
                : "bg-emerald-50 border-emerald-200 text-emerald-800"
          }`}
        >
          <span>{notice.text}</span>
          <div className="flex items-center gap-2 shrink-0">
            {notice.actionLabel && notice.actionTab && (
              <button
                type="button"
                onClick={() => goToRadar(notice.actionTab!)}
                className="px-3 py-1 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-900 font-bold cursor-pointer"
              >
                {notice.actionLabel}
              </button>
            )}
            <button
              type="button"
              onClick={() => setNotice(null)}
              className="px-2.5 py-1 rounded-lg bg-white/80 hover:bg-white border border-slate-200 text-slate-700 cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 3. 4 THẺ CHỈ SỐ TỔNG QUAN (KHÔNG ICON, NHẤP ĐỂ XEM CHI TIẾT)       */}
      {/* =================================================================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <button
          type="button"
          onClick={() => setActiveMetricModal("total")}
          className="text-left p-4 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition shadow-2xs cursor-pointer"
        >
          <div className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
            Tổng hồ sơ lưu trữ
          </div>
          <div className="mt-1.5 text-2xl font-black text-slate-900 tabular-nums">
            {summaryStats.total}{" "}
            <span className="text-xs font-semibold text-slate-500">dự án</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Đang hiển thị: {filteredProfiles.length} · Xem chi tiết
          </div>
        </button>

        <button
          type="button"
          onClick={() => setActiveMetricModal("revenue")}
          className="text-left p-4 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition shadow-2xs cursor-pointer"
        >
          <div className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
            Tổng giá trị hợp đồng
          </div>
          <div className="mt-1.5 text-2xl font-black text-slate-900 tabular-nums">
            {Math.round(summaryStats.totalRevenue / 1_000_000).toLocaleString("vi-VN")}{" "}
            <span className="text-xs font-semibold text-slate-500">triệu đ</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Làm số liệu báo giá thật · Xem bảng
          </div>
        </button>

        <button
          type="button"
          onClick={() => setActiveMetricModal("guests")}
          className="text-left p-4 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition shadow-2xs cursor-pointer"
        >
          <div className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
            Quy mô khách đã phục vụ
          </div>
          <div className="mt-1.5 text-2xl font-black text-slate-900 tabular-nums">
            {summaryStats.totalGuests.toLocaleString("vi-VN")}{" "}
            <span className="text-xs font-semibold text-slate-500">khách</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Số liệu xác thực E-E-A-T · Xem bảng
          </div>
        </button>

        <button
          type="button"
          onClick={() => setActiveMetricModal("seo")}
          className="text-left p-4 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition shadow-2xs cursor-pointer"
        >
          <div className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
            Đã chuyển thành bài SEO
          </div>
          <div className="mt-1.5 text-2xl font-black text-emerald-700 tabular-nums">
            {summaryStats.generatedCount}/{summaryStats.total}{" "}
            <span className="text-xs font-semibold text-slate-500">bài viết</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Còn {summaryStats.pendingSeoCount} hồ sơ chưa viết · Xem chi tiết
          </div>
        </button>
      </div>

      {/* =================================================================== */}
      {/* 4. BỘ LỌC TÌM KIẾM & CHUYỂN CHẾ ĐỘ XEM (CHỈ CHỮ, GỌN GÀNG)         */}
      {/* =================================================================== */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              selectedCategory === "all"
                ? "bg-[#0B1536] text-white"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
          >
            Tất cả loại ({profiles.length})
          </button>
          {(Object.entries(CATEGORY_LABELS) as [EventCategory, string][]).map(
            ([key, label]) => {
              const count = profiles.filter((p) => p.category === key).length;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedCategory(key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    selectedCategory === key
                      ? "bg-[#0B1536] text-white"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  }`}
                >
                  {label} ({count})
                </button>
              );
            }
          )}
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 pt-2 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-2 flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm tên sự kiện, khách hàng, địa điểm, từ khóa SEO..."
              className="w-full sm:w-72 px-3.5 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white text-xs outline-none focus:border-[#0B1536]"
            />

            <select
              value={venueFilter}
              onChange={(e) => setVenueFilter(e.target.value as VenueFilter)}
              className="px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-700 outline-none"
            >
              <option value="all">Không gian: Tất cả</option>
              <option value="indoor">Trong nhà</option>
              <option value="outdoor">Ngoài trời</option>
            </select>

            <select
              value={seoFilter}
              onChange={(e) => setSeoFilter(e.target.value as SeoFilter)}
              className="px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-700 outline-none"
            >
              <option value="all">Trạng thái SEO: Tất cả</option>
              <option value="pending">Chưa viết bài SEO</option>
              <option value="generated">Đã tạo bài SEO</option>
            </select>

            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value as SourceFilter)}
              className="px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-700 outline-none"
            >
              <option value="all">Nguồn: Tất cả</option>
              <option value="crm">Đồng bộ CRM</option>
              <option value="manual">Nhập thủ công</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className="px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-700 outline-none"
            >
              <option value="newest">Sắp xếp: Mới nhất</option>
              <option value="budget_desc">Ngân sách cao nhất</option>
              <option value="guests_desc">Khách mời đông nhất</option>
            </select>

            {hasActiveFilter && (
              <button
                type="button"
                onClick={resetFilters}
                className="px-3 py-2 rounded-xl border border-slate-300 bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 cursor-pointer"
              >
                Đặt lại bộ lọc
              </button>
            )}
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 self-start lg:self-auto shrink-0">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                viewMode === "grid"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Dạng thẻ
            </button>
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                viewMode === "table"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Dạng bảng
            </button>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 5. DANH SÁCH HỒ SƠ SỰ KIỆN (DẠNG THẺ HOẶC DẠNG BẢNG - KHÔNG ICON)  */}
      {/* =================================================================== */}
      {filteredProfiles.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center space-y-3">
          <div className="text-sm font-bold text-slate-800">
            Không tìm thấy hồ sơ sự kiện phù hợp bộ lọc
          </div>
          <p className="text-xs text-slate-500">
            Bạn có thể xóa bộ lọc để xem toàn bộ hoặc đồng bộ thêm từ CRM.
          </p>
          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={resetFilters}
              className="px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-800 cursor-pointer"
            >
              Xem tất cả hồ sơ
            </button>
            <button
              type="button"
              onClick={() => {
                setEditingProfile(null);
                setIsFormOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-[#0B1536] hover:bg-[#132252] text-white text-xs font-bold cursor-pointer"
            >
              Thêm hồ sơ mới
            </button>
          </div>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredProfiles.map((profile) => {
            const isSeoDone = Boolean(profile.seoMeta?.isGenerated);
            const venueLabel =
              getEventVenueType(profile) === "indoor" ? "Trong nhà" : "Ngoài trời";
            const isConfirmingDelete = confirmDeleteId === profile.id;

            return (
              <div
                key={profile.id}
                className="group rounded-2xl border border-slate-200 bg-white shadow-2xs hover:border-slate-300 transition flex flex-col overflow-hidden"
              >
                {/* Cover image */}
                <div className="relative border-b border-slate-100">
                  <CardThumbnail src={profile.coverImage} alt={profile.title} />
                  <div className="p-2.5 flex flex-wrap items-center justify-between gap-1.5 bg-slate-50 border-t border-slate-100 text-[11px] font-bold">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-800">
                        {getCategoryLabel(profile.category)}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600">
                        {venueLabel}
                      </span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded border ${
                        isSeoDone
                          ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                          : "bg-amber-50 border-amber-200 text-amber-800"
                      }`}
                    >
                      {isSeoDone ? "Đã có bài SEO" : "Chưa viết SEO"}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 flex-1 flex flex-col justify-between gap-3.5">
                  <div className="space-y-2.5">
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900 line-clamp-2 leading-snug">
                        {profile.title}
                      </h3>
                      <p className="mt-1 text-xs text-slate-600 truncate">
                        Khách hàng: {profile.client.company}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-50 border border-slate-100 p-2.5 text-xs">
                      <div>
                        <div className="text-[10px] font-semibold uppercase text-slate-400">
                          Ngày &amp; Khu vực
                        </div>
                        <div className="font-semibold text-slate-800 truncate">
                          {profile.date} · {profile.location.city}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] font-semibold uppercase text-slate-400">
                          Quy mô &amp; Ngân sách
                        </div>
                        <div className="font-bold text-slate-900 truncate">
                          {profile.guestCount} khách ·{" "}
                          {Math.round(
                            (profile.financials?.totalBudget || 0) / 1_000_000
                          ).toLocaleString("vi-VN")}{" "}
                          tr
                        </div>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-600 bg-slate-50/70 border border-slate-200 rounded-xl px-3 py-1.5 truncate">
                      <span className="font-bold text-slate-700">Từ khóa SEO: </span>
                      {profile.seoMeta?.suggestedKeyword || "Chưa gắn từ khóa"}
                    </div>
                  </div>

                  {/* Function buttons: pure readable labels, zero icons */}
                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenCaseStudy(profile)}
                        className="py-2 px-3 rounded-xl bg-[#0B1536] hover:bg-[#132252] text-white text-xs font-bold cursor-pointer"
                      >
                        {isSeoDone ? "Xem lại bài SEO" : "Tạo bài SEO"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUseInRadarWriter(profile)}
                        className="py-2 px-3 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-950 text-xs font-bold cursor-pointer"
                      >
                        Đẩy sang Viết bài
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-1.5 text-xs">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setDetailProfile(profile)}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 font-semibold text-slate-700 cursor-pointer"
                        >
                          Chi tiết
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingProfile(profile);
                            setIsFormOpen(true);
                          }}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 font-semibold text-slate-700 cursor-pointer"
                        >
                          Sửa
                        </button>
                      </div>

                      {isConfirmingDelete ? (
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleConfirmDelete(profile.id)}
                            className="px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer"
                          >
                            Xác nhận xóa
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(null)}
                            className="px-2 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 font-semibold cursor-pointer"
                          >
                            Hủy
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(profile.id)}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 font-semibold text-slate-500 cursor-pointer"
                        >
                          Xóa
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-2xs overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                <th className="py-3 px-4 font-bold">Sự kiện &amp; Khách hàng</th>
                <th className="py-3 px-3 font-bold">Phân loại &amp; Thời gian</th>
                <th className="py-3 px-3 font-bold">Quy mô &amp; Ngân sách</th>
                <th className="py-3 px-3 font-bold">Trạng thái Radar SEO</th>
                <th className="py-3 px-4 font-bold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProfiles.map((profile) => {
                const isSeoDone = Boolean(profile.seoMeta?.isGenerated);
                const isConfirmingDelete = confirmDeleteId === profile.id;
                return (
                  <tr key={profile.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{profile.title}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {profile.client.company} · {profile.location.venue} ({profile.location.city})
                      </div>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="font-semibold text-slate-800">
                        {getCategoryLabel(profile.category)}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {profile.date} ·{" "}
                        {getEventVenueType(profile) === "indoor"
                          ? "Trong nhà"
                          : "Ngoài trời"}
                      </div>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="font-bold text-slate-900">
                        {formatVND(profile.financials.totalBudget)}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {profile.guestCount} khách
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-bold border ${
                          isSeoDone
                            ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                            : "bg-amber-50 border-amber-200 text-amber-800"
                        }`}
                      >
                        {isSeoDone ? "Đã có bài SEO" : "Chờ viết bài SEO"}
                      </span>
                      <div className="text-[11px] text-slate-500 mt-0.5 truncate max-w-[200px]">
                        {profile.seoMeta?.suggestedKeyword || "Chưa có từ khóa"}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex flex-wrap items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenCaseStudy(profile)}
                          className="px-2.5 py-1.5 rounded-lg bg-[#0B1536] hover:bg-[#132252] text-white font-bold cursor-pointer"
                        >
                          {isSeoDone ? "Xem bài SEO" : "Tạo bài SEO"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUseInRadarWriter(profile)}
                          className="px-2.5 py-1.5 rounded-lg border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-950 font-bold cursor-pointer"
                        >
                          Viết bài Radar
                        </button>
                        <button
                          type="button"
                          onClick={() => setDetailProfile(profile)}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold cursor-pointer"
                        >
                          Chi tiết
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingProfile(profile);
                            setIsFormOpen(true);
                          }}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold cursor-pointer"
                        >
                          Sửa
                        </button>
                        {isConfirmingDelete ? (
                          <>
                            <button
                              type="button"
                              onClick={() => handleConfirmDelete(profile.id)}
                              className="px-2.5 py-1.5 rounded-lg bg-rose-600 text-white font-bold cursor-pointer"
                            >
                              Xác nhận
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(null)}
                              className="px-2 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 font-semibold cursor-pointer"
                            >
                              Hủy
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(profile.id)}
                            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-rose-50 hover:text-rose-700 text-slate-500 font-semibold cursor-pointer"
                          >
                            Xóa
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* =================================================================== */}
      {/* 6. CÁC MODAL CHI TIẾT / FORM / CASE STUDY / THỐNG KÊ               */}
      {/* =================================================================== */}
      {detailProfile && (
        <EventProfileDetailModal
          profile={detailProfile}
          onClose={() => setDetailProfile(null)}
          onEdit={(p) => {
            setDetailProfile(null);
            setEditingProfile(p);
            setIsFormOpen(true);
          }}
          onGenerateCaseStudy={handleOpenCaseStudy}
          onUseInRadarWriter={handleUseInRadarWriter}
          onOpenPostsArchive={(p) => {
            setDetailProfile(null);
            goToRadar("duyet_bai", { postSlug: p.seoMeta?.generatedPostSlug });
          }}
        />
      )}

      {caseStudyTarget && caseStudyDraft && (
        <CaseStudyPreviewModal
          profile={caseStudyTarget}
          draft={caseStudyDraft}
          isSaving={isSavingPost}
          savedMessage={savePostSuccess}
          errorMessage={savePostError}
          onClose={() => {
            setCaseStudyTarget(null);
            setCaseStudyDraft(null);
          }}
          onSaveToCms={(publishNow) => void handleSaveCaseStudyToCms(publishNow)}
          onOpenInRadarEditor={handleOpenGeneratedDraftInEditor}
        />
      )}

      {isFormOpen && (
        <EventProfileFormModal
          editingProfile={editingProfile}
          onClose={() => {
            setIsFormOpen(false);
            setEditingProfile(null);
          }}
          onSave={handleSaveProfileForm}
        />
      )}

      <MetricBreakdownModal
        metricType={activeMetricModal}
        profiles={profiles}
        onClose={() => setActiveMetricModal(null)}
        onFilterPendingSeo={() => {
          resetFilters();
          setSeoFilter("pending");
        }}
      />
    </div>
  );
}
