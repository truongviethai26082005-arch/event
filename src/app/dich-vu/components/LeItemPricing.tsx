"use client";

import React, { useState } from "react";
import { Volume2, Lightbulb, Monitor, Tent, ArrowRight, ChevronRight, Tag } from "lucide-react";

interface PriceItem {
  name: string;
  spec: string;
  unit: string;
  priceFrom: string;
}

interface TabData {
  id: string;
  label: string;
  items: PriceItem[];
}

const TABS: TabData[] = [
  {
    id: "am-thanh",
    label: "Âm Thanh",
    items: [
      { name: "Loa Line Array (cặp đôi)", spec: "Đáp ứng 200–2.000 khách, âm thanh chuẩn quốc tế", unit: "/cặp/ngày", priceFrom: "2.500.000 VNĐ" },
      { name: "Loa Sub Woofer đôi", spec: "Công suất lớn, âm trầm uy lực cho sân khấu ngoài trời", unit: "/cặp/ngày", priceFrom: "1.200.000 VNĐ" },
      { name: "Loa Monitor sân khấu", spec: "Kiểm âm sân khấu cho ca sĩ và MC", unit: "/chiếc/ngày", priceFrom: "400.000 VNĐ" },
      { name: "Bàn Mixer kỹ thuật số", spec: "Yamaha, Allen & Heath, Behringer đa kênh", unit: "/ngày", priceFrom: "800.000 VNĐ" },
      { name: "Micro không dây UHF (cặp)", spec: "Shure / Sennheiser bắt sóng ổn định 100m", unit: "/cặp/ngày", priceFrom: "500.000 VNĐ" },
      { name: "Micro cổ ngỗng hội nghị", spec: "Bosch / Shure chuẩn hội thảo, chống hú 100%", unit: "/chiếc/ngày", priceFrom: "300.000 VNĐ" },
    ],
  },
  {
    id: "anh-sang",
    label: "Ánh Sáng",
    items: [
      { name: "Đèn Moving Head Beam 380W", spec: "Tia sắc nét, nhiều hiệu ứng màu sắc chuyên nghiệp", unit: "/chiếc/ngày", priceFrom: "600.000 VNĐ" },
      { name: "Đèn Par LED 54 bóng 3W", spec: "Nhuộm màu sân khấu, dải màu RGB đa dạng", unit: "/chiếc/ngày", priceFrom: "200.000 VNĐ" },
      { name: "Đèn Follow rọi sân khấu", spec: "Rọi lối đi danh dự, tôn vinh cá nhân", unit: "/chiếc/ngày", priceFrom: "800.000 VNĐ" },
      { name: "Đèn Blinder chớp sáng", spec: "Tạo cao trào kịch tính, đèn COB vàng nắng", unit: "/chiếc/ngày", priceFrom: "350.000 VNĐ" },
      { name: "Máy tạo khói lạnh CO2", spec: "Hiệu ứng khói trắng lan mặt sàn ấn tượng", unit: "/buổi", priceFrom: "1.500.000 VNĐ" },
      { name: "Pháo sáng kim tuyến điện", spec: "An toàn, bắn cao 4–6m, dùng trong nhà được", unit: "/chiếc", priceFrom: "500.000 VNĐ" },
    ],
  },
  {
    id: "man-hinh-led",
    label: "Màn Hình LED",
    items: [
      { name: "Màn LED P2.5 trong nhà", spec: "Độ phân giải cao, hiển thị văn bản cực nét", unit: "/m²/ngày", priceFrom: "2.000.000 VNĐ" },
      { name: "Màn LED P3.91 ngoài trời", spec: "Chống nước IP65, độ sáng cao dùng dưới nắng", unit: "/m²/ngày", priceFrom: "1.500.000 VNĐ" },
      { name: "Màn hình phụ Stage Monitor", spec: "Nhắc bài, nhắc slide cho diễn giả và MC", unit: "/chiếc/ngày", priceFrom: "800.000 VNĐ" },
      { name: "Bộ xử lý hình ảnh 4K", spec: "Điều khiển đa màn hình, render video 4K mượt", unit: "/ngày", priceFrom: "1.000.000 VNĐ" },
    ],
  },
  {
    id: "nha-bat-san-khau",
    label: "Nhà Bạt & Sân Khấu",
    items: [
      { name: "Nhà bạt không gian nhôm 10m", spec: "Kết cấu nhôm đúc, bạt 2 da Hàn Quốc chống thấm", unit: "/ngày", priceFrom: "8.000.000 VNĐ" },
      { name: "Nhà bạt không gian nhôm 15m", spec: "Khẩu độ rộng, chịu gió cấp 6–7 an toàn", unit: "/ngày", priceFrom: "14.000.000 VNĐ" },
      { name: "Sân khấu lắp ghép (12m²)", spec: "Chịu lực cao, trải thảm đỏ/xám mới 100%", unit: "/ngày", priceFrom: "3.000.000 VNĐ" },
      { name: "Sân khấu lắp ghép (24m²)", spec: "Điều chỉnh chiều cao 0.4m–1.5m linh hoạt", unit: "/ngày", priceFrom: "5.500.000 VNĐ" },
      { name: "Cổng chào hơi in decal", spec: "Kích thước 10–15m, in logo sắc nét theo yêu cầu", unit: "/ngày", priceFrom: "1.500.000 VNĐ" },
      { name: "Thảm đỏ VIP (5m)", spec: "Thảm nhung dày, sạch mới, kèm cọc chắn dây", unit: "/5m/ngày", priceFrom: "500.000 VNĐ" },
      { name: "Bàn ghế Banquet (bộ 10 người)", spec: "Bàn tròn kính xoay + ghế bọc nơ theo tone màu", unit: "/bộ/ngày", priceFrom: "1.200.000 VNĐ" },
    ],
  },
];

const TAB_ICONS: Record<string, React.ReactNode> = {
  "am-thanh": <Volume2 className="w-4 h-4" />,
  "anh-sang": <Lightbulb className="w-4 h-4" />,
  "man-hinh-led": <Monitor className="w-4 h-4" />,
  "nha-bat-san-khau": <Tent className="w-4 h-4" />,
};

interface LeItemPricingProps {
  onSelectItem: (itemName: string) => void;
}

export default function LeItemPricing({ onSelectItem }: LeItemPricingProps) {
  const [activeTab, setActiveTab] = useState("am-thanh");
  const activeData = TABS.find((t) => t.id === activeTab)!;

  return (
    <section className="py-16 bg-slate-50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
            GIÁ THUÊ TỪNG HẠNG MỤC
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#0A1E5E]">
            Báo Giá Dịch Vụ Lẻ Theo Hạng Mục
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-light leading-relaxed">
            Tham khảo mức giá khởi điểm từng thiết bị — giá thực tế tùy thuộc vào số lượng, thời gian và địa điểm.
            Liên hệ để nhận báo giá chính xác nhất cho sự kiện của bạn.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "bg-[#0A1E5E] text-[#D4AF37] shadow-md shadow-[#0A1E5E]/20"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-[#0A1E5E] hover:text-[#0A1E5E]"
              }`}
            >
              {TAB_ICONS[tab.id]}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 bg-[#0A1E5E] text-[#D4AF37] text-[11px] font-black uppercase tracking-wider px-6 py-3">
            <div className="col-span-11 sm:col-span-5">Hạng Mục Thiết Bị</div>
            <div className="col-span-4 hidden sm:block">Thông Số Kỹ Thuật</div>
            <div className="col-span-2 hidden sm:block text-right">Giá Khởi Điểm</div>
            <div className="col-span-1"></div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-slate-100">
            {activeData.items.map((item, idx) => (
              <div
                key={idx}
                className="grid grid-cols-12 items-center px-6 py-4 hover:bg-amber-50/40 transition-colors group"
              >
                {/* Name + mobile info */}
                <div className="col-span-11 sm:col-span-5 space-y-0.5">
                  <p className="text-sm font-bold text-[#0A1E5E] group-hover:text-[#D4AF37] transition-colors leading-snug">
                    {item.name}
                  </p>
                  <p className="text-[11px] text-slate-400 sm:hidden leading-relaxed">{item.spec}</p>
                  <div className="sm:hidden flex items-center gap-1 mt-1">
                    <Tag className="w-3 h-3 text-[#D4AF37]" />
                    <span className="text-xs font-bold text-[#0A1E5E]">
                      Từ {item.priceFrom}
                      <span className="text-slate-400 font-normal"> {item.unit}</span>
                    </span>
                  </div>
                </div>

                {/* Spec desktop */}
                <div className="col-span-4 hidden sm:block">
                  <p className="text-xs text-slate-500 leading-relaxed">{item.spec}</p>
                </div>

                {/* Price desktop */}
                <div className="col-span-2 hidden sm:flex flex-col items-end">
                  <span className="text-xs font-black text-[#0A1E5E]">Từ {item.priceFrom}</span>
                  <span className="text-[10px] text-slate-400">{item.unit}</span>
                </div>

                {/* CTA button */}
                <div className="col-span-1 flex justify-end">
                  <button
                    onClick={() => onSelectItem(item.name)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-[#D4AF37] text-slate-500 hover:text-[#0A1E5E] transition-all group-hover:scale-110 cursor-pointer"
                    title={`Báo giá ${item.name}`}
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Footer note */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[11px] text-slate-400 leading-relaxed">
              * Giá trên là mức khởi điểm tham khảo. Chưa bao gồm chi phí vận chuyển, lắp đặt và kỹ thuật viên trực.
            </p>
            <button
              onClick={() => onSelectItem(`Thuê lẻ thiết bị: ${activeData.label}`)}
              className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0A1E5E] text-[#D4AF37] text-xs font-black hover:bg-[#142a6d] transition cursor-pointer"
            >
              <span>Nhận báo giá tổng</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
