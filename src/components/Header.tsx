"use client";

import React, { useState } from "react";
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
  LogIn,
  Radar,
  Users,
} from "lucide-react";
import { trackLandingLead } from "@/app/admin-radar/lead-tracker";

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Trang Chủ", icon: Calendar },
    { href: "/ve-chung-toi", label: "Giới Thiệu", icon: Users },
    { href: "/dich-vu", label: "Dịch Vụ Sự Kiện & Tour", icon: Compass },
    { href: "/tin-tuc", label: "Tin Tức & Cẩm Nang", icon: FileText },
  ];

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname?.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0A1E5E] text-white shadow-xl border-b border-[#D4AF37]/30 backdrop-blur-md">
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
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#D4AF37] via-[#F5E08B] to-[#997A15] p-0.5 shadow-lg group-hover:scale-105 transition-transform duration-300">
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
              <span className="font-bold text-lg md:text-xl tracking-tight text-white group-hover:text-[#D4AF37] transition-colors leading-tight">
                TRƯỜNG HẢI
              </span>
              <span className="text-[11px] uppercase tracking-widest text-[#D4AF37] font-semibold">
                EVENT & TRAVEL
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center space-x-1">
            {navLinks.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center whitespace-nowrap px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${active
                      ? "bg-[#D4AF37] text-[#0A1E5E] font-bold shadow-md shadow-[#D4AF37]/20"
                      : "text-slate-200 hover:text-white hover:bg-white/10"
                    }`}
                >
                  <Icon className="w-4 h-4 mr-1.5 opacity-80" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden md:flex shrink-0 items-center space-x-3 whitespace-nowrap">
            {/* Radar SEO internal tool link */}
            <Link
              href="/admin-radar"
              className={`hidden 2xl:flex items-center px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wide border transition-all duration-200 ${isActive("/admin-radar")
                  ? "bg-[#06123B] text-[#D4AF37] border-[#D4AF37]"
                  : "bg-white/5 border-white/20 text-slate-200 hover:border-[#D4AF37] hover:text-[#D4AF37]"
                }`}
            >
              <Radar className="w-4 h-4 mr-1.5 text-[#D4AF37] animate-spin [animation-duration:6s]" />
              Radar SEO AI
            </Link>
            {/* Quote Request CTA */}
            {/* Quote Request CTA */}
            <Link
              href="/dich-vu#bao-gia"
              className="flex items-center px-4 py-2 rounded-lg text-sm font-bold bg-gradient-to-r from-[#D4AF37] to-[#e5c053] hover:from-[#e5c053] hover:to-[#D4AF37] text-[#0A1E5E] shadow-lg shadow-[#D4AF37]/30 hover:scale-105 transition-all duration-200"
            >
              <span>Nhận Báo Giá</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
            <Link
              href="/login"
              className="flex items-center px-3.5 py-2 rounded-lg text-sm font-semibold tracking-wide border border-white/20 bg-white/5 text-slate-200 transition-all duration-200 hover:border-[#D4AF37] hover:text-[#D4AF37]"
            >
              <LogIn className="w-4 h-4 mr-1.5" />
              Đăng nhập
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex xl:hidden items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-200 hover:text-white hover:bg-white/10"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <Link
              href="/login"
              className="md:hidden p-2 rounded-lg bg-white/5 text-[#D4AF37] border border-[#D4AF37]/40"
              title="Đăng nhập"
              aria-label="Đăng nhập quản trị"
            >
              <LogIn className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#06123B] border-t border-white/10 px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2 duration-200">
          <div className="py-2 text-xs text-[#D4AF37] font-medium border-b border-white/10 flex items-center">
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            {COMPANY_INFO.slogan}
          </div>

          {navLinks.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center px-3 py-2.5 rounded-lg text-base font-medium ${active
                    ? "bg-[#D4AF37] text-[#0A1E5E] font-bold"
                    : "text-slate-200 hover:bg-white/5"
                  }`}
              >
                <Icon className="w-5 h-5 mr-3 opacity-80" />
                {item.label}
              </Link>
            );
          })}

          <Link
            href="/admin-radar"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center px-3 py-2.5 rounded-lg text-base font-medium text-slate-200 hover:bg-white/5"
          >
            <Radar className="w-5 h-5 mr-3 text-[#D4AF37]" />
            Radar SEO AI
          </Link>

          <Link
            href="/login"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center px-3 py-2.5 rounded-lg text-base font-semibold text-[#D4AF37] bg-white/5 border border-[#D4AF37]/30"
          >
            <LogIn className="w-5 h-5 mr-3 text-[#D4AF37]" />
            Đăng nhập
          </Link>

          <div className="pt-3 border-t border-white/10 space-y-2">
            <a
              href={`tel:${COMPANY_INFO.hotline}`}
              onClick={() => trackLandingLead("HOTLINE")}
              className="flex items-center justify-center w-full py-2.5 rounded-lg bg-[#D4AF37] text-[#0A1E5E] font-bold text-sm shadow-md"
            >
              <Phone className="w-4 h-4 mr-2" />
              Gọi Hotline: {COMPANY_INFO.hotlineDisplay}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
