"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { COMPANY_INFO } from "@/lib/company-data";
import {
  Phone,
  Menu,
  X,
  Sparkles,
  Calendar,
  Compass,
  FileText,
  ChevronRight,
  ChevronDown,
  Users,
  Building2,
  PartyPopper,
  Mic2,
  Bus,
  ShieldCheck,
  Eye,
  History,
  Flame,
  BookOpen,
} from "lucide-react";
import { trackLandingLead } from "@/app/admin-radar/lead-tracker";

interface SubItem {
  href: string;
  label: string;
  desc?: string;
  icon: any;
  badge?: string;
}

interface NavItem {
  id: string;
  href: string;
  label: string;
  icon: any;
  isMega?: boolean;
  dropdown?: {
    simple?: SubItem[];
    columns?: {
      title: string;
      icon: any;
      items: SubItem[];
    }[];
  };
}

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [openMobileSubmenu, setOpenMobileSubmenu] = useState<string | null>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (id: string) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setActiveDropdown(id);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 180);
  };

  const toggleMobileSubmenu = (id: string) => {
    setOpenMobileSubmenu(openMobileSubmenu === id ? null : id);
  };

  // Cấu trúc Menu & Menu thả xuống (Dropdown / Megamenu)
  const navItems: NavItem[] = [
    {
      id: "trang-chu",
      href: "/",
      label: "Trang Chủ",
      icon: Calendar,
      dropdown: {
        simple: [
          {
            href: "/",
            label: "Trang Chủ Chính",
            desc: "Tổng quan sự kiện & du lịch Trường Hải",
            icon: Building2,
          },
          {
            href: "/#nang-luc",
            label: "Năng Lực Thiết Bị Sự Kiện",
            desc: "Làm chủ 100% kho âm thanh, ánh sáng & LED",
            icon: Mic2,
          },
          {
            href: "/#doi-tac",
            label: "Khách Hàng & Đối Tác Lớn",
            desc: "Đoàn thể, trường đại học & tập đoàn tin cậy",
            icon: Users,
          },
          {
            href: "/dich-vu#bao-gia",
            label: "Báo Giá Nhanh 24/7",
            desc: "Nhận dự toán chi phí chi tiết sau 30 phút",
            icon: Sparkles,
            badge: "Miễn phí",
          },
        ],
      },
    },
    {
      id: "gioi-thieu",
      href: "/ve-chung-toi",
      label: "Giới Thiệu",
      icon: Users,
      dropdown: {
        simple: [
          {
            href: "/ve-chung-toi",
            label: "Về Trường Hải Event & Travel",
            desc: "Hồ sơ năng lực & vị thế đơn vị tổ chức 10+ năm",
            icon: Building2,
          },
          {
            href: "/ve-chung-toi#tam-nhin",
            label: "Tầm Nhìn & Sứ Mệnh",
            desc: "Giá trị cốt lõi kiến tạo thành công bền vững",
            icon: Eye,
          },
          {
            href: "/ve-chung-toi#lich-su",
            label: "Hành Trình & Cột Mốc",
            desc: "Lịch sử hơn 500+ đại lễ thành công",
            icon: History,
          },
          {
            href: "/ve-chung-toi#lanh-dao",
            label: "Ban Lãnh Đạo & Chuyên Gia",
            desc: "Đội ngũ đạo diễn, kỹ thuật nòng cốt",
            icon: Users,
          },
          {
            href: "/ve-chung-toi#phap-ly",
            label: "Pháp Lý & 100+ Đối Tác",
            desc: "MST 0111601327 minh bạch & đối tác trọng điểm",
            icon: ShieldCheck,
          },
        ],
      },
    },
    {
      id: "dich-vu",
      href: "/dich-vu",
      label: "Dịch Vụ Sự Kiện & Tour",
      icon: Compass,
      isMega: true,
      dropdown: {
        columns: [
          {
            title: "MẢNG TỔ CHỨC SỰ KIỆN",
            icon: PartyPopper,
            items: [
              {
                href: "/dich-vu#su-kien",
                label: "Khai Trương, Khánh Thành & Khởi Công",
                desc: "Quy trình chuẩn chỉ, lân sư rồng, cắt băng trang trọng",
                icon: Building2,
                badge: "Hot",
              },
              {
                href: "/dich-vu#su-kien",
                label: "Year End Party & Gala Dinner",
                desc: "Ý tưởng độc bản, âm thanh ánh sáng bùng nổ cảm xúc",
                icon: PartyPopper,
                badge: "Mùa YEP",
              },
              {
                href: "/dich-vu#su-kien",
                label: "Hội Nghị, Hội Thảo & Mở Bán BĐS",
                desc: "Hệ thống check-in QR, visual LED P2.5 chuyên nghiệp",
                icon: Mic2,
              },
              {
                href: "/dich-vu#su-kien",
                label: "Trung Thu, Ngày Hội Gia Đình & Họp Lớp",
                desc: "Gian hàng trò chơi dân gian, xiếc ảo thuật ấm cúng",
                icon: Sparkles,
              },
              {
                href: "/dich-vu#su-kien",
                label: "Cho Thuê Âm Thanh, Ánh Sáng & Màn LED",
                desc: "Loa Line Array công suất lớn, Moving Beam nhập khẩu",
                icon: Mic2,
              },
            ],
          },
          {
            title: "MẢNG DU LỊCH & BÁO GIÁ",
            icon: Compass,
            items: [
              {
                href: "/dich-vu#du-lich",
                label: "Tour Doanh Nghiệp & Team Building",
                desc: "Hạ Long, Đà Nẵng, Phú Quốc - may đo theo ngân sách",
                icon: Compass,
                badge: "Trọn gói",
              },
              {
                href: "/dich-vu#du-lich",
                label: "Cho Thuê Xe Du Lịch Đời Mới",
                desc: "Dàn xe 16 - 45 chỗ hiện đại, tài xế chuyên nghiệp",
                icon: Bus,
              },
              {
                href: "/dich-vu#khuyen-mai",
                label: "Combo Ưu Đãi Sự Kiện 2024",
                desc: "Tiết kiệm đến 30% khi đặt trọn gói âm thanh ánh sáng",
                icon: Flame,
                badge: "Tiết kiệm 30%",
              },
              {
                href: "/dich-vu#bao-gia",
                label: "Dự Toán Báo Giá Trực Tuyến",
                desc: "Tính toán chi phí & nhận tư vấn chuyên viên 1-1",
                icon: FileText,
              },
            ],
          },
        ],
      },
    },
    {
      id: "tin-tuc",
      href: "/tin-tuc",
      label: "Tin Tức & Cẩm Nang",
      icon: FileText,
      dropdown: {
        simple: [
          {
            href: "/tin-tuc",
            label: "Tất Cả Bài Viết Mới Nhất",
            desc: "Cập nhật hoạt động sự kiện & cẩm nang hữu ích",
            icon: BookOpen,
          },
          {
            href: "/tin-tuc?cat=khai-truong",
            label: "Cẩm Nang Khai Trương & Khánh Thành",
            desc: "Kịch bản, quy trình, văn khấn & kinh nghiệm tổ chức",
            icon: Building2,
          },
          {
            href: "/tin-tuc?cat=year-end-party",
            label: "Ý Tưởng Year End Party & Gala",
            desc: "Tổng hợp concept độc đáo và kịch bản tiệc cuối năm",
            icon: PartyPopper,
          },
          {
            href: "/tin-tuc?cat=team-building",
            label: "Kinh Nghiệm Team Building & Tour",
            desc: "Địa điểm hot và trò chơi gắn kết nội bộ hiệu quả",
            icon: Compass,
          },
          {
            href: "/tin-tuc?cat=hoi-nghi",
            label: "Tổ Chức Hội Nghị & Hội Thảo",
            desc: "Checklist chi tiết quản trị rủi ro sự kiện hội nghị",
            icon: Mic2,
          },
        ],
      },
    },
  ];

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname?.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 text-slate-800 shadow-lg border-b border-slate-200/90 backdrop-blur-md">
      {/* Top bar info */}
      <div className="bg-[#06123B] border-b border-white/10 text-xs py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-slate-300">
          <div className="flex items-center space-x-6">
            <span className="flex items-center text-[#D4AF37] font-medium">
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-[#D4AF37] animate-pulse" />
              {COMPANY_INFO.slogan}
            </span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-300">MST: {COMPANY_INFO.taxId}</span>
          </div>
          <div className="flex items-center space-x-4">
            <a
              href={`tel:${COMPANY_INFO.hotline}`}
              onClick={() => trackLandingLead("HOTLINE")}
              className="flex items-center text-[#D4AF37] hover:underline font-semibold"
            >
              <Phone className="w-3.5 h-3.5 mr-1" />
              Hotline 24/7: {COMPANY_INFO.hotlineDisplay}
            </a>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300">Hà Nội & Toàn Quốc</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl 2xl:max-w-[96rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo / Brand Name */}
          <Link href="/" className="flex shrink-0 items-center space-x-3 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#D4AF37] via-[#F5E08B] to-[#997A15] p-0.5 shadow-md group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center overflow-hidden">
                <Image
                  src="/images/logo.png"
                  alt="Logo Trường Hải Event & Travel"
                  width={96}
                  height={96}
                  priority
                  className="w-full h-full object-contain scale-125"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg md:text-xl tracking-tight text-[#0A1E5E] group-hover:text-[#D4AF37] transition-colors leading-tight">
                TRƯỜNG HẢI
              </span>
              <span className="text-[11px] uppercase tracking-widest text-[#B8860B] font-bold">
                EVENT & TRAVEL
              </span>
            </div>
          </Link>

          {/* Desktop Navigation with Dropdowns */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              const hasDropdown = Boolean(item.dropdown);
              const isOpen = activeDropdown === item.id;

              return (
                <div
                  key={item.id}
                  className="relative group"
                  onMouseEnter={() => handleMouseEnter(item.id)}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link
                    href={item.href}
                    className={`flex items-center whitespace-nowrap px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                      active
                        ? "bg-[#D4AF37] text-[#0A1E5E] font-bold shadow-md shadow-[#D4AF37]/30"
                        : "text-slate-700 hover:text-[#0A1E5E] hover:bg-slate-100"
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-1.5 opacity-80" />
                    <span>{item.label}</span>
                    {hasDropdown && (
                      <ChevronDown
                        className={`w-3.5 h-3.5 ml-1 transition-transform duration-200 ${
                          isOpen ? "rotate-180 text-[#0A1E5E]" : "opacity-60"
                        }`}
                      />
                    )}
                  </Link>

                  {/* Dropdown Menu Container */}
                  {hasDropdown && isOpen && (
                    <div
                      className={`absolute top-full pt-2 z-50 animate-in fade-in-0 zoom-in-95 duration-150 ${
                        item.isMega
                          ? "w-[580px] -left-16 xl:-left-12"
                          : "w-72 left-0"
                      }`}
                    >
                      <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 border-t-2 border-t-[#D4AF37] p-2.5 text-slate-800">
                        {/* Standard Dropdown */}
                        {item.dropdown?.simple && (
                          <div className="space-y-0.5">
                            {item.dropdown.simple.map((sub) => {
                              const SubIcon = sub.icon;
                              return (
                                <Link
                                  key={sub.href}
                                  href={sub.href}
                                  onClick={() => setActiveDropdown(null)}
                                  className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-amber-50/80 group/item transition-colors duration-150"
                                >
                                  <div className="w-8 h-8 rounded-lg bg-amber-100/70 text-[#0A1E5E] flex items-center justify-center shrink-0 group-hover/item:bg-[#D4AF37] group-hover/item:text-white transition-colors">
                                    <SubIcon className="w-4 h-4" />
                                  </div>
                                  <span className="text-sm font-semibold text-slate-700 group-hover/item:text-[#0A1E5E] transition-colors truncate flex-1 min-w-0">
                                    {sub.label}
                                  </span>
                                  {sub.badge && (
                                    <span className="ml-auto px-1.5 py-0.5 text-[10px] font-extrabold bg-[#D4AF37] text-[#0A1E5E] rounded shrink-0">
                                      {sub.badge}
                                    </span>
                                  )}
                                </Link>
                              );
                            })}
                          </div>
                        )}

                        {/* Mega Dropdown (2 Columns) */}
                        {item.dropdown?.columns && (
                          <div>
                            <div className="grid grid-cols-2 gap-3 p-1">
                              {item.dropdown.columns.map((col, idx) => {
                                const ColIcon = col.icon;
                                return (
                                  <div key={idx} className="space-y-0.5">
                                    <div className="flex items-center gap-1.5 px-2 py-1 text-xs font-extrabold text-[#0A1E5E] border-b border-slate-100 uppercase tracking-wider mb-1">
                                      <ColIcon className="w-3.5 h-3.5 text-[#D4AF37]" />
                                      <span>{col.title}</span>
                                    </div>
                                    {col.items.map((sub) => {
                                      const SubIcon = sub.icon;
                                      return (
                                        <Link
                                          key={sub.href}
                                          href={sub.href}
                                          onClick={() => setActiveDropdown(null)}
                                          className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl hover:bg-amber-50/80 group/sub transition-colors duration-150"
                                        >
                                          <div className="w-7 h-7 rounded-lg bg-amber-100/60 text-[#0A1E5E] flex items-center justify-center shrink-0 group-hover/sub:bg-[#D4AF37] group-hover/sub:text-white transition-colors">
                                            <SubIcon className="w-3.5 h-3.5" />
                                          </div>
                                          <span className="text-xs font-semibold text-slate-700 group-hover/sub:text-[#0A1E5E] transition-colors flex-1 min-w-0 truncate">
                                            {sub.label}
                                          </span>
                                          {sub.badge && (
                                            <span className="ml-auto px-1.5 py-0.5 text-[9px] font-extrabold bg-gradient-to-r from-amber-400 to-[#D4AF37] text-[#0A1E5E] rounded-full shrink-0">
                                              {sub.badge}
                                            </span>
                                          )}
                                        </Link>
                                      );
                                    })}
                                  </div>
                                );
                              })}
                            </div>

                            {/* Bottom CTA Bar in Mega Menu */}
                            <div className="mt-2 pt-2 border-t border-slate-100 px-2 flex items-center justify-between text-xs text-slate-600 bg-slate-50/80 rounded-xl p-2">
                              <span className="flex items-center font-medium">
                                <Sparkles className="w-3.5 h-3.5 mr-1.5 text-[#D4AF37]" />
                                Tư vấn kịch bản & báo giá riêng cho doanh nghiệp:
                              </span>
                              <a
                                href={`tel:${COMPANY_INFO.hotline}`}
                                className="font-bold text-[#0A1E5E] hover:text-[#D4AF37] flex items-center transition-colors shrink-0 ml-2"
                              >
                                <Phone className="w-3 h-3 mr-1 text-[#D4AF37]" />
                                {COMPANY_INFO.hotlineDisplay}
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex shrink-0 items-center space-x-3 whitespace-nowrap">
            {/* Quote Request CTA */}
            <Link
              href="/dich-vu#bao-gia"
              className="flex items-center px-4 py-2.5 rounded-lg text-sm font-bold bg-gradient-to-r from-[#D4AF37] to-[#e5c053] hover:from-[#e5c053] hover:to-[#D4AF37] text-[#0A1E5E] shadow-md shadow-[#D4AF37]/30 hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              <span>Nhận Báo Giá</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer with Accordion Submenus */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 px-4 pt-3 pb-6 space-y-2 shadow-2xl animate-in slide-in-from-top-2 duration-200 max-h-[80vh] overflow-y-auto">
          <div className="py-2 text-xs text-[#B8860B] font-semibold border-b border-slate-100 flex items-center">
            <Sparkles className="w-3.5 h-3.5 mr-1.5 text-[#D4AF37]" />
            {COMPANY_INFO.slogan}
          </div>

          {navItems.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            const hasDropdown = Boolean(item.dropdown);
            const isSubOpen = openMobileSubmenu === item.id;

            return (
              <div key={item.id} className="border-b border-slate-100 last:border-0 pb-1">
                <div className="flex items-center justify-between">
                  <Link
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center flex-1 py-2.5 px-3 rounded-lg text-base font-semibold ${
                      active
                        ? "bg-[#D4AF37] text-[#0A1E5E] font-bold"
                        : "text-slate-800 hover:bg-slate-50"
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3 opacity-80" />
                    <span>{item.label}</span>
                  </Link>

                  {hasDropdown && (
                    <button
                      type="button"
                      onClick={() => toggleMobileSubmenu(item.id)}
                      className="p-2.5 text-slate-500 hover:text-[#0A1E5E] transition-transform"
                      aria-label={`Mở menu con của ${item.label}`}
                    >
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isSubOpen ? "rotate-180 text-[#0A1E5E]" : ""
                        }`}
                      />
                    </button>
                  )}
                </div>

                {/* Mobile Submenu Accordion */}
                {hasDropdown && isSubOpen && (
                  <div className="pl-6 pr-2 py-1 space-y-1 bg-slate-50/70 rounded-xl my-1 border-l-2 border-[#D4AF37]">
                    {/* If simple dropdown */}
                    {item.dropdown?.simple?.map((sub) => {
                      const SubIcon = sub.icon;
                      return (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center py-2 px-2 text-sm text-slate-700 hover:text-[#0A1E5E] font-medium rounded-lg hover:bg-white"
                        >
                          <SubIcon className="w-4 h-4 mr-2 text-[#D4AF37] shrink-0" />
                          <span className="truncate">{sub.label}</span>
                        </Link>
                      );
                    })}

                    {/* If columns/mega dropdown */}
                    {item.dropdown?.columns?.map((col, idx) => (
                      <div key={idx} className="pt-1">
                        <div className="text-[11px] font-extrabold text-[#0A1E5E] uppercase tracking-wider py-1 px-2">
                          {col.title}
                        </div>
                        {col.items.map((sub) => {
                          const SubIcon = sub.icon;
                          return (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              onClick={() => setMobileMenuOpen(false)}
                              className="flex items-center py-2 px-2 text-sm text-slate-700 hover:text-[#0A1E5E] font-medium rounded-lg hover:bg-white"
                            >
                              <SubIcon className="w-4 h-4 mr-2 text-[#D4AF37] shrink-0" />
                              <span className="truncate">{sub.label}</span>
                            </Link>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          <div className="pt-3 border-t border-slate-100 space-y-2">
            <Link
              href="/dich-vu#bao-gia"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center w-full py-2.5 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#e5c053] text-[#0A1E5E] font-bold text-sm shadow-md"
            >
              <span>Nhận Báo Giá Ngay</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
            <a
              href={`tel:${COMPANY_INFO.hotline}`}
<<<<<<< Updated upstream
              onClick={() => trackLandingLead("HOTLINE")}
              className="flex items-center justify-center w-full py-2.5 rounded-lg bg-[#D4AF37] text-[#0A1E5E] font-bold text-sm shadow-md"
=======
              className="flex items-center justify-center w-full py-2.5 rounded-lg bg-slate-100 text-[#0A1E5E] hover:bg-slate-200 font-bold text-sm border border-slate-200"
>>>>>>> Stashed changes
            >
              <Phone className="w-4 h-4 mr-2 text-[#D4AF37]" />
              Gọi Hotline: {COMPANY_INFO.hotlineDisplay}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

