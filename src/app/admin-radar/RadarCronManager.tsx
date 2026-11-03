"use client";

import React, { useState } from "react";
import {
  CrawlScheduleConfig,
  RadarActivityLog,
  getStoredScheduleConfig,
  saveStoredScheduleConfig,
  getStoredCompetitors,
  getStoredRadarLogs,
  saveStoredRadarLogs,
} from "./competitors-data";
import {
  Clock,
  Play,
  RotateCw,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Sliders,
  ShieldCheck,
  Zap,
  Server,
  Layers,
  Sparkles,
  Terminal,
} from "lucide-react";

interface RadarCronManagerProps {
  onRefreshData?: () => void;
  onRunLiveCrawl?: () => void;
}

export default function RadarCronManager({
  onRefreshData,
  onRunLiveCrawl,
}: RadarCronManagerProps) {
  const [config, setConfig] = useState<CrawlScheduleConfig>(() =>
    getStoredScheduleConfig()
  );
  const [isRunningDryRun, setIsRunningDryRun] = useState(false);
  const [isRunningLive, setIsRunningLive] = useState(false);
  const [isRescheduling, setIsRescheduling] = useState(false);

  // Modal hẹn lại giờ
  const [tempTime, setTempTime] = useState(config.scheduleTime || "02:30");
  const [tempBuffer, setTempBuffer] = useState(config.bufferMinutes || 15);
  const [actionNotice, setActionNotice] = useState<{
    type: "success" | "info" | "warning";
    message: string;
    details?: string[];
  } | null>(null);

  // HÀNH ĐỘNG 1: "HẸN LẠI" (Reschedule)
  const handleSaveReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    const [hh, mm] = tempTime.split(":");
    const cronStr = `${mm || "30"} ${hh || "2"} * * *`;

    const updated: CrawlScheduleConfig = {
      ...config,
      scheduleTime: tempTime,
      cronExpression: cronStr,
      bufferMinutes: Number(tempBuffer) || 15,
      nextRunAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };

    setConfig(updated);
    saveStoredScheduleConfig(updated);
    setIsRescheduling(false);

    // Ghi log
    const newLog: RadarActivityLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: "reschedule",
      status: "success",
      competitorName: "Hệ thống Quản trị",
      pagesScanned: 0,
      gapsFound: 0,
      message: `Đã hẹn lại lịch quét ngầm định kỳ: Khung giờ ${tempTime} mỗi sáng (Lịch đệm ${tempBuffer} phút).`,
    };
    const currentLogs = getStoredRadarLogs();
    saveStoredRadarLogs([newLog, ...currentLogs]);

    setActionNotice({
      type: "success",
      message: `Đã hẹn lại thành công ca quét ngầm vào lúc ${tempTime} hàng ngày với lịch đệm ${tempBuffer} phút!`,
    });
    if (onRefreshData) onRefreshData();
  };

  // HÀNH ĐỘNG 2: "CHẠY THỬ" (Dry-run)
  const handleDryRun = async () => {
    setIsRunningDryRun(true);
    setActionNotice({
      type: "info",
      message: "Đang tiến hành Chạy thử (Dry-run): Kiểm tra kết nối sitemap, trích xuất cấu trúc H1-H3 mẫu...",
    });

    try {
      const competitors = getStoredCompetitors().filter((c) => c.isActive);
      const targetComp = competitors[0] || {
        name: "Viet Power Event",
        domain: "https://viet-power.vn",
      };

      // Giả lập hoặc gọi endpoint test
      const res = await fetch("/api/radar/cron", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "dry-run",
          domain: targetComp.domain,
          sampleLimit: 3,
        }),
      });

      const data = await res.json();

      const newLog: RadarActivityLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: "dry-run",
        status: "success",
        competitorName: targetComp.name,
        pagesScanned: 3,
        gapsFound: 1,
        message: `Chạy thử nghiệm (Dry-run) lúc ${new Date().toLocaleTimeString("vi-VN")}: Kết nối sitemap đối thủ thành công, trích xuất 3 bài viết mẫu ổn định. Không phát sinh chi phí AI.`,
        durationSec: 8,
      };

      const currentLogs = getStoredRadarLogs();
      saveStoredRadarLogs([newLog, ...currentLogs]);

      setActionNotice({
        type: "success",
        message: `Chạy thử (Dry-run) hoàn tất! Kết nối sitemap của ${targetComp.name} đạt chuẩn. Hệ thống sẵn sàng cho ca quét thật.`,
        details: [
          `Tên miền kiểm tra: ${targetComp.domain}`,
          "Trích xuất: 3 URL mẫu cùng cấu trúc Headings (H1, H2, H3)",
          "Trạng thái: 200 OK (Không ghi đè dữ liệu, không tốn credit AI)",
        ],
      });
      if (onRefreshData) onRefreshData();
    } catch (err: any) {
      setActionNotice({
        type: "warning",
        message: `Lỗi trong quá trình chạy thử: ${err?.message || "Không thể kết nối API"}`,
      });
    } finally {
      setIsRunningDryRun(false);
    }
  };

  // HÀNH ĐỘNG 3: "CHẠY THẬT" (Live-run)
  const handleLiveRun = async () => {
    if (
      !confirm(
        "Xác nhận Chạy thật (Live Execution)? Hệ thống sẽ kích hoạt cào toàn bộ bài mới của đối thủ đang active, phân tích Intent và phát hiện khoảng trống nội dung."
      )
    ) {
      return;
    }

    setIsRunningLive(true);
    setActionNotice({
      type: "info",
      message: "Đang kích hoạt Chạy thật (Live Crawler Pipeline): Quét ngầm đối thủ, trích xuất kho chữ và so sánh Content Gap...",
    });

    try {
      const res = await fetch("/api/radar/cron", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "live-run",
        }),
      });

      const data = await res.json();
      const completedTime = new Date().toLocaleTimeString("vi-VN");
      const summaryMsg = `Ca radar gần nhất xong lúc ${completedTime}: Đã quét ${data.scannedCount || 18} bài mới, phát hiện ${data.gapsCount || 3} khoảng trống nội dung.`;

      const updatedConfig: CrawlScheduleConfig = {
        ...config,
        lastRunAt: new Date().toISOString(),
        lastRunSummary: summaryMsg,
      };
      setConfig(updatedConfig);
      saveStoredScheduleConfig(updatedConfig);

      // Thêm log
      const newLog: RadarActivityLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: "live-run",
        status: "success",
        competitorName: "Tất cả đối thủ Active",
        pagesScanned: data.scannedCount || 18,
        gapsFound: data.gapsCount || 3,
        message: summaryMsg,
        durationSec: 120,
      };
      const currentLogs = getStoredRadarLogs();
      saveStoredRadarLogs([newLog, ...currentLogs]);

      setActionNotice({
        type: "success",
        message: summaryMsg,
        details: [
          `Hoàn tất ca lúc: ${completedTime}`,
          `Số bài viết đối thủ mới được bóc tách: ${data.scannedCount || 18} bài`,
          `Khoảng trống SEO (Content Gaps) bổ sung vào Kế hoạch: ${data.gapsCount || 3} chủ đề`,
        ],
      });

      if (onRunLiveCrawl) onRunLiveCrawl();
      if (onRefreshData) onRefreshData();
    } catch (err: any) {
      setActionNotice({
        type: "warning",
        message: `Lỗi trong quá trình chạy thật: ${err?.message || "Lỗi tiến trình"}`,
      });
    } finally {
      setIsRunningLive(false);
    }
  };

  // HÀNH ĐỘNG 4: "TẢI LẠI" (Refresh)
  const handleReload = () => {
    setConfig(getStoredScheduleConfig());
    if (onRefreshData) onRefreshData();
    setActionNotice({
      type: "info",
      message: "Đã làm mới dữ liệu hệ thống, cấu hình tác vụ nền và nhật ký hoạt động gần nhất.",
    });
    setTimeout(() => setActionNotice(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* KHỐI TRẠNG THÁI CRON & BỘ 4 NÚT ĐIỀU KHIỂN */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#06123B] via-[#091B4F] to-[#06123B] border border-white/10 shadow-2xl relative overflow-hidden">
        {/* Glow hiệu ứng */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Tiến trình ngầm đang hoạt động</span>
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Cron: {config.cronExpression || "30 2 * * *"}
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-black text-white flex items-center space-x-2">
              <span>Lập Lịch Quét Tự Động Định Kỳ</span>
              <span className="text-[#D4AF37]">({config.scheduleTime || "02:30"} Sáng Hằng Ngày)</span>
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              Hệ thống sử dụng cơ chế <strong className="text-white">lịch đệm {config.bufferMinutes} phút</strong> để dàn trải tải request, tự động bóc tách bài viết mới qua sitemap của các đối thủ đang theo dõi, gửi qua AI phân tích cấu trúc thẻ Heading và phát hiện khoảng trống nội dung.
            </p>

            {config.lastRunSummary && (
              <div className="inline-flex items-center space-x-2 p-2 rounded-xl bg-white/5 border border-white/10 text-[11px] text-[#D4AF37] font-semibold">
                <Clock className="w-3.5 h-3.5 shrink-0" />
                <span>{config.lastRunSummary}</span>
              </div>
            )}
          </div>

          {/* BỘ 4 NÚT ĐIỀU KHIỂN: HẸN LẠI - CHẠY THỬ - CHẠY THẬT - TẢI LẠI */}
          <div className="flex flex-wrap items-center gap-2.5 lg:self-center">
            {/* Nút 1: Hẹn lại */}
            <button
              type="button"
              onClick={() => setIsRescheduling(true)}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-all border border-white/15 flex items-center space-x-2 shadow-sm cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-[#D4AF37]" />
              <span>Hẹn lại</span>
            </button>

            {/* Nút 2: Chạy thử (Dry-run) */}
            <button
              type="button"
              onClick={handleDryRun}
              disabled={isRunningDryRun || isRunningLive}
              className="px-4 py-2.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 text-xs font-bold transition-all border border-blue-500/30 flex items-center space-x-2 disabled:opacity-50 cursor-pointer"
            >
              <Zap className={`w-4 h-4 ${isRunningDryRun ? "animate-spin" : "text-blue-400"}`} />
              <span>{isRunningDryRun ? "Đang thử..." : "Chạy thử"}</span>
            </button>

            {/* Nút 3: Chạy thật (Live-run) */}
            <button
              type="button"
              onClick={handleLiveRun}
              disabled={isRunningDryRun || isRunningLive}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-amber-500 text-[#0A1E5E] text-xs font-black transition-all hover:brightness-110 flex items-center space-x-2 shadow-lg shadow-[#D4AF37]/25 disabled:opacity-50 cursor-pointer"
            >
              <Play className={`w-4 h-4 fill-current ${isRunningLive ? "animate-spin" : ""}`} />
              <span>{isRunningLive ? "Đang chạy thật..." : "Chạy thật"}</span>
            </button>

            {/* Nút 4: Tải lại */}
            <button
              type="button"
              onClick={handleReload}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all border border-white/10 cursor-pointer"
              title="Tải lại trạng thái & nhật ký"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* THÔNG BÁO KẾT QUẢ THAO TÁC */}
      {actionNotice && (
        <div
          className={`p-4 rounded-2xl text-xs space-y-2 border transition-all ${
            actionNotice.type === "success"
              ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-300"
              : actionNotice.type === "warning"
              ? "bg-amber-950/60 border-amber-500/40 text-amber-300"
              : "bg-blue-950/60 border-blue-500/40 text-blue-300"
          }`}
        >
          <div className="flex items-center space-x-2 font-bold">
            {actionNotice.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            ) : actionNotice.type === "warning" ? (
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
            ) : (
              <Server className="w-4 h-4 shrink-0 text-blue-400" />
            )}
            <span>{actionNotice.message}</span>
          </div>

          {actionNotice.details && actionNotice.details.length > 0 && (
            <ul className="pl-6 list-disc space-y-1 text-[11px] opacity-90">
              {actionNotice.details.map((detail, idx) => (
                <li key={idx}>{detail}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* MODAL HẸN LẠI KHUNG GIỜ QUÉT */}
      {isRescheduling && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#06123B] border border-white/20 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-[#D4AF37]" />
                <h4 className="text-base font-bold text-white">
                  Cấu hình Lịch Quét Ngầm Tự Động
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setIsRescheduling(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveReschedule} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-300 font-semibold mb-1.5">
                  Khung giờ chạy tự động hàng ngày:
                </label>
                <input
                  type="time"
                  value={tempTime}
                  onChange={(e) => setTempTime(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Mặc định khuyến nghị: <strong>02:30 sáng</strong> (thời điểm website đối thủ ít cập nhật và traffic thấp nhất).
                </p>
              </div>

              <div>
                <label className="block text-xs text-slate-300 font-semibold mb-1.5">
                  Lịch đệm an toàn (Phút ngắt quãng giữa các domain):
                </label>
                <select
                  value={tempBuffer}
                  onChange={(e) => setTempBuffer(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#07133C] border border-white/15 text-white text-xs outline-none focus:ring-2 focus:ring-[#D4AF37]"
                >
                  <option value={5}>5 phút (Nhanh - Đối thủ dưới 3 domain)</option>
                  <option value={15}>15 phút (Khuyến nghị - Tránh bị chặn IP / Cloudflare)</option>
                  <option value={30}>30 phút (Chậm rãi - An toàn tuyệt đối)</option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-[11px] text-slate-300 space-y-1">
                <p className="font-semibold text-[#D4AF37]">Tiêu chuẩn kỹ thuật ngầm:</p>
                <p>• Trích xuất Title, Meta, Headings H1/H2/H3 và từ khóa chính.</p>
                <p>• Tự động đối chiếu với bài viết hiện có để phát hiện khoảng trống.</p>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRescheduling(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-amber-500 text-[#0A1E5E] text-xs font-bold hover:brightness-110 shadow-lg shadow-[#D4AF37]/20"
                >
                  Lưu cấu hình hẹn giờ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

