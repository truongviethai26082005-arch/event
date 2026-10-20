"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { COMPANY_INFO } from "@/lib/company-data";
import {
  Phone,
  Radar,
  Menu,
  X,
  Sparkles,
  Calendar,
  Compass,
  FileText,
  ChevronRight,
  Users,
} from "lucide-react";

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo / Brand Name */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#D4AF37] via-[#F5E08B] to-[#997A15] p-0.5 shadow-lg group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-[#0A1E5E] rounded-[10px] flex items-center justify-center">
                <span className="font-extrabold text-xl text-[#D4AF37] tracking-wider">
                  TH
                </span>
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
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${active
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

          {/* Action CTAs: Hotline + Radar SEO */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Radar SEO internal tool link */}
            <Link
              href="/admin-radar"
              className={`flex items-center px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wide border transition-all duration-200 ${isActive("/admin-radar")
                  ? "bg-[#06123B] text-[#D4AF37] border-[#D4AF37]"
                  : "bg-white/5 border-white/20 text-slate-200 hover:border-[#D4AF37] hover:text-[#D4AF37]"
                }`}
            >
              <Radar className="w-4 h-4 mr-1.5 text-[#D4AF37] animate-spin [animation-duration:6s]" />
              Radar SEO AI
            </Link>

            {/* Quote Request CTA */}
            <Link
              href="/dich-vu#bao-gia"
              className="flex items-center px-4 py-2 rounded-lg text-sm font-bold bg-gradient-to-r from-[#D4AF37] to-[#e5c053] hover:from-[#e5c053] hover:to-[#D4AF37] text-[#0A1E5E] shadow-lg shadow-[#D4AF37]/30 hover:scale-105 transition-all duration-200"
            >
              <span>Nhận Báo Giá</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-2">
            <Link
              href="/admin-radar"
              className="p-2 rounded-lg bg-white/5 text-[#D4AF37] border border-[#D4AF37]/40"
              title="Radar SEO"
            >
              <Radar className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-200 hover:text-white hover:bg-white/10"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#06123B] border-t border-white/10 px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2 duration-200">
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
            className="flex items-center px-3 py-2.5 rounded-lg text-base font-semibold text-[#D4AF37] bg-white/5 border border-[#D4AF37]/30"
          >
            <Radar className="w-5 h-5 mr-3 text-[#D4AF37]" />
            Công cụ Nội bộ Radar SEO
          </Link>

          <div className="pt-3 border-t border-white/10 space-y-2">
            <a
              href={`tel:${COMPANY_INFO.hotline}`}
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
