"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Phone } from "lucide-react";
import { COMPANY_INFO } from "@/lib/company-data";
import { trackLandingLead } from "@/app/admin-radar/lead-tracker";

export default function FloatingContactWidget() {
  const pathname = usePathname();

  // Không hiển thị cụm nút liên hệ nổi trên các trang quản trị (Admin Dashboard, Radar, Leads,...)
  if (
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/admin-radar") ||
    pathname?.startsWith("/admin-login") ||
    pathname === "/login"
  ) {
    return null;
  }
  const contactItems: {
    id: string;
    label: string;
    href: string;
    bgClass: string;
    icon: React.ReactNode;
    isExternal: boolean;
    hasPulse?: boolean;
    leadSource?: "GG_FORM" | "ZALO" | "HOTLINE" | "FACEBOOK";
  }[] = [
    {
      id: "facebook",
      label: "Facebook Trường Hải",
      href: COMPANY_INFO.socials.facebook,
      bgClass: "bg-[#1877F2] hover:bg-[#166fe5] shadow-[#1877F2]/30",
      leadSource: "FACEBOOK",
      icon: (
        <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
      isExternal: true,
    },
    {
      id: "messenger",
      label: "Nhắn tin Messenger",
      href: "https://m.me/truonghaievent",
      bgClass: "bg-gradient-to-tr from-[#006AFF] via-[#00B2FF] to-[#A824FB] hover:opacity-95 shadow-[#006AFF]/30",
      leadSource: "FACEBOOK",
      icon: (
        <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 24 24">
          <path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.43 3.14 7.18.16.15.27.35.28.57l.08 1.77c.03.62.63 1.05 1.22.87l1.97-.61c.19-.06.39-.05.58.02.87.29 1.79.45 2.73.45 5.64 0 10-4.13 10-9.7S17.64 2 12 2zm1.06 13.06l-2.54-2.71-4.96 2.71 5.46-5.8 2.58 2.71 4.92-2.71-5.46 5.8z" />
        </svg>
      ),
      isExternal: true,
    },
    {
      id: "zalo",
      label: `Chat Zalo (${COMPANY_INFO.hotlineDisplay})`,
      href: COMPANY_INFO.socials.zalo,
      bgClass: "bg-[#0068FF] hover:bg-[#0057d6] shadow-[#0068FF]/30",
      leadSource: "ZALO",
      icon: (
        <span className="font-black text-sm tracking-tighter text-white select-none">
          Zalo
        </span>
      ),
      isExternal: true,
    },
    {
      id: "hotline",
      label: `Hotline 24/7: ${COMPANY_INFO.hotlineDisplay}`,
      href: `tel:${COMPANY_INFO.hotline}`,
      bgClass: "bg-gradient-to-r from-amber-500 via-[#D4AF37] to-amber-600 hover:scale-110 shadow-amber-500/40",
      hasPulse: true,
      leadSource: "HOTLINE",
      icon: (
        <Phone className="w-5 h-5 text-slate-950 fill-slate-950 animate-phone-ring" />
      ),
      isExternal: false,
    },
  ];

  return (
    <aside
      aria-label="Kênh liên hệ nhanh"
      className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end gap-2.5 sm:gap-3 pointer-events-auto"
    >
      {contactItems.map((item) => (
        <a
          key={item.id}
          href={item.href}
          target={item.isExternal ? "_blank" : undefined}
          rel={item.isExternal ? "noopener noreferrer" : undefined}
          onClick={() => {
            if (item.leadSource) {
              trackLandingLead(item.leadSource);
            }
          }}
          aria-label={item.label}
          className={`group relative flex items-center justify-center w-12 h-12 sm:w-[50px] sm:h-[50px] rounded-full text-white shadow-xl hover:scale-110 active:scale-95 transition-all duration-200 ${item.bgClass}`}
        >
          {item.hasPulse && (
            <span className="absolute -inset-1.5 rounded-full bg-amber-400 opacity-40 animate-ping -z-10 pointer-events-none" />
          )}

          {item.icon}

          {/* Tooltip on hover */}
          <span className="hidden sm:block absolute right-[60px] whitespace-nowrap bg-slate-900/95 backdrop-blur-sm text-amber-300 border border-[#D4AF37]/30 text-xs font-semibold px-3 py-1.5 rounded-lg opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 pointer-events-none shadow-xl">
            {item.label}
          </span>
        </a>
      ))}
    </aside>
  );
}
