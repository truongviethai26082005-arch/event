"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Globe,
  Zap,
  Star,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Search,
  Building2,
  Check,
  X,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import {
  CompetitorPreset,
  CompetitorCategory,
  CATEGORY_TABS,
  DEFAULT_COMPETITOR_PRESETS,
  getSavedCustomCompetitors,
  saveCustomCompetitor,
  removeCustomCompetitor,
} from "./competitor-presets";

interface CompetitorPresetDirectoryProps {
  currentDomain: string;
  onSelectCompetitor: (competitor: CompetitorPreset, autoScan?: boolean) => void;
  isScanning: boolean;
}

export default function CompetitorPresetDirectory({
  currentDomain,
  onSelectCompetitor,
  isScanning,
}: CompetitorPresetDirectoryProps) {
  const [activeTab, setActiveTab] = useState<CompetitorCategory>("all");
  const [customList, setCustomList] = useState<CompetitorPreset[]>([]);
  const [isExpanded, setIsExpanded] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // New competitor form state
  const [newName, setNewName] = useState("");
  const [newDomain, setNewDomain] = useState("");
  const [newCategory, setNewCategory] = useState<"tron-goi" | "teambuilding" | "thiet-bi">("tron-goi");
  const [newBadge, setNewBadge] = useState("");
  const [newPrompt, setNewPrompt] = useState("");

  // Load custom competitors from localStorage on mount
  useEffect(() => {
    setCustomList(getSavedCustomCompetitors());
  }, []);

  // Merge default + custom presets
  const allCompetitors = useMemo(() => {
    return [...customList, ...DEFAULT_COMPETITOR_PRESETS];
  }, [customList]);

  // Filter by category and search query
  const filteredList = useMemo(() => {
    let list = allCompetitors;

    if (activeTab === "saved") {
      list = list.filter((c) => c.isCustom);
    } else if (activeTab !== "all") {
      list = list.filter((c) => c.category === activeTab);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.domain.toLowerCase().includes(q) ||
          c.badge.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q)
      );
    }

    return list;
  }, [allCompetitors, activeTab, searchQuery]);

  // Tab counts
  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: allCompetitors.length,
      "tron-goi": allCompetitors.filter((c) => c.category === "tron-goi").length,
      teambuilding: allCompetitors.filter((c) => c.category === "teambuilding").length,
      "thiet-bi": allCompetitors.filter((c) => c.category === "thiet-bi").length,
      saved: customList.length,
    };
    return counts;
  }, [allCompetitors, customList]);

  // Handle Add custom competitor
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomain.trim()) return;

    const saved = saveCustomCompetitor({
      name: newName,
      domain: newDomain,
      category: newCategory,
      badge: newBadge,
      suggestedPrompt: newPrompt,
    });

    setCustomList((prev) => [saved, ...prev.filter((c) => c.domain !== saved.domain)]);
    setShowAddModal(false);
    setNewName("");
    setNewDomain("");
    setNewBadge("");
    setNewPrompt("");
    setActiveTab("saved");
  };

  // Handle remove custom competitor
  const handleDeleteCustom = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm("Bạn có chắc muốn xóa đối thủ này khỏi danh bạ lưu riêng?")) {
      removeCustomCompetitor(id);
      setCustomList((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const isCurrent = (domain: string) => {
    if (!currentDomain) return false;
    const cleanCurrent = currentDomain.replace(/^https?:\/\//, "").replace(/\/$/, "").toLowerCase();
    const cleanTarget = domain.replace(/^https?:\/\//, "").replace(/\/$/, "").toLowerCase();
    return cleanCurrent === cleanTarget;
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-[#0A1E5E]/60 to-[#07133B]/80 overflow-hidden shadow-xl">
      {/* HEADER SECTION */}
      <div className="p-4 sm:p-5 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#D4AF37] to-amber-600 flex items-center justify-center text-[#0A1E5E] shadow-lg shadow-[#D4AF37]/20 font-black">
            <Building2 className="w-5 h-5 text-[#0A1E5E]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-bold text-white tracking-wide">
                Danh bạ đối thủ mẫu & Nạp sẵn mục tiêu
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30">
                {allCompetitors.length} đối thủ
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Chọn nhanh đơn vị sự kiện hàng đầu để tự động dò sitemap & cào bài viết tức thì
            </p>
          </div>
        </div>

        {/* TOP ACTIONS */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-3 py-1.5 rounded-xl bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 text-[#D4AF37] border border-[#D4AF37]/30 text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm đối thủ mới</span>
          </button>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs transition cursor-pointer flex items-center space-x-1"
            title={isExpanded ? "Thu gọn danh bạ" : "Mở rộng danh bạ"}
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-4 h-4" />
                <span className="hidden sm:inline text-[11px]">Thu gọn</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                <span className="hidden sm:inline text-[11px]">Mở danh bạ</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* EXPANDED CONTENT */}
      {isExpanded && (
        <div className="p-4 sm:p-5 space-y-4">
          {/* TABS & SEARCH BAR */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            {/* Category Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5">
              {CATEGORY_TABS.map((tab) => {
                const count = tabCounts[tab.id] || 0;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer ${
                      isActive
                        ? "bg-[#D4AF37] text-[#0A1E5E] font-bold shadow-md shadow-[#D4AF37]/30"
                        : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/5"
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        isActive
                          ? "bg-[#0A1E5E]/20 text-[#0A1E5E] font-bold"
                          : "bg-white/10 text-slate-400"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Quick Search in directory */}
            <div className="relative w-full lg:w-60">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Tìm tên hoặc domain..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:ring-1 focus:ring-[#D4AF37] transition"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* GRID OF COMPETITORS */}
          {filteredList.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400 bg-white/[0.02] rounded-xl border border-dashed border-white/10">
              {activeTab === "saved" ? (
                <div className="space-y-2">
                  <Star className="w-6 h-6 mx-auto text-slate-500" />
                  <p>Bạn chưa lưu đối thủ nào vào danh bạ riêng.</p>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(true)}
                    className="text-[#D4AF37] hover:underline font-semibold"
                  >
                    + Thêm đối thủ mục tiêu đầu tiên ngay
                  </button>
                </div>
              ) : (
                <p>Không tìm thấy đối thủ nào phù hợp với từ khóa &quot;{searchQuery}&quot;.</p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {filteredList.map((item) => {
                const active = isCurrent(item.domain);
                const cleanHost = item.domain.replace(/^https?:\/\//, "").replace(/\/$/, "");

                return (
                  <div
                    key={item.id}
                    onClick={() => onSelectCompetitor(item, false)}
                    className={`group relative p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-2.5 ${
                      active
                        ? "bg-[#D4AF37]/15 border-[#D4AF37] shadow-lg shadow-[#D4AF37]/15 ring-1 ring-[#D4AF37]"
                        : "bg-white/[0.04] hover:bg-white/[0.08] border-white/10 hover:border-white/20"
                    }`}
                  >
                    {/* Top Row: Name & Badge */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-1.5">
                          <h4 className="text-xs font-bold text-white truncate group-hover:text-[#D4AF37] transition">
                            {item.name}
                          </h4>
                          {item.isCustom && (
                            <span className="shrink-0 px-1.5 py-0.2 rounded text-[9px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                              Riêng
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-1 text-[11px] text-slate-400 truncate mt-0.5">
                          <Globe className="w-3 h-3 shrink-0 text-slate-500" />
                          <span className="truncate">{cleanHost}</span>
                        </div>
                      </div>

                      {/* Right top actions */}
                      <div className="flex items-center space-x-1 shrink-0">
                        {item.isCustom && (
                          <button
                            type="button"
                            onClick={(e) => handleDeleteCustom(e, item.id)}
                            className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                            title="Xóa đối thủ này"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <a
                          href={item.domain}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-1 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/5 transition"
                          title="Mở website đối thủ trong tab mới"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>

                    {/* Middle: Badge & Short description */}
                    <div className="space-y-1">
                      <div className="inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold bg-white/10 text-slate-200 border border-white/10">
                        {item.badge}
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Bottom Row: Actions */}
                    <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2">
                      <span className="text-[10px] text-slate-400 flex items-center space-x-1">
                        {active ? (
                          <span className="text-emerald-400 font-semibold flex items-center">
                            <Check className="w-3 h-3 mr-1 text-emerald-400" /> Đang chọn
                          </span>
                        ) : (
                          <span>Nhấn để chọn</span>
                        )}
                      </span>

                      {/* NÚT QUÉT NHANH 1-CLICK */}
                      <button
                        type="button"
                        disabled={isScanning}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCompetitor(item, true);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-[#D4AF37] to-amber-500 hover:from-amber-400 hover:to-[#D4AF37] text-[#0A1E5E] text-[11px] font-bold flex items-center space-x-1 transition shadow-sm hover:shadow disabled:opacity-50 cursor-pointer"
                        title="Tự động điền và kích hoạt quét sitemap ngay"
                      >
                        <Zap className="w-3 h-3 fill-current text-[#0A1E5E]" />
                        <span>Quét ngay</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* MODAL THÊM ĐỐI THỦ MỚI */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-[#0A1E5E] border border-white/15 p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                <h3 className="text-sm font-bold text-white">
                  Lưu đối thủ mới vào danh bạ riêng
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Website / Tên miền đối thủ <span className="text-[#D4AF37]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: vietlinkevent.vn hoặc https://vietlinkevent.vn"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Tên thương hiệu đối thủ (tùy chọn)
                </label>
                <input
                  type="text"
                  placeholder="VD: Vietlink Event"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Nhóm chuyên môn
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e: any) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/15 text-white outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  >
                    <option value="tron-goi">🎪 Trọn gói & Khai trương</option>
                    <option value="teambuilding">🏃 Teambuilding & Tour</option>
                    <option value="thiet-bi">🔊 Kho Âm thanh & Thiết bị</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Huy hiệu nổi bật
                  </label>
                  <input
                    type="text"
                    placeholder="VD: Chuyên hội thảo KCN"
                    value={newBadge}
                    onChange={(e) => setNewBadge(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Chỉ đạo AI mặc định khi quét đối thủ này (tùy chọn)
                </label>
                <textarea
                  rows={2}
                  placeholder="VD: Nhấn mạnh Trường Hải Event có tổng kho Line Array nhập khẩu trực tiếp, hotline 0844 198 333..."
                  value={newPrompt}
                  onChange={(e) => setNewPrompt(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={!newDomain.trim()}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-amber-500 text-[#0A1E5E] font-bold shadow-lg shadow-[#D4AF37]/20 hover:scale-105 transition disabled:opacity-50"
                >
                  Lưu vào danh bạ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
