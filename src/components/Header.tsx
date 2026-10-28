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
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { trackLandingLead } from "@/app/admin-radar/lead-tracker";

interface SubItem {
  href: string;
  label: string;
  desc?: string;
  badge?: string;
}

interface NavItem {
  id: string;
  href: string;
  label: string;
  isMega?: boolean;
  dropdown?: {
    simple?: SubItem[];
    columns?: {
      title: string;
      items: SubItem[];
    }[];
  };
}

export default function Header() {
  const pathname = usePathname();
  const isAdminPage = Boolean(
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/admin-radar") ||
    pathname?.startsWith("/admin-login") ||
    pathname === "/login"
  );
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

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);

    if (href.includes("#")) {
      const [targetPath, targetHash] = href.split("#");
      const currentPath = pathname;
      const isSamePage = targetPath === "" || targetPath === currentPath;

      if (isSamePage && targetHash) {
        e.preventDefault();
        window.history.pushState(null, "", `#${targetHash}`);
        window.dispatchEvent(new Event("hashchange"));
        window.dispatchEvent(new CustomEvent("profile-navigate", { detail: targetHash }));

        const scrollToTarget = () => {
          const element =
            document.getElementById(targetHash) ||
            document.getElementById("profile-viewer-container");
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        };

        scrollToTarget();
        setTimeout(scrollToTarget, 100);
      }
    } else if (href === pathname) {
      e.preventDefault();
      window.history.pushState(null, "", pathname);
      window.dispatchEvent(new Event("hashchange"));
      window.dispatchEvent(new CustomEvent("profile-navigate", { detail: "toan-bo" }));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Cấu trúc Menu & Menu thả xuống (Dropdown / Megamenu)
  const navItems: NavItem[] = [
    {
      id: "trang-chu",
      href: "/",
      label: "Trang Chủ",
    },
    {
      id: "gioi-thieu",
      href: "/ve-chung-toi",
      label: "Giới Thiệu",
      dropdown: {
        simple: [
          {
            href: "/ve-chung-toi",
            label: "Về Trường Hải Event & Travel",
            desc: "Hồ sơ năng lực & vị thế đơn vị tổ chức 10+ năm",
          },
          {
            href: "/ve-chung-toi#tam-nhin",
            label: "Tầm Nhìn & Sứ Mệnh",
            desc: "Giá trị cốt lõi kiến tạo thành công bền vững",
          },
          {
            href: "/ve-chung-toi#lich-su",
            label: "Hành Trình & Cột Mốc",
            desc: "Lịch sử hơn 500+ đại lễ thành công",
          },
          {
            href: "/ve-chung-toi#lanh-dao",
            label: "Ban Lãnh Đạo & Chuyên Gia",
            desc: "Đội ngũ đạo diễn, kỹ thuật nòng cốt",
          },
          {
            href: "/ve-chung-toi#phap-ly",
            label: "Pháp Lý & 100+ Đối Tác",
            desc: "MST 0111601327 minh bạch & đối tác trọng điểm",
          },
        ],
      },
    },
    {
      id: "dich-vu",
      href: "/dich-vu",
      label: "Dịch Vụ Sự Kiện & Tour",
      dropdown: {
        simple: [
          {
            href: "/dich-vu#su-kien",
            label: "Sự Kiện",
            desc: "Tổ chức sự kiện trọn gói doanh nghiệp",
          },
          {
            href: "/dich-vu#du-lich",
            label: "Dịch Vụ - Tour",
            desc: "Tour doanh nghiệp, team building & xe du lịch",
          },
          {
            href: "/dich-vu#bao-gia",
            label: "Báo Giá",
            desc: "Dự toán chi phí & kịch bản nhanh 30 phút",
          },
        ],
      },
    },
    {
      id: "ho-so-nang-luc",
      href: "/ho-so-nang-luc",
      label: "Hồ Sơ Năng Lực",
      dropdown: {
        simple: [
          {
            href: "/ho-so-nang-luc#toan-bo",
            label: "Toàn Bộ E-Profile Năng Lực",
            desc: "Bản slide deck & báo cáo tổng quan chuẩn B2B",
          },
          {
            href: "/ho-so-nang-luc#phap-ly",
            label: "Pháp Lý, ĐKKD & Hồ Sơ Dự Thầu",
            desc: "MST 0111601327, chứng chỉ an toàn TCVN, bảo hiểm sự kiện",
          },
          {
            href: "/ho-so-nang-luc#nhan-su",
            label: "Sơ Đồ Nhân Sự & Đạo Diễn Sân Khấu",
            desc: "Cơ cấu tổ chức và đạo diễn nghệ thuật 10+ năm",
          },
          {
            href: "/ho-so-nang-luc#tai-profile",
            label: "Tải Hồ Sơ PDF & Nhận Bản In",
            desc: "Xuất bản PDF 300DPI hoặc nhận bản in chuyển phát tận nơi",
          },
        ],
      },
    },
    {
      id: "tin-tuc",
      href: "/tin-tuc",
      label: "Tin Tức & Cẩm Nang",
      dropdown: {
        simple: [
          {
            href: "/tin-tuc",
            label: "Tất Cả Bài Viết Mới Nhất",
            desc: "Cập nhật hoạt động sự kiện & cẩm nang hữu ích",
          },
          {
            href: "/tin-tuc?cat=khai-truong",
            label: "Cẩm Nang Khai Trương & Khánh Thành",
            desc: "Kịch bản, quy trình, văn khấn & kinh nghiệm tổ chức",
          },
          {
            href: "/tin-tuc?cat=year-end-party",
            label: "Ý Tưởng Year End Party & Gala",
            desc: "Tổng hợp concept độc đáo và kịch bản tiệc cuối năm",
          },
          {
            href: "/tin-tuc?cat=team-building",
            label: "Kinh Nghiệm Team Building & Tour",
            desc: "Địa điểm hot và trò chơi gắn kết nội bộ hiệu quả",
          },
          {
            href: "/tin-tuc?cat=hoi-nghi",
            label: "Tổ Chức Hội Nghị & Hội Thảo",
            desc: "Checklist chi tiết quản trị rủi ro sự kiện hội nghị",
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
              <span className="font-extrabold text-lg md:text-xl xl:text-2xl tracking-tight text-[#0A1E5E] group-hover:text-[#D4AF37] transition-colors leading-tight">
                TRƯỜNG HẢI
              </span>
              <span className="text-[11px] xl:text-xs uppercase tracking-widest text-[#B8860B] font-bold">
                EVENT & TRAVEL
              </span>
            </div>
          </Link>

          {!isAdminPage && (
            <>
              {/* Desktop Navigation with Dropdowns */}
              <nav className="hidden lg:flex flex-1 items-center justify-center lg:space-x-1.5 xl:space-x-0 xl:justify-evenly mx-2 xl:mx-6 2xl:mx-10 max-w-5xl 2xl:max-w-6xl">
            {navItems.map((item) => {
              const active = isActive(item.href);
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
                    onClick={(e) => handleNavClick(e, item.href)}
                    className={`flex items-center whitespace-nowrap px-3 xl:px-4 2xl:px-5 py-2.5 rounded-xl text-[14.5px] xl:text-[16px] 2xl:text-[17px] font-bold tracking-tight transition-all duration-200 ${
                      active
                        ? "bg-[#0A1E5E] text-[#D4AF37] shadow-md ring-1 ring-[#D4AF37]/30"
                        : "text-slate-700 hover:text-[#0A1E5E] hover:bg-slate-100/90"
                    }`}
                  >
                    <span>{item.label}</span>
                    {hasDropdown && (
                      <ChevronDown
                        className={`w-4 h-4 ml-1.5 transition-transform duration-200 ${
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
                          ? "w-[600px] left-1/2 -translate-x-1/2"
                          : item.id === "tin-tuc"
                          ? "w-80 sm:w-88 right-0"
                          : item.id === "gioi-thieu"
                          ? "w-80 sm:w-88 left-0"
                          : "w-80 sm:w-88 left-1/2 -translate-x-1/2"
                      }`}
                    >
                      <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 border-t-2 border-t-[#D4AF37] p-2.5 text-slate-800">
                        {/* Standard Dropdown */}
                        {item.dropdown?.simple && (
                          <div className="space-y-0.5">
                            {item.dropdown.simple.map((sub) => {
                              return (
                                <Link
                                  key={`${sub.href}-${sub.label}`}
                                  href={sub.href}
                                  onClick={(e) => handleNavClick(e, sub.href)}
                                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-amber-50/80 group/item transition-colors duration-150"
                                >
                                  <span className="text-sm font-semibold text-slate-700 group-hover/item:text-[#0A1E5E] transition-colors truncate flex-1 min-w-0">
                                    {sub.label}
                                  </span>
                                  {sub.badge && (
                                    <span className="ml-2 px-1.5 py-0.5 text-[10px] font-extrabold bg-[#D4AF37] text-[#0A1E5E] rounded shrink-0">
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
                                return (
                                  <div key={idx} className="space-y-0.5">
                                    <div className="px-2.5 py-1.5 text-xs font-extrabold text-[#0A1E5E] border-b border-slate-100 uppercase tracking-wider mb-1">
                                      <span>{col.title}</span>
                                    </div>
                                    {col.items.map((sub) => {
                                      return (
                                        <Link
                                          key={`${sub.href}-${sub.label}`}
                                          href={sub.href}
                                          onClick={(e) => handleNavClick(e, sub.href)}
                                          className="flex items-center justify-between px-2.5 py-2 rounded-xl hover:bg-amber-50/80 group/sub transition-colors duration-150"
                                        >
                                          <span className="text-xs font-semibold text-slate-700 group-hover/sub:text-[#0A1E5E] transition-colors flex-1 min-w-0 truncate">
                                            {sub.label}
                                          </span>
                                          {sub.badge && (
                                            <span className="ml-2 px-1.5 py-0.5 text-[9px] font-extrabold bg-gradient-to-r from-amber-400 to-[#D4AF37] text-[#0A1E5E] rounded-full shrink-0">
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
                              <span className="font-medium">
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
            {/* Quote Request CTA - Dài hơn, to hơn, nổi bật thu hút khách hàng */}
            <Link
              href="/dich-vu#bao-gia"
              onClick={(e) => handleNavClick(e, "/dich-vu#bao-gia")}
              className="relative min-w-[175px] sm:min-w-[200px] px-7 sm:px-9 py-3 sm:py-3.5 rounded-2xl font-black text-sm sm:text-base text-white bg-gradient-to-r from-[#DC2626] via-[#EA580C] to-[#D4AF37] shadow-xl shadow-orange-600/35 animate-cta-glow hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center uppercase tracking-wider text-center"
            >
              <span>Nhận Báo Giá</span>
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
            </>
          )}
        </div>
      </div>

      {/* Mobile Drawer with Accordion Submenus */}
      {!isAdminPage && mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 px-4 pt-3 pb-6 space-y-2 shadow-2xl animate-in slide-in-from-top-2 duration-200 max-h-[80vh] overflow-y-auto">
          <div className="py-2 text-xs text-[#B8860B] font-semibold border-b border-slate-100 flex items-center">
            <Sparkles className="w-3.5 h-3.5 mr-1.5 text-[#D4AF37]" />
            {COMPANY_INFO.slogan}
          </div>

          {navItems.map((item) => {
            const active = isActive(item.href);
            const hasDropdown = Boolean(item.dropdown);
            const isSubOpen = openMobileSubmenu === item.id;

            return (
              <div key={item.id} className="border-b border-slate-100 last:border-0 pb-1">
                <div className="flex items-center justify-between">
                  <Link
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className={`flex items-center flex-1 py-2.5 px-3 rounded-lg text-base font-semibold ${
                      active
                        ? "bg-[#D4AF37] text-[#0A1E5E] font-bold"
                        : "text-slate-800 hover:bg-slate-50"
                    }`}
                  >
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
                  <div className="pl-4 pr-2 py-1 space-y-1 bg-slate-50/70 rounded-xl my-1 border-l-2 border-[#D4AF37]">
                    {/* If simple dropdown */}
                    {item.dropdown?.simple?.map((sub) => {
                      return (
                        <Link
                          key={`mobile-${sub.href}-${sub.label}`}
                          href={sub.href}
                          onClick={(e) => handleNavClick(e, sub.href)}
                          className="flex items-center justify-between py-2 px-2.5 text-sm text-slate-700 hover:text-[#0A1E5E] font-medium rounded-lg hover:bg-white"
                        >
                          <span className="truncate">{sub.label}</span>
                          {sub.badge && (
                            <span className="ml-2 px-1.5 py-0.5 text-[9px] font-extrabold bg-[#D4AF37] text-[#0A1E5E] rounded shrink-0">
                              {sub.badge}
                            </span>
                          )}
                        </Link>
                      );
                    })}

                    {/* If columns/mega dropdown */}
                    {item.dropdown?.columns?.map((col, idx) => (
                      <div key={idx} className="pt-1">
                        <div className="text-[11px] font-extrabold text-[#0A1E5E] uppercase tracking-wider py-1 px-2.5">
                          {col.title}
                        </div>
                        {col.items.map((sub) => {
                          return (
                            <Link
                              key={`mobile-${sub.href}-${sub.label}`}
                              href={sub.href}
                              onClick={(e) => handleNavClick(e, sub.href)}
                              className="flex items-center justify-between py-2 px-2.5 text-sm text-slate-700 hover:text-[#0A1E5E] font-medium rounded-lg hover:bg-white"
                            >
                              <span className="truncate">{sub.label}</span>
                              {sub.badge && (
                                <span className="ml-2 px-1.5 py-0.5 text-[9px] font-extrabold bg-[#D4AF37] text-[#0A1E5E] rounded shrink-0">
                                  {sub.badge}
                                </span>
                              )}
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
              onClick={(e) => handleNavClick(e, "/dich-vu#bao-gia")}
              className="flex items-center justify-center w-full py-3 rounded-xl bg-gradient-to-r from-[#DC2626] via-[#EA580C] to-[#D4AF37] text-white font-extrabold text-sm shadow-md"
            >
              <span>Nhận Báo Giá Ngay</span>
            </Link>
            <a
              href={`tel:${COMPANY_INFO.hotline}`}
              onClick={() => trackLandingLead("HOTLINE")}
              className="flex items-center justify-center w-full py-2.5 rounded-lg bg-slate-100 text-[#0A1E5E] hover:bg-slate-200 font-bold text-sm border border-slate-200"
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

