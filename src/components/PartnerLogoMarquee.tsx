"use client";

import React from "react";

interface PartnerBrand {
  id: string;
  name: string;
  category: string;
  svg: React.ReactNode;
}

export const PARTNER_BRANDS: PartnerBrand[] = [
  {
    id: "vcb",
    name: "Vietcombank",
    category: "Ngân hàng Ngoại thương",
    svg: (
      <svg viewBox="0 0 195 44" className="h-10 sm:h-12 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(4, 2)">
          <path d="M18 6C13 6 8.5 9.5 7 15C5.5 21 8 27.5 13.5 31.5L18 35L22.5 31.5C28 27.5 30.5 21 29 15C27.5 9.5 23 6 18 6ZM18 12C20.5 12 22.5 13.8 23.3 16.5C24.2 19.8 23 23.5 20.2 26L18 27.8L15.8 26C13 23.5 11.8 19.8 12.7 16.5C13.5 13.8 15.5 12 18 12Z" fill="#005C2B"/>
          <path d="M18 13.5C19.8 13.5 21.5 15 22 17.2C22.6 19.5 21.6 22.2 19.8 23.8L18 25.2L16.2 23.8C14.4 22.2 13.4 19.5 14 17.2C14.5 15 16.2 13.5 18 13.5Z" fill="#78BE20"/>
        </g>
        <text x="44" y="29" fill="#005C2B" fontFamily="Montserrat, system-ui, sans-serif" fontWeight="900" fontSize="20" letterSpacing="-0.5">Vietcombank</text>
      </svg>
    ),
  },
  {
    id: "vpbank",
    name: "VPBank",
    category: "Ngân hàng Thịnh Vượng",
    svg: (
      <svg viewBox="0 0 175 44" className="h-10 sm:h-12 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(4, 2)">
          <path d="M10 20C10 13 15 8.5 22 8.5C22 14.5 18.5 19 12.5 20H10Z" fill="#ED1C24"/>
          <path d="M22 8.5C29 8.5 34 13 34 20H31.5C25.5 19 22 14.5 22 8.5Z" fill="#ED1C24"/>
          <path d="M12.5 20C18.5 21 22 25.5 22 31.5C15 31.5 10 27 10 20H12.5Z" fill="#00B14F"/>
          <path d="M31.5 20C25.5 21 22 25.5 22 31.5C29 31.5 34 27 34 20H31.5Z" fill="#00B14F"/>
        </g>
        <text x="46" y="29" fill="#00B14F" fontFamily="Montserrat, system-ui, sans-serif" fontWeight="900" fontSize="22" letterSpacing="-0.5">VP<tspan fill="#ED1C24">Bank</tspan></text>
      </svg>
    ),
  },
  {
    id: "viettel",
    name: "Viettel Group",
    category: "Tập đoàn Viễn thông Quân đội",
    svg: (
      <svg viewBox="0 0 145 44" className="h-10 sm:h-12 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="5" width="137" height="34" rx="17" fill="#EE0033" />
        <text x="72" y="28" fill="#FFFFFF" fontFamily="Montserrat, system-ui, sans-serif" fontWeight="900" fontSize="19" textAnchor="middle" letterSpacing="-0.5">viettel</text>
      </svg>
    ),
  },
  {
    id: "vingroup",
    name: "Vingroup",
    category: "Tập đoàn Đa ngành",
    svg: (
      <svg viewBox="0 0 180 44" className="h-10 sm:h-12 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="22" r="15" fill="#DA251D"/>
        <path d="M11 22C15 16 20 13.5 29 16C24 19.5 21.5 25.5 20 30.5C19 25.5 16.5 19.5 11 22Z" fill="#FFD700"/>
        <text x="44" y="28" fill="#DA251D" fontFamily="Times New Roman, serif" fontWeight="900" fontSize="19" letterSpacing="1.2">VINGROUP</text>
      </svg>
    ),
  },
  {
    id: "sungroup",
    name: "Sun Group",
    category: "Tập đoàn Du lịch & BĐS",
    svg: (
      <svg viewBox="0 0 190 44" className="h-10 sm:h-12 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="22" r="10" fill="#F37021"/>
        <path d="M20 6V10M20 34V38M6 22H10M30 22H34M10 12L13 15M27 29L30 32M10 32L13 29M27 15L30 12" stroke="#F5A623" strokeWidth="3" strokeLinecap="round"/>
        <text x="44" y="23" fill="#0A1E5E" fontFamily="Montserrat, system-ui, sans-serif" fontWeight="900" fontSize="16" letterSpacing="1.2">SUN GROUP</text>
        <text x="44" y="33" fill="#F37021" fontFamily="Montserrat, system-ui, sans-serif" fontWeight="700" fontSize="9" letterSpacing="2">REAL ESTATE & LEISURE</text>
      </svg>
    ),
  },
  {
    id: "cellphones",
    name: "CellphoneS",
    category: "Hệ thống Bán lẻ Công nghệ",
    svg: (
      <svg viewBox="0 0 180 44" className="h-10 sm:h-12 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="5" width="34" height="34" rx="10" fill="#D70018"/>
        <path d="M21 12V32M15 18C15 14.5 27 14.5 27 22C27 29.5 15 29.5 15 26" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round"/>
        <text x="46" y="28" fill="#D70018" fontFamily="Montserrat, system-ui, sans-serif" fontWeight="900" fontSize="19" letterSpacing="-0.5">cellphone<tspan fill="#0A1E5E">S</tspan></text>
      </svg>
    ),
  },
  {
    id: "hoangha",
    name: "Hoàng Hà Mobile",
    category: "Hệ thống Bán lẻ Điện thoại",
    svg: (
      <svg viewBox="0 0 190 44" className="h-10 sm:h-12 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="22" r="15" fill="#00483D"/>
        <circle cx="20" cy="22" r="8" fill="#009981"/>
        <text x="44" y="22" fill="#00483D" fontFamily="Montserrat, system-ui, sans-serif" fontWeight="900" fontSize="15">HOÀNG HÀ</text>
        <text x="44" y="34" fill="#009981" fontFamily="Montserrat, system-ui, sans-serif" fontWeight="900" fontSize="12" letterSpacing="1.5">MOBILE</text>
      </svg>
    ),
  },
  {
    id: "locknlock",
    name: "LocknLock",
    category: "Thương hiệu Gia dụng Toàn cầu",
    svg: (
      <svg viewBox="0 0 175 44" className="h-10 sm:h-12 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="6" width="32" height="32" rx="8" fill="#005EA6" />
        <path d="M15 16V13C15 10.5 17.5 8.5 20 8.5C22.5 8.5 25 10.5 25 13V16" stroke="#FFFFFF" strokeWidth="2.5"/>
        <rect x="14" y="16" width="12" height="10" rx="2.5" fill="#FFFFFF"/>
        <text x="44" y="28" fill="#005EA6" fontFamily="Montserrat, system-ui, sans-serif" fontWeight="900" fontSize="19" letterSpacing="-0.5">LocknLock</text>
      </svg>
    ),
  },
  {
    id: "phuclong",
    name: "Phúc Long Tea & Coffee",
    category: "Chuỗi F&B Cao cấp",
    svg: (
      <svg viewBox="0 0 195 44" className="h-10 sm:h-12 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="22" r="15" fill="#0C5A37"/>
        <path d="M15 27C15 19.5 20 14.5 26.5 16C25 22 20 27 15 27Z" fill="#F8C300"/>
        <text x="44" y="23" fill="#0C5A37" fontFamily="Montserrat, system-ui, sans-serif" fontWeight="900" fontSize="16" letterSpacing="0.8">PHÚC LONG</text>
        <text x="44" y="33" fill="#A47C48" fontFamily="Montserrat, system-ui, sans-serif" fontWeight="700" fontSize="9" letterSpacing="1.8">TEA & COFFEE</text>
      </svg>
    ),
  },
  {
    id: "ncb",
    name: "NCB Bank",
    category: "Ngân hàng TMCP Quốc Dân",
    svg: (
      <svg viewBox="0 0 145 44" className="h-10 sm:h-12 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 22L20 10L32 22L20 34Z" fill="#0054A6"/>
        <path d="M20 15L27 22L20 29L13 22Z" fill="#00AEEF"/>
        <text x="42" y="30" fill="#0054A6" fontFamily="Montserrat, system-ui, sans-serif" fontWeight="900" fontSize="24" letterSpacing="1.5">NCB</text>
      </svg>
    ),
  },
  {
    id: "digiworld",
    name: "Digiworld (DGW)",
    category: "Phân phối Công nghệ",
    svg: (
      <svg viewBox="0 0 175 44" className="h-10 sm:h-12 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 15C15 8 27 8 34 15" stroke="#F37021" strokeWidth="3.5" strokeLinecap="round"/>
        <path d="M13 27C18 32 24 32 29 27" stroke="#0054A6" strokeWidth="3" strokeLinecap="round"/>
        <text x="44" y="28" fill="#0054A6" fontFamily="Montserrat, system-ui, sans-serif" fontWeight="900" fontSize="19" letterSpacing="-0.5">digi<tspan fill="#F37021">world</tspan></text>
      </svg>
    ),
  },
  {
    id: "cenland",
    name: "Cen Land",
    category: "Bất động sản Cen Group",
    svg: (
      <svg viewBox="0 0 175 44" className="h-10 sm:h-12 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="6" y="8" width="28" height="28" rx="6" fill="#E30613"/>
        <text x="20" y="28" fill="#FFFFFF" fontFamily="Montserrat, system-ui, sans-serif" fontWeight="900" fontSize="17" textAnchor="middle">C</text>
        <text x="42" y="23" fill="#0A1E5E" fontFamily="Montserrat, system-ui, sans-serif" fontWeight="900" fontSize="16">CEN<tspan fill="#E30613">LAND</tspan></text>
        <text x="42" y="33" fill="#64748B" fontFamily="Montserrat, system-ui, sans-serif" fontWeight="700" fontSize="9" letterSpacing="1.2">BẤT ĐỘNG SẢN</text>
      </svg>
    ),
  },
  {
    id: "hust",
    name: "ĐH Bách Khoa Hà Nội",
    category: "Trường Đại học Bách Khoa",
    svg: (
      <svg viewBox="0 0 215 44" className="h-10 sm:h-12 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="22" r="15" fill="#B31B1B"/>
        <circle cx="20" cy="22" r="8" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="3 1.5"/>
        <path d="M20 9V35M7 22H33" stroke="#FFD700" strokeWidth="1.5"/>
        <text x="44" y="22" fill="#B31B1B" fontFamily="Montserrat, system-ui, sans-serif" fontWeight="900" fontSize="14">ĐH BÁCH KHOA</text>
        <text x="44" y="33" fill="#64748B" fontFamily="Montserrat, system-ui, sans-serif" fontWeight="800" fontSize="10" letterSpacing="0.8">HÀ NỘI • HUST</text>
      </svg>
    ),
  },
  {
    id: "neu",
    name: "ĐH Kinh tế Quốc dân",
    category: "Trường ĐH Kinh tế Quốc dân",
    svg: (
      <svg viewBox="0 0 215 44" className="h-10 sm:h-12 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="22" r="15" fill="#004890"/>
        <path d="M20 12C17.5 17 16 19.5 20 27C24 19.5 22.5 17 20 12Z" fill="#FFD700"/>
        <text x="44" y="22" fill="#004890" fontFamily="Montserrat, system-ui, sans-serif" fontWeight="900" fontSize="14">ĐH KINH TẾ</text>
        <text x="44" y="33" fill="#00AEEF" fontFamily="Montserrat, system-ui, sans-serif" fontWeight="800" fontSize="10" letterSpacing="0.8">QUỐC DÂN • NEU</text>
      </svg>
    ),
  },
  {
    id: "vnu",
    name: "Đại học Quốc gia Hà Nội",
    category: "ĐHQG Hà Nội",
    svg: (
      <svg viewBox="0 0 215 44" className="h-10 sm:h-12 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="22" r="15" fill="#0054A5"/>
        <path d="M12 18L20 13L28 18L20 23Z" fill="#F8C300"/>
        <text x="44" y="22" fill="#0054A5" fontFamily="Montserrat, system-ui, sans-serif" fontWeight="900" fontSize="14">ĐH QUỐC GIA</text>
        <text x="44" y="33" fill="#64748B" fontFamily="Montserrat, system-ui, sans-serif" fontWeight="800" fontSize="10" letterSpacing="0.8">HÀ NỘI • VNU</text>
      </svg>
    ),
  },
  {
    id: "nhi-tw",
    name: "Bệnh viện Nhi Trung ương",
    category: "Bệnh viện Tuyến đầu",
    svg: (
      <svg viewBox="0 0 215 44" className="h-10 sm:h-12 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="22" r="15" fill="#0072BC"/>
        <path d="M20 14V30M12 22H28" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round"/>
        <text x="44" y="22" fill="#0072BC" fontFamily="Montserrat, system-ui, sans-serif" fontWeight="900" fontSize="14">BỆNH VIỆN NHI</text>
        <text x="44" y="33" fill="#E31B23" fontFamily="Montserrat, system-ui, sans-serif" fontWeight="800" fontSize="10" letterSpacing="0.8">TRUNG ƯƠNG</text>
      </svg>
    ),
  },
  {
    id: "tw-doan",
    name: "Trung ương Đoàn TNCS HCM",
    category: "Cơ quan Trung ương",
    svg: (
      <svg viewBox="0 0 225 44" className="h-10 sm:h-12 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="22" r="15" fill="#D40000"/>
        <path d="M12 25L16 14L25 18L21 27Z" fill="#008000"/>
        <circle cx="20" cy="22" r="4" fill="#FFD700"/>
        <text x="44" y="22" fill="#D40000" fontFamily="Montserrat, system-ui, sans-serif" fontWeight="900" fontSize="13.5">TW ĐOÀN TNCS</text>
        <text x="44" y="33" fill="#008000" fontFamily="Montserrat, system-ui, sans-serif" fontWeight="800" fontSize="10" letterSpacing="0.8">HỒ CHÍ MINH</text>
      </svg>
    ),
  },
  {
    id: "duongbo",
    name: "Tổng Cục Đường Bộ VN",
    category: "Bộ Giao thông Vận tải",
    svg: (
      <svg viewBox="0 0 225 44" className="h-10 sm:h-12 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="22" r="15" fill="#005DAA"/>
        <path d="M15 30L19 14H21L25 30" stroke="#FFFFFF" strokeWidth="2"/>
        <path d="M20 18V26" stroke="#FFD700" strokeWidth="2" strokeDasharray="1.5 1.5"/>
        <text x="44" y="22" fill="#005DAA" fontFamily="Montserrat, system-ui, sans-serif" fontWeight="900" fontSize="13.5">TỔNG CỤC ĐƯỜNG BỘ</text>
        <text x="44" y="33" fill="#64748B" fontFamily="Montserrat, system-ui, sans-serif" fontWeight="800" fontSize="10" letterSpacing="0.8">BỘ GIAO THÔNG VẬN TẢI</text>
      </svg>
    ),
  },
];

export function PartnerLogoMarquee() {
  // Nhân đôi mảng để animation cuộn vô tận mượt mà không bị ngắt quãng
  const doubledBrands = [...PARTNER_BRANDS, ...PARTNER_BRANDS];

  return (
    <div className="relative w-full overflow-hidden py-1 select-none group">
      {/* 2 dải gradient che mờ 2 bên mép để logo trôi vào/ra mềm mại */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-28 bg-gradient-to-r from-slate-50 via-slate-50/90 to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-28 bg-gradient-to-l from-slate-50 via-slate-50/90 to-transparent z-10" />

      {/* Dải logo chạy liên tục */}
      <div className="flex w-max items-center gap-4 sm:gap-6 animate-logo-ticker group-hover:[animation-play-state:paused]">
        {doubledBrands.map((brand, idx) => (
          <div
            key={`${brand.id}-${idx}`}
            className="flex items-center justify-center h-15 sm:h-18 px-5 sm:px-7 rounded-xl sm:rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-[#D4AF37] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer shrink-0 min-w-[175px] sm:min-w-[215px]"
            title={`${brand.name} - ${brand.category}`}
          >
            {brand.svg}
          </div>
        ))}
      </div>
    </div>
  );
}
