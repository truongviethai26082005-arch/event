"use client";

import React, { useState } from "react";
import {
  TrackedCompetitor,
  getStoredCompetitors,
  saveStoredCompetitors,
} from "./competitors-data";
import {
  Globe,
  Plus,
  Trash2,
  ExternalLink,
  Radar,
  CheckCircle2,
  Clock,
  PauseCircle,
  PlayCircle,
  ShieldCheck,
  Tag,
  Building,
  AlertCircle,
  Search,
} from "lucide-react";

interface CompetitorsManagerProps {
  onSelectCompetitorForScan?: (domain: string, name: string) => void;
  onRefreshStats?: () => void;
}

export default function CompetitorsManager({
  onSelectCompetitorForScan,
  onRefreshStats,
}: CompetitorsManagerProps) {
  const [competitors, setCompetitors] = useState<TrackedCompetitor[]>(() =>
    getStoredCompetitors()
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Form input state
  const [newName, setNewName] = useState("");
  const [newDomain, setNewDomain] = useState("");
  const [newCategory, setNewCategory] = useState<TrackedCompetitor["category"]>("tron-goi");
  const [newBadge, setNewBadge] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const handleAddCompetitor = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!newName.trim()) {
      setFormError("Vui lòng nhập tên hiển thị của đối thủ (VD: Viet Power Event).");
      return;
    }

    if (!newDomain.trim()) {
      setFormError("Vui lòng nhập tên miền website (VD: viet-power.vn hoặc https://viet-power.vn).");
      return;
    }

    // Chuẩn hóa domain
    let formattedDomain = newDomain.trim().toLowerCase();
    if (!formattedDomain.startsWith("http://") && !formattedDomain.startsWith("https://")) {
      formattedDomain = `https://${formattedDomain}`;
    }

    // Kiểm tra trùng lặp
    const exists = competitors.some(
      (c) => c.domain.toLowerCase().replace(/\/$/, "") === formattedDomain.replace(/\/$/, "")
    );
    if (exists) {
      setFormError("Tên miền này đã tồn tại trong danh sách theo dõi.");
      return;
    }

    const newComp: TrackedCompetitor = {
      id: `comp-${Date.now()}`,
      name: newName.trim(),
      domain: formattedDomain,
      category: newCategory,
      isActive: true,
      lastScannedAt: null,
      scannedPagesCount: 0,
      priorityBadge: newBadge.trim() || "Đối thủ mới",
      notes: newNotes.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    const updated = [newComp, ...competitors];
    setCompetitors(updated);
    saveStoredCompetitors(updated);

    // Reset form
    setNewName("");
    setNewDomain("");
    setNewBadge("");
    setNewNotes("");
    setFormSuccess(`Đã thêm đối thủ "${newComp.name}" vào hệ thống theo dõi ngầm!`);
    if (onRefreshStats) onRefreshStats();

    setTimeout(() => setFormSuccess(null), 4000);
  };

  const handleToggleStatus = (id: string) => {
    const updated = competitors.map((c) =>
      c.id === id ? { ...c, isActive: !c.isActive } : c
    );
    setCompetitors(updated);
    saveStoredCompetitors(updated);
    if (onRefreshStats) onRefreshStats();
  };

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Bạn có chắc muốn xóa đối thủ "${name}" khỏi danh sách theo dõi?`)) {
      return;
    }
    const updated = competitors.filter((c) => c.id !== id);
    setCompetitors(updated);
    saveStoredCompetitors(updated);
    if (onRefreshStats) onRefreshStats();
  };

  const filteredCompetitors = competitors.filter((comp) => {
    const matchesSearch =
      comp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comp.domain.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || comp.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const activeCount = competitors.filter((c) => c.isActive).length;
  const totalScanned = competitors.reduce((acc, c) => acc + (c.scannedPagesCount || 0), 0);

  return (
    <div className="space-y-6">
      {/* HEADER & THỐNG KÊ NHANH CỦA MODULE ĐỐI THỦ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400">Tổng đối thủ theo dõi</p>
            <h4 className="text-xl font-black text-white">{competitors.length}</h4>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400">Đang tự động quét ngầm</p>
            <h4 className="text-xl font-black text-emerald-400">{activeCount} đối thủ</h4>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Radar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400">Tổng bài viết đã trích xuất</p>
            <h4 className="text-xl font-black text-blue-300">{totalScanned} bài</h4>
          </div>
        </div>
      </div>

      {/* FORM THÊM ĐỐI THỦ MỚI */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
        <div className="flex items-center space-x-2">
          <Building className="w-4 h-4 text-[#D4AF37]" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Thêm tên miền & đối thủ cạnh tranh mới
          </h3>
        </div>

        <form onSubmit={handleAddCompetitor} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1 font-semibold">
                Tên hiển thị đối thủ *
              </label>
              <input
                type="text"
                placeholder="VD: Viet Power Event"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs outline-none focus:ring-2 focus:ring-[#D4AF37] placeholder-slate-500"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1 font-semibold">
                Tên miền (Domain) *
              </label>
              <input
                type="text"
                placeholder="VD: viet-power.vn"
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs outline-none focus:ring-2 focus:ring-[#D4AF37] placeholder-slate-500"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1 font-semibold">
                Phân loại dịch vụ
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-[#07133C] border border-white/15 text-white text-xs outline-none focus:ring-2 focus:ring-[#D4AF37]"
              >
                <option value="tron-goi">Sự kiện trọn gói & Khai trương</option>
                <option value="teambuilding">Teambuilding & Tour trải nghiệm</option>
                <option value="thiet-bi">Kho Âm thanh, LED & Thiết bị</option>
                <option value="hoi-nghi">Hội nghị, Hội thảo & Cổ đông</option>
                <option value="khac">Phân khúc khác</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1 font-semibold">
                Nhãn ưu tiên / Đặc điểm
              </label>
              <input
                type="text"
                placeholder="VD: Top 1 Teambuilding bãi biển"
                value={newBadge}
                onChange={(e) => setNewBadge(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs outline-none focus:ring-2 focus:ring-[#D4AF37] placeholder-slate-500"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <p className="text-[11px] text-slate-400 italic">
              * Hệ thống quét ngầm sẽ tự động đọc sitemap.xml của domain này lúc 02:30 sáng hàng ngày để trích xuất bài viết mới.
            </p>

            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-amber-500 text-[#0A1E5E] text-xs font-bold hover:brightness-110 flex items-center justify-center space-x-1.5 shadow-lg shadow-[#D4AF37]/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm vào danh sách theo dõi</span>
            </button>
          </div>
        </form>

        {formError && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {formSuccess && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{formSuccess}</span>
          </div>
        )}
      </div>

      {/* BỘ LỌC VÀ TÌM KIẾM ĐỐI THỦ */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo tên hoặc domain đối thủ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-[#D4AF37]"
          />
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: "all", label: "Tất cả" },
            { id: "tron-goi", label: "Trọn gói" },
            { id: "teambuilding", label: "Teambuilding" },
            { id: "thiet-bi", label: "Thiết bị" },
            { id: "hoi-nghi", label: "Hội nghị" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCategoryFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                categoryFilter === tab.id
                  ? "bg-[#D4AF37] text-[#0A1E5E] font-bold"
                  : "bg-white/5 text-slate-300 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* BẢNG DANH SÁCH ĐỐI THỦ ĐANG THEO DÕI */}
      <div className="rounded-2xl border border-white/10 overflow-hidden bg-[#06123B]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-white/5 uppercase text-[10px] text-slate-400 font-bold border-b border-white/10">
              <tr>
                <th className="px-4 py-3.5">Đối thủ cạnh tranh</th>
                <th className="px-4 py-3.5">Tên miền (Domain)</th>
                <th className="px-4 py-3.5">Phân khúc</th>
                <th className="px-4 py-3.5 text-center">Trạng thái quét ngầm</th>
                <th className="px-4 py-3.5 text-center">Số bài đã cào</th>
                <th className="px-4 py-3.5">Quét gần nhất</th>
                <th className="px-4 py-3.5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredCompetitors.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                    Không tìm thấy đối thủ nào phù hợp với từ khóa tìm kiếm.
                  </td>
                </tr>
              ) : (
                filteredCompetitors.map((comp) => {
                  return (
                    <tr key={comp.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-white flex items-center space-x-1.5">
                          <span>{comp.name}</span>
                          {comp.priorityBadge && (
                            <span className="px-2 py-0.5 rounded text-[9px] font-semibold bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30">
                              {comp.priorityBadge}
                            </span>
                          )}
                        </div>
                        {comp.notes && (
                          <p className="text-[10px] text-slate-400 truncate max-w-xs mt-0.5">
                            {comp.notes}
                          </p>
                        )}
                      </td>

                      <td className="px-4 py-3.5 font-mono text-[11px]">
                        <a
                          href={comp.domain}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#D4AF37] hover:underline flex items-center space-x-1"
                        >
                          <span>{comp.domain.replace(/^https?:\/\//, "")}</span>
                          <ExternalLink className="w-3 h-3 text-slate-400" />
                        </a>
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="px-2 py-1 rounded text-[10px] font-semibold bg-white/5 border border-white/10 text-slate-300">
                          {comp.category === "tron-goi" && "Trọn gói"}
                          {comp.category === "teambuilding" && "Teambuilding"}
                          {comp.category === "thiet-bi" && "Kho Thiết bị"}
                          {comp.category === "hoi-nghi" && "Hội nghị"}
                          {comp.category === "khac" && "Khác"}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(comp.id)}
                          className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all ${
                            comp.isActive
                              ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25"
                              : "bg-slate-500/15 border-slate-500/30 text-slate-400 hover:bg-slate-500/25"
                          }`}
                        >
                          {comp.isActive ? (
                            <>
                              <PlayCircle className="w-3 h-3" />
                              <span>Đang theo dõi</span>
                            </>
                          ) : (
                            <>
                              <PauseCircle className="w-3 h-3" />
                              <span>Tạm dừng</span>
                            </>
                          )}
                        </button>
                      </td>

                      <td className="px-4 py-3.5 text-center font-bold text-white">
                        <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[#D4AF37]">
                          {comp.scannedPagesCount || 0} bài
                        </span>
                      </td>

                      <td className="px-4 py-3.5 text-slate-400 text-[11px]">
                        {comp.lastScannedAt ? (
                          <div className="flex items-center space-x-1 text-slate-300">
                            <Clock className="w-3 h-3 text-[#D4AF37]" />
                            <span>
                              {new Date(comp.lastScannedAt).toLocaleTimeString("vi-VN", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}{" "}
                              -{" "}
                              {new Date(comp.lastScannedAt).toLocaleDateString("vi-VN")}
                            </span>
                          </div>
                        ) : (
                          <span className="italic text-slate-500">Chưa quét</span>
                        )}
                      </td>

                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          {onSelectCompetitorForScan && (
                            <button
                              type="button"
                              onClick={() => onSelectCompetitorForScan(comp.domain, comp.name)}
                              className="px-2.5 py-1 rounded-lg bg-[#D4AF37]/15 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0A1E5E] font-bold text-[10px] transition-all flex items-center space-x-1 border border-[#D4AF37]/30"
                              title="Tải vào máy quét Domain ngay"
                            >
                              <Radar className="w-3 h-3" />
                              <span>Quét ngay</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleDelete(comp.id, comp.name)}
                            className="p-1 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Xóa đối thủ"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

