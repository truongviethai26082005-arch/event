"use client";

import React from "react";
import Reveal from "@/components/Reveal";

interface VisionMissionSectionProps {
  className?: string;
  showHeader?: boolean;
}

export default function VisionMissionSection({
  className = "",
  showHeader = true,
}: VisionMissionSectionProps) {
  return (
    <section
      className={`py-14 sm:py-16 lg:py-20 bg-slate-50 relative overflow-hidden border-b border-slate-200 ${className}`}
    >
      {/* Soft luxury ambient background glow */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[600px] h-40 bg-gradient-to-b from-amber-200/20 via-amber-100/10 to-transparent blur-3xl pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {showHeader && (
          <Reveal delay={100} direction="up">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 mb-10 sm:mb-12">
              {/* Left Column: Line accent + 2-line Heading */}
              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-bold text-[#0A1E5E] tracking-tight leading-tight">
                  Tầm Nhìn <span className="text-[#D4AF37]">&amp;</span> Sứ Mệnh
                </h2>
              </div>

              {/* Right Column: Amber vertical border + Paragraph */}
              <div className="max-w-md border-l-2 border-amber-400 pl-4 py-0.5">
                <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-normal">
                  Kim chỉ nam dẫn lối mọi hành động, chuẩn mực chất lượng và tâm huyết 
                  mà đội ngũ Trường Hải Event &amp; Travel cam kết phụng sự đối tác trong từng dự án.
                </p>
              </div>
            </div>
          </Reveal>
        )}

        <div className="space-y-8 sm:space-y-10">
          {/* =========================================================================
              CARD 1: TẦM NHÌN (THEO THIẾT KẾ ẢNH SỐ 2)
              Cột trái: Nền kem sáng (Ivory), nội dung Tầm nhìn
              Cột phải: Hình ảnh tòa nhà cao tầng kính vươn lên bầu trời xanh
          ========================================================================= */}
          <Reveal delay={150} direction="up">
            <div className="rounded-2xl sm:rounded-3xl bg-[#FAF7F2] border border-amber-200/60 shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
                {/* Left Column: Text Content */}
                <div className="lg:col-span-6 p-6 sm:p-10 lg:p-14 flex flex-col justify-center">
                  <div className="space-y-4">
                    {/* Heading */}
                    <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0A1E5E] tracking-tight">
                      Tầm nhìn
                    </h3>

                    {/* Amber underline bar */}
                    <div className="w-16 h-1 sm:h-1.5 bg-[#D4AF37] rounded-full mt-2 mb-6" />

                    {/* Paragraph 1 */}
                    <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                      Thỏa mãn nhu cầu trải nghiệm và mang đến những giá trị thiết thực cho khách hàng thông qua các sản phẩm, dịch vụ{" "}
                      <strong className="font-bold text-[#0A1E5E]">
                        sự kiện và du lịch chuyên nghiệp
                      </strong>.
                    </p>

                    {/* Paragraph 2 */}
                    <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                      Trường Hải Event &amp; Travel phấn đấu trở thành đơn vị{" "}
                      <strong className="font-bold text-[#0A1E5E]">
                        uy tín, sáng tạo và tiên phong
                      </strong>{" "}
                      trong lĩnh vực tổ chức sự kiện và du lịch; xây dựng thương hiệu Trường Hải Event &amp; Travel trở thành{" "}
                      <strong className="font-bold text-[#0A1E5E]">
                        sự lựa chọn tin cậy và ưu tiên
                      </strong>{" "}
                      của khách hàng.
                    </p>
                  </div>
                </div>

                {/* Right Column: Architectural Skyscraper Image */}
                <div className="lg:col-span-6 relative min-h-[300px] sm:min-h-[380px] lg:min-h-[440px] overflow-hidden bg-slate-200">
                  <img
                    src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=85"
                    alt="Tầm nhìn Trường Hải Event & Travel - Tòa nhà hiện đại"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  {/* Subtle soft gradient edge */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent lg:hidden" />
                </div>
              </div>
            </div>
          </Reveal>

          {/* =========================================================================
              CARD 2: SỨ MỆNH (THEO THIẾT KẾ ẢNH SỐ 3)
              Cột trái: Hình ảnh cả nhóm đặt tay lên nhau thể hiện đoàn kết & cam kết
              Cột phải: Nền xanh Navy đậm sang trọng, nội dung Sứ mệnh
          ========================================================================= */}
          <Reveal delay={250} direction="up">
            <div className="rounded-2xl sm:rounded-3xl bg-[#0A1E5E] border border-blue-900/80 shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
                {/* Left Column: Team Hands Stacked Image (Shows first on desktop, matching image 3) */}
                <div className="lg:col-span-6 order-2 lg:order-1 relative min-h-[300px] sm:min-h-[380px] lg:min-h-[440px] overflow-hidden bg-slate-900">
                  <img
                    src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=1400&q=85"
                    alt="Sứ mệnh Trường Hải Event & Travel - Đội ngũ đồng lòng phụng sự"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  {/* Subtle navy tint overlay for visual coherence */}
                  <div className="absolute inset-0 bg-[#0A1E5E]/15 mix-blend-multiply pointer-events-none" />
                </div>

                {/* Right Column: Navy Dark Content */}
                <div className="lg:col-span-6 order-1 lg:order-2 p-6 sm:p-10 lg:p-14 flex flex-col justify-center text-white">
                  <div className="space-y-4">
                    {/* Heading */}
                    <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
                      Sứ mệnh
                    </h3>

                    {/* Amber underline bar */}
                    <div className="w-16 h-1 sm:h-1.5 bg-[#D4AF37] rounded-full mt-2 mb-6" />

                    {/* Paragraph 1 */}
                    <p className="text-sm sm:text-base text-slate-200/90 leading-relaxed font-normal">
                      Cam kết mang đến cho khách hàng những trải nghiệm{" "}
                      <strong className="font-bold text-white">
                        thực tế, chất lượng và giàu giá trị
                      </strong>{" "}
                      thông qua các sản phẩm, dịch vụ sự kiện và du lịch.
                    </p>

                    {/* Paragraph 2 */}
                    <p className="text-sm sm:text-base text-slate-200/90 leading-relaxed font-normal">
                      Không ngừng{" "}
                      <strong className="font-bold text-white">
                        sáng tạo, đổi mới và phát triển
                      </strong>{" "}
                      ý tưởng nhằm đáp ứng tốt nhất nhu cầu của khách hàng, đồng thời tạo nên những chương trình{" "}
                      <strong className="font-bold text-white">
                        chuyên nghiệp, ý nghĩa và đáng nhớ
                      </strong>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
