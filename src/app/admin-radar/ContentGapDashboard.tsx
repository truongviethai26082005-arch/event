"use client";

import React, { useState, useMemo } from "react";
import RadarCronManager from "./RadarCronManager";
import {
  ContentGapItem,
  getStoredContentGaps,
  saveStoredContentGaps,
  DEFAULT_CONTENT_GAPS,
  deduplicateContentGaps,
} from "./competitors-data";
import { Search } from "lucide-react";

interface ContentGapDashboardProps {
  onGenerateDraftFromGap?: (gap: ContentGapItem) => void;
  onRefreshData?: () => void;
  onNavigateSection?: (section: any) => void;
}

export default function ContentGapDashboard({
  onGenerateDraftFromGap,
  onRefreshData,
  onNavigateSection,
}: ContentGapDashboardProps) {
  const [gaps, setGaps] = useState<ContentGapItem[]>(() => getStoredContentGaps());
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  // MẶC ĐỊNH LỌC NGAY BÀI CHƯA CÓ TRÊN WEB ĐỂ NGƯỜI DÙNG THẤY RÕ VIỆC CẦN LÀM
  const [statusFilter, setStatusFilter] = useState<string>("missing");
  const [searchQuery, setSearchQuery] = useState("");

  const missingGaps = useMemo(() => gaps.filter((g) => g.ourSiteStatus === "missing"), [gaps]);
  const inPlanGaps = useMemo(() => gaps.filter((g) => g.ourSiteStatus === "in_plan"), [gaps]);
  const draftedGaps = useMemo(() => gaps.filter((g) => g.ourSiteStatus === "drafted"), [gaps]);

  const missingCount = missingGaps.length;
  const inPlanCount = inPlanGaps.length;
  const draftedCount = draftedGaps.length;

  // Gom cụm chủ đề động từ danh sách gaps
  const clusterCounts = useMemo(() => {
    const countsMap = new Map<string, number>();
    gaps.forEach((g) => {
      const cat = g.clusterCategory || "Chung";
      countsMap.set(cat, (countsMap.get(cat) || 0) + 1);
    });
    return Array.from(countsMap.entries()).map(([name, count]) => ({
      name,
      count,
    }));
  }, [gaps]);

  const handleUpdateStatus = (id: string, newStatus: ContentGapItem["ourSiteStatus"]) => {
    const updated = gaps.map((g) => (g.id === id ? { ...g, ourSiteStatus: newStatus } : g));
    setGaps(updated);
    saveStoredContentGaps(updated);
    if (onRefreshData) onRefreshData();
  };

  const handleCreateDraft = (gap: ContentGapItem) => {
    handleUpdateStatus(gap.id, "drafted");
    if (onGenerateDraftFromGap) {
      onGenerateDraftFromGap(gap);
    }
  };

  const handleReloadData = () => {
    setGaps(getStoredContentGaps());
    if (onRefreshData) onRefreshData();
  };

  // Khôi phục danh sách mẫu chuẩn (dọn sạch trùng lặp)
  const handleResetToDefault = () => {
    const isConfirm = window.confirm(
      "Bạn có muốn làm mới danh sách đề tài về trạng thái mẫu chuẩn không? Toàn bộ các đề tài trùng lặp sẽ được dọn sạch."
    );
    if (!isConfirm) return;
    saveStoredContentGaps(DEFAULT_CONTENT_GAPS);
    setGaps(DEFAULT_CONTENT_GAPS);
    setStatusFilter("missing");
    if (onRefreshData) onRefreshData();
  };

  // ĐỀ XUẤT ƯU TIÊN SỐ 1 CHO "HÔM NAY LÀM GÌ" (CHỈ LẤY BÀI THỰC SỰ THIẾU TRÊN WEB)
  const topRecommendedGap = useMemo(() => {
    return (
      missingGaps.find((g) => g.priority === "high") ||
      missingGaps[0] ||
      null
    );
  }, [missingGaps]);

  // Bộ lọc danh sách
  const filteredGaps = useMemo(() => {
    return gaps.filter((gap) => {
      const matchesSearch =
        gap.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gap.targetKeyword.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gap.competitorSource.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        categoryFilter === "all" || gap.clusterCategory === categoryFilter;

      const matchesStatus =
        statusFilter === "all" || gap.ourSiteStatus === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [gaps, searchQuery, categoryFilter, statusFilter]);

  return (
    <div className="space-y-6">
      {/* 1. KHỐI CA QUÉT ĐÊM & BỘ NÚT ĐIỀU KHIỂN */}
      <RadarCronManager
        onRefreshData={handleReloadData}
        onRunLiveCrawl={handleReloadData}
        onNavigateSection={onNavigateSection}
        missingCount={missingCount}
        inPlanCount={inPlanCount}
        draftedCount={draftedCount}
        onSelectCluster={(c) => setCategoryFilter(c)}
        onSelectStatus={(s) => setStatusFilter(s)}
      />

      {/* 2. TIÊU ĐIỂM HÀNH ĐỘNG DUY NHẤT: "HÔM NAY LÀM GÌ?" (HERO ACTION CARD) */}
      {topRecommendedGap ? (
        <div
          id="hero-action-card"
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0A1E5E] via-[#0D256C] to-[#0A1E5E] border-2 border-amber-400/50 p-6 sm:p-7 text-white shadow-xl space-y-4"
        >
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Pill Header */}
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-400 text-slate-950 shadow-sm">
                ƯU TIÊN LÀM NGAY
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-400/30">
                Web đang thiếu bài viết này
              </span>
            </div>

            <span className="text-xs text-slate-300">
              Cụm chủ đề: <strong className="text-white">{topRecommendedGap.clusterCategory}</strong>
            </span>
          </div>

          {/* Hero Content Grid */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pt-1">
            <div className="space-y-2.5 max-w-3xl">
              <h3 className="text-lg sm:text-2xl font-black text-white leading-snug">
                {topRecommendedGap.suggestedTitle}
              </h3>

              <div className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-white/10 border border-white/15 p-3 rounded-2xl">
                <span className="text-amber-300 font-bold">Lý do: </span>
                Đối thủ <b className="text-white">{topRecommendedGap.competitorSource}</b> đang giữ Top tìm kiếm nhưng website Trường Hải chưa có bài viết. Bạn nên tạo bài này ngay để đón khách hàng đang tìm kiếm.
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-300 pt-1">
                <span>
                  Từ khóa mục tiêu:{" "}
                  <code className="px-2 py-0.5 rounded bg-black/40 border border-white/15 text-amber-300 font-mono font-bold">
                    {topRecommendedGap.targetKeyword}
                  </code>
                </span>
                <span>•</span>
                <span>
                  Lượng tìm kiếm:{" "}
                  <strong className="text-white font-bold">
                    {topRecommendedGap.estimatedSearchVolume || "1,500 - 3,000/tháng"}
                  </strong>
                </span>
                <span>•</span>
                <span>
                  Đối thủ dẫn đầu:{" "}
                  <strong className="text-amber-200">{topRecommendedGap.competitorSource}</strong>
                </span>
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-stretch lg:items-end justify-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => handleCreateDraft(topRecommendedGap)}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:brightness-110 text-slate-950 text-xs sm:text-sm font-black shadow-lg shadow-amber-500/20 transition-all cursor-pointer text-center"
              >
                Viết bài này bằng AI
              </button>

              {topRecommendedGap.competitorUrl && (
                <div className="flex items-center justify-center sm:justify-end gap-3 text-xs text-slate-300 pt-1">
                  <a
                    href={topRecommendedGap.competitorUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-amber-300 underline underline-offset-2 transition-colors"
                  >
                    Xem bài đối thủ
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Khi toàn bộ các bài thiếu đã được xử lý */
        <div
          id="hero-action-card"
          className="rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 border-2 border-emerald-400/40 p-6 sm:p-7 text-white shadow-lg space-y-3"
        >
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-400 text-slate-950 shadow-sm">
              MỤC TIÊU ĐÃ HOÀN TẤT
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-white">
            Đã xử lý toàn bộ các bài viết thiếu trong kho
          </h3>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl leading-relaxed">
            Tất cả khoảng trống nội dung đã phát hiện hiện đều đã có bản nháp hoặc đã được đưa vào kế hoạch.
            Bạn có thể sang <b>Kho bài viết</b> để kiểm tra hoặc bấm <b>Quét thật ngay</b> ở trên để tìm thêm đề tài mới.
          </p>
        </div>
      )}

      {/* 3. BẢNG DANH MỤC CÁC KHOẢNG TRỐNG NỘI DUNG */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 space-y-5 shadow-xs">
        {/* Header & Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base font-black text-slate-900">
                Danh sách từ khóa đối thủ có mà web chưa có
              </h4>
              <button
                type="button"
                onClick={() => setStatusFilter("missing")}
                className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300 hover:bg-rose-200 transition cursor-pointer"
              >
                {missingCount} bài cần viết
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Chọn nhóm để xem danh sách bài viết theo từng trạng thái thực hiện
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetToDefault}
              className="text-xs text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 transition cursor-pointer font-medium"
            >
              Khôi phục danh sách mẫu
            </button>
          </div>
        </div>

        {/* BỘ LỌC TRẠNG THÁI */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => setStatusFilter("missing")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${statusFilter === "missing"
                ? "bg-rose-600 text-white shadow-sm font-black"
                : "text-slate-700 hover:bg-slate-200"
              }`}
          >
            Chưa có trên web ({missingCount})
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter("in_plan")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${statusFilter === "in_plan"
                ? "bg-amber-600 text-white shadow-sm font-black"
                : "text-slate-700 hover:bg-slate-200"
              }`}
          >
            Đang lên kế hoạch ({inPlanCount})
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter("drafted")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${statusFilter === "drafted"
                ? "bg-emerald-600 text-white shadow-sm font-black"
                : "text-slate-700 hover:bg-slate-200"
              }`}
          >
            Đã có bản nháp ({draftedCount})
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${statusFilter === "all"
                ? "bg-slate-800 text-white shadow-sm font-bold"
                : "text-slate-600 hover:text-slate-900"
              }`}
          >
            Tất cả ({gaps.length})
          </button>
        </div>

        {/* Thông báo ngữ cảnh */}
        {statusFilter === "missing" && (
          <div className="px-3.5 py-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs">
            <span>
              Đang hiển thị <b>{filteredGaps.length} từ khóa đối thủ đang lên Top mà web chưa có bài</b>. Bấm <b>"Viết bài bằng AI"</b> để tự động tạo bài viết ngay.
            </span>
          </div>
        )}

        {/* Thanh Tabs Lọc Theo Cụm Chủ Đề */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-100 text-xs">
          <button
            type="button"
            onClick={() => setCategoryFilter("all")}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${categoryFilter === "all"
                ? "bg-[#0A1E5E] text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
          >
            <span>Tất cả cụm</span>
            <span className="px-1.5 py-0.2 text-[10px] bg-white/20 rounded-full font-mono">
              {gaps.length}
            </span>
          </button>

          {clusterCounts.map((c) => {
            const isSelected = categoryFilter === c.name;
            return (
              <button
                key={c.name}
                type="button"
                onClick={() => setCategoryFilter(c.name)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${isSelected
                    ? "bg-[#0A1E5E] text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
              >
                <span>{c.name}</span>
                <span
                  className={`px-1.5 py-0.2 text-[10px] rounded-full font-mono font-bold ${isSelected ? "bg-amber-400 text-slate-950" : "bg-white text-slate-700"
                    }`}
                >
                  {c.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Thanh Tìm kiếm */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Tìm theo từ khóa, đề tài, đối thủ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <span className="text-xs text-slate-500 font-medium hidden sm:inline">
            Hiển thị <b>{filteredGaps.length}</b> kết quả
          </span>
        </div>

        {/* Danh Sách Card Khoảng Trống */}
        <div className="space-y-3 pt-2">
          {filteredGaps.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
              <p className="font-bold text-slate-700">
                {statusFilter === "missing"
                  ? "Tuyệt vời! Không còn bài viết nào chưa có trên web trong nhóm này."
                  : "Không có đề tài nào phù hợp với bộ lọc hiện tại."}
              </p>
              {statusFilter === "missing" && (
                <button
                  type="button"
                  onClick={() => setStatusFilter("all")}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-900 transition cursor-pointer"
                >
                  Xem tất cả các đề tài khác
                </button>
              )}
            </div>
          ) : (
            filteredGaps.map((gap) => (
              <div
                key={gap.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${gap.ourSiteStatus === "missing"
                    ? "bg-white border-rose-200 hover:border-amber-400 shadow-2xs hover:shadow-xs"
                    : gap.ourSiteStatus === "in_plan"
                      ? "bg-amber-50/40 border-amber-200 hover:border-amber-400"
                      : "bg-slate-50/80 border-slate-200 opacity-85"
                  }`}
              >
                {/* Left: Info */}
                <div className="space-y-2 max-w-3xl">
                  {/* Status & Category Badges */}
                  <div className="flex flex-wrap items-center gap-2 text-[11px]">
                    {gap.ourSiteStatus === "missing" ? (
                      <span className="px-2.5 py-1 rounded-lg bg-rose-100 text-rose-900 font-bold border border-rose-200">
                        Chưa có trên web
                      </span>
                    ) : gap.ourSiteStatus === "in_plan" ? (
                      <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 font-bold border border-amber-200">
                        Đang lên kế hoạch
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
                        Đã có bản nháp
                      </span>
                    )}

                    <span className="px-2 py-0.5 rounded-md font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                      {gap.clusterCategory}
                    </span>

                    {gap.estimatedSearchVolume && (
                      <span className="text-slate-600 font-medium bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                        {gap.estimatedSearchVolume}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h5 className="text-base font-bold text-slate-900 leading-snug">
                    {gap.suggestedTitle}
                  </h5>

                  {/* Lý do */}
                  <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 leading-relaxed">
                    <span className="font-bold text-slate-800">Lý do: </span>
                    {gap.gapReason && !gap.gapReason.includes("Phát hiện từ ca quét tự động:")
                      ? gap.gapReason
                      : `Đối thủ ${gap.competitorSource} đang có bài viết thứ hạng cao trên Google. Website Trường Hải Event cần bài viết này để tiếp cận khách hàng đang tìm kiếm.`}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 text-xs text-slate-600 pt-0.5">
                    <span>
                      Từ khóa:{" "}
                      <code className="text-amber-900 font-semibold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                        {gap.targetKeyword}
                      </code>
                    </span>
                    <span>•</span>
                    <span>
                      Đối thủ dẫn đầu: <strong className="text-slate-800">{gap.competitorSource}</strong>
                    </span>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0 self-end md:self-auto">
                  {gap.ourSiteStatus === "missing" ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(gap.id, "in_plan")}
                        className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Lên kế hoạch
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCreateDraft(gap)}
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-105 text-slate-950 text-xs font-black shadow-xs cursor-pointer transition-all"
                      >
                        Viết bài bằng AI
                      </button>
                    </>
                  ) : gap.ourSiteStatus === "in_plan" ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(gap.id, "missing")}
                        className="px-2.5 py-1.5 text-xs text-slate-500 hover:text-slate-800 hover:underline cursor-pointer"
                      >
                        Hủy kế hoạch
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCreateDraft(gap)}
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-105 text-slate-950 text-xs font-black shadow-xs cursor-pointer transition-all"
                      >
                        Viết bài bằng AI
                      </button>
                    </>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (onNavigateSection) {
                            onNavigateSection("duyet_bai");
                          }
                        }}
                        className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold transition-colors cursor-pointer"
                      >
                        Xem trong Kho bài viết
                      </button>

                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(gap.id, "missing")}
                        className="px-2 py-1.5 text-[11px] text-slate-400 hover:text-slate-700 hover:underline cursor-pointer"
                      >
                        Viết lại
                      </button>
                    </div>
                  )}

                  {gap.competitorUrl && (
                    <a
                      href={gap.competitorUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-2 text-xs text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors self-center whitespace-nowrap"
                    >
                      Xem bài đối thủ
                    </a>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
