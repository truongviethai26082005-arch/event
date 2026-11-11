"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Building2,
  ChevronDown,
  Zap,
  Search,
  Plus,
  X,
  Globe,
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
} from "./competitor-presets";

interface CompetitorDropdownProps {
  currentDomain: string;
  onSelectCompetitor: (competitor: CompetitorPreset, autoScan?: boolean) => void;
  isScanning: boolean;
}

export default function CompetitorDropdown({
  currentDomain,
  onSelectCompetitor,
  isScanning,
}: CompetitorDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<CompetitorCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [customList, setCustomList] = useState<CompetitorPreset[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // New competitor form state
  const [newName, setNewName] = useState("");
  const [newDomain, setNewDomain] = useState("");
  const [newCategory, setNewCategory] = useState<"tron-goi" | "teambuilding" | "thiet-bi">("tron-goi");
  const [newBadge, setNewBadge] = useState("");
  const [newPrompt, setNewPrompt] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load custom competitors on mount
  useEffect(() => {
    setCustomList(getSavedCustomCompetitors());
  }, []);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Merge default + custom presets
  const allCompetitors = useMemo(() => {
    return [...customList, ...DEFAULT_COMPETITOR_PRESETS];
  }, [customList]);

  // Filter list by category and search
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
          c.badge.toLowerCase().includes(q)
      );
    }
    return list;
  }, [allCompetitors, activeTab, searchQuery]);

  const handleAddNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomain.trim()) return;

    let cleanDomain = newDomain.trim();
    if (!cleanDomain.startsWith("http://") && !cleanDomain.startsWith("https://")) {
      cleanDomain = `https://${cleanDomain}`;
    }

    const saved = saveCustomCompetitor({
      name: newName.trim() || cleanDomain.replace(/^https?:\/\//, ""),
      domain: cleanDomain,
      category: newCategory,
      badge: newBadge.trim() || "Đối thủ tự thêm",
      description: `Đơn vị sự kiện thêm thủ công: ${newName || cleanDomain}`,
      suggestedPrompt: newPrompt.trim() || undefined,
    });

    setCustomList(getSavedCustomCompetitors());
    setNewName("");
    setNewDomain("");
    setNewBadge("");
    setNewPrompt("");
    setShowAddModal(false);
    onSelectCompetitor(saved, false);
    setIsOpen(false);
  };

  // Find currently selected competitor preset if any
  const matchedPreset = useMemo(() => {
    if (!currentDomain) return null;
    const cleanCurrent = currentDomain.toLowerCase().replace(/^https?:\/\//, "").replace(/\/$/, "");
    return allCompetitors.find((c) => {
      const cleanTarget = c.domain.toLowerCase().replace(/^https?:\/\//, "").replace(/\/$/, "");
      return cleanTarget === cleanCurrent || cleanCurrent.includes(cleanTarget);
    });
  }, [currentDomain, allCompetitors]);

  return (
    <div className="relative shrink-0 z-30" ref={dropdownRef}>
      {/* TRIGGER BUTTON */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`px-3.5 py-2.5 rounded-xl border text-xs font-semibold flex items-center space-x-2 transition-all cursor-pointer whitespace-nowrap shadow-xs ${
          isOpen || matchedPreset
            ? "bg-amber-50 border-[#D4AF37] text-slate-900 ring-1 ring-[#D4AF37]/50"
            : "bg-white hover:bg-slate-50 border-slate-300 text-slate-700 hover:text-slate-900"
        }`}
        title="Chọn đối thủ nạp sẵn để quét nhanh"
      >
        <Building2 className="w-4 h-4 text-amber-600" />
        <span>
          {matchedPreset ? `Đối thủ: ${matchedPreset.name}` : `📚 Chọn đối thủ mẫu (${allCompetitors.length})`}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-amber-600" : ""
          }`}
        />
      </button>

      {/* FLOATING DROPDOWN POPOVER */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-[92vw] sm:w-[420px] bg-white border border-slate-200 rounded-2xl shadow-2xl p-3.5 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-3">
          {/* Header & Search */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Danh bạ 9 đối thủ mẫu đầu ngành</span>
              </span>
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="text-[11px] font-bold text-amber-600 hover:underline flex items-center space-x-1"
              >
                <Plus className="w-3 h-3" />
                <span>Thêm mới</span>
              </button>
            </div>

            {/* Quick Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Tìm tên hoặc domain đối thủ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs outline-none focus:bg-white focus:ring-1 focus:ring-[#D4AF37] placeholder:text-slate-400"
              />
            </div>

            {/* Category Filter Tabs */}
            <div className="flex items-center space-x-1 overflow-x-auto pb-1 scrollbar-none text-[10px]">
              {CATEGORY_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-2 py-1 rounded-md shrink-0 font-medium transition cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-[#D4AF37] text-[#0A1E5E] font-bold shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200"
                  }`}
                >
                  <span>{tab.icon} {tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Competitor List */}
          <div className="max-h-64 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin scrollbar-thumb-slate-200">
            {filteredList.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400">
                Không tìm thấy đối thủ nào phù hợp
              </div>
            ) : (
              filteredList.map((c) => {
                const isSelected =
                  currentDomain.toLowerCase().includes(c.domain.toLowerCase().replace(/^https?:\/\//, ""));

                return (
                  <div
                    key={c.id}
                    onClick={() => {
                      onSelectCompetitor(c, false);
                      setIsOpen(false);
                    }}
                    className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 cursor-pointer transition-all group ${
                      isSelected
                        ? "bg-amber-50 border-[#D4AF37] ring-1 ring-[#D4AF37]/40 shadow-xs"
                        : "bg-slate-50/70 hover:bg-slate-100 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-xs font-bold text-slate-900 group-hover:text-amber-700 truncate">
                          {c.name}
                        </span>
                        {c.isCustom && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-300 shrink-0 font-medium">
                            Đã lưu
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 font-mono truncate mt-0.5">
                        {c.domain.replace(/^https?:\/\//, "")}
                      </p>
                      <p className="text-[10px] text-slate-600 truncate">
                        {c.badge}
                      </p>
                    </div>

                    <div className="flex items-center space-x-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCompetitor(c, false);
                          setIsOpen(false);
                        }}
                        title="Điền tên miền đối thủ này vào ô tìm kiếm"
                        className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-200 text-slate-700 hover:text-slate-900 text-[10px] font-semibold border border-slate-300 transition cursor-pointer shadow-xs"
                      >
                        Điền domain
                      </button>

                      <button
                        type="button"
                        disabled={isScanning}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCompetitor(c, true);
                          setIsOpen(false);
                        }}
                        title="Quét sitemap đối thủ này ngay"
                        className="px-2.5 py-1 rounded-lg bg-[#D4AF37] hover:bg-amber-400 text-[#0A1E5E] text-[10px] font-bold shrink-0 flex items-center space-x-1 shadow-xs transition disabled:opacity-50 cursor-pointer"
                      >
                        <Zap className="w-3 h-3 fill-current" />
                        <span>Quét ngay</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
            <span>{allCompetitors.length} đối thủ trong danh bạ</span>
            <span className="text-[10px] text-slate-400">Bấm bên ngoài để đóng</span>
          </div>
        </div>
      )}

      {/* ADD NEW COMPETITOR MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 max-w-md w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                <Plus className="w-4 h-4 text-amber-600" />
                <span>Thêm đối thủ mới vào danh bạ</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddNew} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Tên thương hiệu đối thủ <span className="text-amber-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: New Event Group"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs outline-none focus:bg-white focus:ring-1 focus:ring-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Website / Tên miền <span className="text-amber-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: newevent.vn"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs outline-none focus:bg-white focus:ring-1 focus:ring-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Phân loại chuyên môn
                </label>
                <select
                  value={newCategory}
                  onChange={(e: any) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs outline-none focus:bg-white focus:ring-1 focus:ring-[#D4AF37]"
                >
                  <option value="tron-goi">🎪 Trọn gói & Khai trương</option>
                  <option value="teambuilding">🏃 Teambuilding & Tour</option>
                  <option value="thiet-bi">🔊 Kho Âm thanh & Thiết bị</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Đặc điểm nổi bật (Badge)
                </label>
                <input
                  type="text"
                  placeholder="VD: Chuyên hội nghị cấp cao..."
                  value={newBadge}
                  onChange={(e) => setNewBadge(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs outline-none focus:bg-white focus:ring-1 focus:ring-[#D4AF37]"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-[#D4AF37] hover:bg-amber-400 text-[#0A1E5E] text-xs font-bold shadow-xs"
                >
                  Lưu & Chọn ngay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
