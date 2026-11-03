"use client";

import React, { useState } from "react";
import {
  RadarActivityLog,
  getStoredRadarLogs,
  saveStoredRadarLogs,
} from "./competitors-data";
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  Clock,
  RotateCw,
  Trash2,
  Calendar,
  Layers,
  FileText,
  Compass,
  Zap,
} from "lucide-react";

interface RadarActivityLogsProps {
  onRefreshData?: () => void;
}

export default function RadarActivityLogs({ onRefreshData }: RadarActivityLogsProps) {
  const [logs, setLogs] = useState<RadarActivityLog[]>(() => getStoredRadarLogs());
  const [filterType, setFilterType] = useState<string>("all");

  const handleClearLogs = () => {
    if (!confirm("Bạn có chắc muốn xóa lịch sử nhật ký hoạt động này không?")) return;
    setLogs([]);
    saveStoredRadarLogs([]);
    if (onRefreshData) onRefreshData();
  };

  const handleReload = () => {
    setLogs(getStoredRadarLogs());
    if (onRefreshData) onRefreshData();
  };

  const filteredLogs = logs.filter((log) => {
    if (filterType === "all") return true;
    return log.type === filterType;
  });

  const latestLog = logs[0];

  return (
    <div className="space-y-6">
      {/* THÔNG BÁO BANNER TRẠNG THÁI CA RADAR GẦN NHẤT */}
      {latestLog && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-[#071746] to-emerald-950/40 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-start sm:items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                Trạng thái vận hành gần nhất
              </p>
              <h4 className="text-xs sm:text-sm font-bold text-white">
                {latestLog.message}
              </h4>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[11px] font-mono text-[#D4AF37]">
              {new Date(latestLog.timestamp).toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}{" "}
              • {new Date(latestLog.timestamp).toLocaleDateString("vi-VN")}
            </span>
          </div>
        </div>
      )}

      {/* HEADER BẢNG NHẬT KÝ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-[#D4AF37]" />
          <h3 className="text-sm sm:text-base font-bold text-white">
            Nhật Ký Hoạt Động Radar SEO (Activity Log)
          </h3>
          <span className="text-xs text-slate-400">({logs.length} bản ghi)</span>
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-[#07133C] border border-white/15 text-white text-xs outline-none focus:ring-2 focus:ring-[#D4AF37]"
          >
            <option value="all">Tất cả loại ca quét</option>
            <option value="cron">Quét ngầm định kỳ (02:30)</option>
            <option value="dry-run">Chạy thử nghiệm (Dry-run)</option>
            <option value="live-run">Chạy thật thủ công</option>
            <option value="reschedule">Hẹn lại lịch</option>
          </select>

          <button
            type="button"
            onClick={handleReload}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10"
            title="Làm mới"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={handleClearLogs}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-white/10"
            title="Xóa nhật ký"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* BẢNG LỊCH SỬ NHẬT KÝ CHI TIẾT */}
      <div className="rounded-2xl border border-white/10 overflow-hidden bg-[#06123B]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-white/5 uppercase text-[10px] text-slate-400 font-bold border-b border-white/10">
              <tr>
                <th className="px-4 py-3">Thời gian ghi nhận</th>
                <th className="px-4 py-3">Loại ca quét</th>
                <th className="px-4 py-3">Đối tượng / Đối thủ</th>
                <th className="px-4 py-3 text-center">Số bài quét</th>
                <th className="px-4 py-3 text-center">Khoảng trống</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3">Chi tiết nhật ký</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-sans">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                    Chưa có nhật ký hoạt động nào được ghi nhận.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  return (
                    <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3 text-slate-300 whitespace-nowrap font-mono text-[11px]">
                        {new Date(log.timestamp).toLocaleTimeString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}{" "}
                        <span className="text-slate-500">
                          {new Date(log.timestamp).toLocaleDateString("vi-VN")}
                        </span>
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        {log.type === "cron" && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                            Quét ngầm định kỳ
                          </span>
                        )}
                        {log.type === "dry-run" && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/15 text-blue-300 border border-blue-500/30">
                            Chạy thử
                          </span>
                        )}
                        {log.type === "live-run" && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30">
                            Chạy thật
                          </span>
                        )}
                        {log.type === "reschedule" && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-500/15 text-slate-300 border border-slate-500/30">
                            Hẹn lại giờ
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3 font-semibold text-white whitespace-nowrap">
                        {log.competitorName}
                      </td>

                      <td className="px-4 py-3 text-center font-bold text-white">
                        <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[#D4AF37]">
                          {log.pagesScanned}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-center font-bold">
                        {log.gapsFound > 0 ? (
                          <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30">
                            +{log.gapsFound} gaps
                          </span>
                        ) : (
                          <span className="text-slate-500 text-[11px]">-</span>
                        )}
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        {log.status === "success" ? (
                          <span className="inline-flex items-center space-x-1 text-emerald-400 font-bold text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Thành công</span>
                          </span>
                        ) : log.status === "warning" ? (
                          <span className="inline-flex items-center space-x-1 text-amber-400 font-bold text-[11px]">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>Cảnh báo</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 text-red-400 font-bold text-[11px]">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>Lỗi</span>
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3 text-slate-300 text-[11px] max-w-md">
                        <p className="line-clamp-2">{log.message}</p>
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

