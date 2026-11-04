"use client";

import React, { useState } from "react";
import {
  ContentGapItem,
  getStoredContentGaps,
  saveStoredContentGaps,
} from "./competitors-data";
import {
  Compass,
  Sparkles,
  TrendingUp,
  FileText,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Filter,
  Layers,
  Search,
  PlusCircle,
  Clock,
  Target,
  FileCheck,
} from "lucide-react";

interface ContentGapDashboardProps {
  onGenerateDraftFromGap?: (gap: ContentGapItem) => void;
  onRefreshData?: () => void;
}

export default function ContentGapDashboard({
  onGenerateDraftFromGap,
  onRefreshData,
}: ContentGapDashboardProps) {
  const [gaps, setGaps] = useState<ContentGapItem[]>(() => getStoredContentGaps());
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGapForDetails, setSelectedGapForDetails] = useState<ContentGapItem | null>(null);

  // Gom nhóm chủ đề (Topic Clustering)
  const clusters = [
    {
      name: "Khai trương & Khánh thành",
      count: gaps.filter((g) => g.clusterCategory === "Khai trương & Khánh thành").length,
      trend: "Tăng trưởng +40%",
      trendColor: "text-emerald-400",
      description: "Đối thủ đẩy mạnh các bài kịch bản showroom xe, khai trương nhà máy FDI.",
    },
    {
      name: "Âm thanh & Thiết bị",
      count: gaps.filter((g) => g.clusterCategory === "Âm thanh & Thiết bị").length,
      trend: "Cao điểm mùa Q4",
      trendColor: "text-[#D4AF37]",
      description: "Nhu cầu báo giá bóc tách loa Array, màn hình LED tiệc tất niên doanh nghiệp.",
    },
    {
      name: "Teambuilding & Outing",
      count: gaps.filter((g) => g.clusterCategory === "Teambuilding & Outing").length,
      trend: "Ổn định",
      trendColor: "text-blue-400",
      description: "Xu hướng tìm kiếm các trò chơi bãi biển nhẹ nhàng, không cần đạo cụ lớn.",
    },
    {
      name: "Hội nghị & Gala",
      count: gaps.filter((g) => g.clusterCategory === "Hội nghị & Gala").length,
      trend: "Nổi bật gần đây",
      trendColor: "text-purple-400",
      description: "Các chủ đề hội thảo chuyển đổi số, ứng dụng AI và đại hội cổ đông.",
    },
  ];

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

  const filteredGaps = gaps.filter((gap) => {
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

  const missingCount = gaps.filter((g) => g.ourSiteStatus === "missing").length;
  const inPlanCount = gaps.filter((g) => g.ourSiteStatus === "in_plan").length;
  const draftedCount = gaps.filter((g) => g.ourSiteStatus === "drafted").length;

  return (
    <div className="space-y-6">
      {/* HEADER VÀ PHÂN TÍCH XU HƯỚNG RA BÀI (TOPIC CLUSTERING) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <Compass className="w-5 h-5 text-amber-600" />
              <h3 className="text-base font-black text-slate-900">
                Bản Đồ Khoảng Trống SEO (Content Gap) & Hướng Nội Dung
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Tự động đối chiếu kho chữ quét được từ đối thủ với các bài viết hiện tại trên Trường Hải Event để chỉ ra các chủ đề bạn đang bị bỏ lại phía sau.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold shadow-2xs">
              {missingCount} Chủ đề bị hổng
            </span>
            <span className="px-3 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold shadow-2xs">
              {inPlanCount} Đang lên kế hoạch
            </span>
          </div>
        </div>

        {/* 4 THẺ GOM NHÓM XU HƯỚNG RA BÀI CỦA ĐỐI THỦ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {clusters.map((cluster, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-amber-300 transition-all space-y-2 shadow-2xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">{cluster.name}</span>
                <span className={`text-[10px] font-bold ${cluster.trendColor}`}>
                  {cluster.trend}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                {cluster.description}
              </p>
              <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500 font-semibold border-t border-slate-200">
                <span>Khoảng trống tìm thấy:</span>
                <span className="text-amber-700 font-black">{cluster.count} bài</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* THANH BỘ LỌC VÀ TÌM KIẾM KHOẢNG TRỐNG */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-2">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo chủ đề, từ khóa hoặc đối thủ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:ring-2 focus:ring-[#D4AF37]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          {/* Lọc theo cụm chủ đề */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-[#D4AF37]"
          >
            <option value="all">Tất cả cụm chủ đề</option>
            <option value="Khai trương & Khánh thành">Khai trương & Khánh thành</option>
            <option value="Teambuilding & Outing">Teambuilding & Outing</option>
            <option value="Hội nghị & Gala">Hội nghị & Gala</option>
            <option value="Âm thanh & Thiết bị">Âm thanh & Thiết bị</option>
          </select>

          {/* Lọc theo trạng thái */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-[#D4AF37]"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="missing">Web ta chưa có (Hổng)</option>
            <option value="in_plan">Đã đưa vào kế hoạch</option>
            <option value="drafted">Đã tạo bài nháp</option>
          </select>
        </div>
      </div>

      {/* DANH SÁCH CHI TIẾT CÁC KHOẢNG TRỐNG NỘI DUNG */}
      <div className="space-y-3">
        {filteredGaps.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center text-slate-500 text-xs">
            Không tìm thấy khoảng trống nội dung nào phù hợp với bộ lọc hiện tại.
          </div>
        ) : (
          filteredGaps.map((gap) => (
            <div
              key={gap.id}
              className={`p-5 rounded-2xl border transition-all ${
                gap.ourSiteStatus === "missing"
                  ? "bg-rose-50/50 border-rose-200 hover:border-rose-300 shadow-2xs"
                  : gap.ourSiteStatus === "in_plan"
                  ? "bg-amber-50/50 border-amber-200 hover:border-amber-300 shadow-2xs"
                  : "bg-emerald-50/50 border-emerald-200 hover:border-emerald-300 shadow-2xs"
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="space-y-2 max-w-3xl">
                  {/* Badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        gap.priority === "high"
                          ? "bg-rose-100 text-rose-800 border border-rose-200"
                          : "bg-amber-100 text-amber-800 border border-amber-200"
                      }`}
                    >
                      Ưu tiên {gap.priority === "high" ? "Cao" : "Trung bình"}
                    </span>

                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                      {gap.clusterCategory}
                    </span>

                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                      Intent: {gap.searchIntent.toUpperCase()}
                    </span>

                    {gap.estimatedSearchVolume && (
                      <span className="text-[11px] text-slate-500 flex items-center space-x-1">
                        <Target className="w-3 h-3 text-amber-600" />
                        <span>{gap.estimatedSearchVolume}</span>
                      </span>
                    )}
                  </div>

                  {/* Title & Topic */}
                  <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                    {gap.suggestedTitle}
                  </h4>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                    <span className="text-amber-800 font-semibold">
                      Từ khóa mục tiêu:{" "}
                      <code className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-amber-900 shadow-2xs">
                        {gap.targetKeyword}
                      </code>
                    </span>
                    <span className="text-slate-500">
                      Đối thủ đang dẫn đầu:{" "}
                      <strong className="text-slate-900">{gap.competitorSource}</strong>
                    </span>
                  </div>

                  {/* Lý do tại sao bị hổng */}
                  <p className="text-xs text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200 leading-relaxed shadow-2xs">
                    <strong className="text-amber-800">Đánh giá khoảng trống (AI): </strong>
                    {gap.gapReason}
                  </p>
                </div>

                {/* THAO TÁC HÀNH ĐỘNG: LẬP KẾ HOẠCH & CHUYỂN BÀI NHÁP */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end justify-between gap-2.5 shrink-0 pt-2 lg:pt-0">
                  <div className="text-right">
                    {gap.ourSiteStatus === "missing" ? (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        <AlertTriangle className="w-3 h-3 text-rose-600" />
                        <span>Chưa có bài trên web</span>
                      </span>
                    ) : gap.ourSiteStatus === "in_plan" ? (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        <Clock className="w-3 h-3 text-amber-600" />
                        <span>Đã lên kế hoạch</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <FileCheck className="w-3 h-3 text-emerald-600" />
                        <span>Đã tạo bài nháp</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    {gap.ourSiteStatus === "missing" && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(gap.id, "in_plan")}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition-all cursor-pointer shadow-2xs"
                      >
                        Đưa vào Kế hoạch
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleCreateDraft(gap)}
                      className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-amber-500 text-[#0A1E5E] text-xs font-black hover:brightness-105 shadow-sm flex items-center space-x-1.5 transition-all cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Viết bài nháp ngay</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <a
                    href={gap.competitorUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-slate-500 hover:text-amber-800 flex items-center space-x-1 self-end"
                  >
                    <span>Xem bài gốc đối thủ</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

