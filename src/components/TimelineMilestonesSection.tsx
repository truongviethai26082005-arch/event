"use client";

import React from "react";
import Reveal from "@/components/Reveal";
import { Clock } from "lucide-react";

export interface TimelineMilestone {
  year: string;
  tag: string;
  badge: string;
  title: string;
  desc: string;
}

export const TIMELINE_DATA: TimelineMilestone[] = [
  {
    year: "2019",
    tag: "Khởi nghiệp",
    badge: "🌟 Đồng hành cùng thế hệ trẻ",
    title: "Khởi Sự & Dấu Ấn Vì Cộng Đồng",
    desc: "Đặt nền móng đầu tiên tại Hà Nội, khởi nguồn với các sự kiện sinh viên, học thuật và hoạt động xã hội. Đánh dấu bước ngoặt tài trợ và đồng hành cùng Festival 'Tuổi trẻ cống hiến vì cộng đồng', tạo dựng uy tín ban đầu với các cơ quan đoàn thể.",
  },
  {
    year: "2020",
    tag: "Mở rộng dịch vụ",
    badge: "✈️ Hệ sinh thái tích hợp",
    title: "Hoàn Thiện Mô Hình 'Event & Travel'",
    desc: "Chính thức mở rộng mảng Du lịch trải nghiệm kết hợp sự kiện trọn gói: tour MICE, Team Building doanh nghiệp và vận tải lữ hành. Khởi xướng chuỗi hành trình thiện nguyện ý nghĩa như 'Chắp cánh ước mơ' (Yên Bái) và 'Hướng về Sìn Hồ' (Lai Châu).",
  },
  {
    year: "2021",
    tag: "Năng lực vận hành",
    badge: "🏆 Dấu ấn dự án trọng điểm",
    title: "Đột Phá Năng Lực Tổ Chức Sự Kiện Cấp Nhà Nước",
    desc: "Khẳng định năng lực điều phối sự kiện quy mô lớn thông qua việc tổ chức thành công Lễ thông xe Dự án sửa chữa cầu Thăng Long (Tổng cục Đường bộ Việt Nam). Xây dựng quy trình vận hành khắt khe, đạt chuẩn kỹ thuật và an toàn cao cấp.",
  },
  {
    year: "2022",
    tag: "Đối tác chiến lược",
    badge: "🤝 200+ Doanh nghiệp tin chọn",
    title: "Đồng Hành Cùng Chuỗi Bán Lẻ & Tập Đoàn Lớn",
    desc: "Trở thành đối tác quen thuộc của nhiều thương hiệu danh tiếng: tổ chức chuỗi Grand Opening cho LocknLock, Toyoky; khánh thành dự án năng lượng tại Nhà máy Eiffel - Damsan; hỗ trợ sự kiện mở bán BĐS nghỉ dưỡng cao cấp Vinpearl Resort & Golf Nam Hội An.",
  },
  {
    year: "2023",
    tag: "Kho thiết bị 100%",
    badge: "⚡ Sở hữu trực tiếp",
    title: "Tự Chủ Hệ Thống Thiết Bị Sân Khấu Trực Tiếp",
    desc: "Đầu tư đồng bộ kho thiết bị âm thanh Line Array công suất lớn, màn hình LED và hệ thống decor cơ động. Giải pháp trọn gói giúp cắt giảm chi phí trung gian, tối ưu 20% – 30% ngân sách và chủ động tuyệt đối về tiến độ cho khách hàng.",
  },
  {
    year: "2024 - 2026",
    tag: "Bứt phá & Đổi mới",
    badge: "🚀 Sáng tạo không giới hạn",
    title: "Vươn Tầm Thương Hiệu Toàn Diện",
    desc: "Mở rộng mạng lưới đối tác sâu rộng từ khối trường đại học (ĐH Ngoại thương, ĐH Kinh tế Quốc dân, ĐH Bách Khoa) đến các tập đoàn tài chính, bất động sản hàng đầu. Kiên định với sứ mệnh mang đến giải pháp sự kiện chuyên nghiệp, giàu cảm xúc và kết nối thành công.",
  },
];

interface TimelineMilestonesSectionProps {
  className?: string;
  showHeader?: boolean;
}

export default function TimelineMilestonesSection({
  className = "",
  showHeader = true,
}: TimelineMilestonesSectionProps) {
  return (
    <section
      id="lich-su"
      className={`scroll-mt-28 py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-white via-slate-50/70 to-white relative overflow-hidden ${className}`}
    >
      {/* Background Ambient Luxury Light */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-amber-200/15 via-blue-900/5 to-transparent blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-amber-100/30 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute top-20 right-10 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        {showHeader && (
          <Reveal delay={100} direction="up">
            <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20 space-y-3">
              <span className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-xs font-semibold text-amber-800 shadow-sm">
                <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Hành Trình Bền Bỉ &amp; Tự Hào</span>
              </span>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0A1E5E] tracking-tight leading-tight">
                Lịch Sử Phát Triển &amp;{" "}
                <span className="bg-gradient-to-r from-amber-600 via-[#D4AF37] to-amber-600 bg-clip-text text-transparent">
                  Những Cột Mốc Vàng
                </span>
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto">
                Từ những viên gạch nền móng đầu tiên, Trường Hải Event &amp; Travel đã không ngừng bứt phá 
                để khẳng định vị thế đơn vị tổ chức sự kiện &amp; du lịch chuyên nghiệp, sáng tạo và uy tín hàng đầu.
              </p>
            </div>
          </Reveal>
        )}

        {/* Timeline Container */}
        <div className="relative">
          {/* Vertical Center Track on Desktop (lg+) - 100% thẳng đứng ngay chính giữa */}
          <div className="hidden lg:block absolute left-1/2 top-4 bottom-4 -translate-x-1/2 w-[3px] bg-gradient-to-b from-amber-400 via-[#0A1E5E]/40 to-amber-400 rounded-full" />

          {/* Vertical Track on Mobile / Tablet (< lg) - 100% thẳng đứng bên trái */}
          <div className="lg:hidden absolute left-6 top-4 bottom-4 -translate-x-1/2 w-[3px] bg-gradient-to-b from-amber-400 via-[#0A1E5E]/40 to-amber-400 rounded-full" />

          {/* Timeline Nodes & Cards */}
          <div className="space-y-10 sm:space-y-12 lg:space-y-16">
            {TIMELINE_DATA.map((item, idx) => {
              const isEven = idx % 2 === 0;

              return (
                <div key={idx} className="relative group">
                  {/* ==============================================================
                      CỘT MỐC NĂM (YEAR CIRCLE NODE)
                      Desktop: Cố định tuyệt đối chính xác tại left-1/2 (50%) trên trục thẳng đứng.
                      Mobile: Cố định tuyệt đối chính xác tại left-6 (24px) trên trục thẳng đứng.
                      TẤT CẢ CÁC NĂM ĐỀU CÙNG 1 ĐƯỜNG THẲNG ĐỨNG HOÀN TOÀN!
                  ============================================================== */}
                  <div className="absolute left-6 lg:left-1/2 top-8 -translate-x-1/2 -translate-y-1/2 z-20">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-[#0A1E5E] via-[#0E246A] to-[#06123B] text-[#D4AF37] border-4 border-white shadow-xl flex items-center justify-center font-extrabold group-hover:scale-115 group-hover:border-[#D4AF37] group-hover:shadow-[0_0_25px_rgba(212,175,55,0.7)] transition-all duration-300 select-none">
                      {item.year.includes("-") ? (
                        <div className="text-center leading-tight">
                          <span className="block text-[10px] sm:text-[11px] font-bold text-amber-300">
                            2024
                          </span>
                          <span className="block text-[8px] text-slate-300 font-bold -my-0.5">
                            –
                          </span>
                          <span className="block text-[10px] sm:text-[11px] font-bold text-amber-300">
                            2026
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs sm:text-sm tracking-tight text-amber-300 font-extrabold">
                          {item.year}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* ==============================================================
                      2-COLUMN GRID TRÊN DESKTOP:
                      - isEven: Card bên cột Trái, cột Phải rỗng
                      - !isEven: Cột Trái rỗng, Card bên cột Phải
                      - Trên Mobile: Thẻ luôn căn lề pl-14 / pl-16 để chừa chỗ cho trục thẳng đứng
                  ============================================================== */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 items-center">
                    {/* CỘT TRÁI (Desktop) */}
                    <div className={isEven ? "block" : "hidden lg:block lg:invisible"}>
                      {isEven && (
                        <div className="pl-14 sm:pl-16 lg:pl-0">
                          <Reveal
                            delay={100}
                            direction="left"
                            className="w-full"
                          >
                            <div className="relative p-6 sm:p-7 rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 shadow-md hover:shadow-2xl transition-all duration-300 hover:border-[#D4AF37] hover:-translate-y-1 group">
                              {/* Top Badges */}
                              <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3.5">
                                <span className="text-[11px] sm:text-xs font-bold text-[#0A1E5E] px-3 py-1 rounded-full bg-slate-100 group-hover:bg-[#0A1E5E] group-hover:text-amber-300 transition-colors duration-300">
                                  {item.tag}
                                </span>
                                <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/70 flex items-center gap-1 shadow-sm">
                                  {item.badge}
                                </span>
                              </div>

                              {/* Title */}
                              <h3 className="text-lg sm:text-xl font-bold text-[#0A1E5E] mb-2.5 leading-snug group-hover:text-amber-600 transition-colors">
                                {item.title}
                              </h3>

                              {/* Description */}
                              <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
                                {item.desc}
                              </p>

                              {/* Mũi tên chỉ vào mốc năm trung tâm trên Desktop (Bên phải thẻ) */}
                              <div className="hidden lg:block absolute top-8 -right-2.5 -translate-y-1/2 w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-l-[10px] border-l-slate-200 group-hover:border-l-[#D4AF37] transition-colors" />
                              <div className="hidden lg:block absolute top-8 -right-2 -translate-y-1/2 w-0 h-0 border-t-[7px] border-t-transparent border-b-[7px] border-b-transparent border-l-[9px] border-l-white" />
                            </div>
                          </Reveal>
                        </div>
                      )}
                    </div>

                    {/* CỘT PHẢI (Desktop) */}
                    <div className={!isEven ? "block" : "hidden lg:block lg:invisible"}>
                      {!isEven && (
                        <div className="pl-14 sm:pl-16 lg:pl-0">
                          <Reveal
                            delay={100}
                            direction="right"
                            className="w-full"
                          >
                            <div className="relative p-6 sm:p-7 rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 shadow-md hover:shadow-2xl transition-all duration-300 hover:border-[#D4AF37] hover:-translate-y-1 group">
                              {/* Top Badges */}
                              <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3.5">
                                <span className="text-[11px] sm:text-xs font-bold text-[#0A1E5E] px-3 py-1 rounded-full bg-slate-100 group-hover:bg-[#0A1E5E] group-hover:text-amber-300 transition-colors duration-300">
                                  {item.tag}
                                </span>
                                <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/70 flex items-center gap-1 shadow-sm">
                                  {item.badge}
                                </span>
                              </div>

                              {/* Title */}
                              <h3 className="text-lg sm:text-xl font-bold text-[#0A1E5E] mb-2.5 leading-snug group-hover:text-amber-600 transition-colors">
                                {item.title}
                              </h3>

                              {/* Description */}
                              <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
                                {item.desc}
                              </p>

                              {/* Mũi tên chỉ vào mốc năm trung tâm trên Desktop (Bên trái thẻ) */}
                              <div className="hidden lg:block absolute top-8 -left-2.5 -translate-y-1/2 w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-r-[10px] border-r-slate-200 group-hover:border-r-[#D4AF37] transition-colors" />
                              <div className="hidden lg:block absolute top-8 -left-2 -translate-y-1/2 w-0 h-0 border-t-[7px] border-t-transparent border-b-[7px] border-b-transparent border-r-[9px] border-r-white" />
                            </div>
                          </Reveal>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
