"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  COMPANY_INFO,
  PROJECTS_DATA,
  SERVICES_DATA,
} from "@/lib/company-data";
import { PartnerLogoMarquee } from "@/components/PartnerLogoMarquee";
import { trackLandingLead } from "@/app/admin-radar/lead-tracker";
import {
  Sparkles,
  Phone,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Compass,
  Award,
  Users,
  ShieldCheck,
  Building2,
  GraduationCap,
  Heart,
  Mountain,
  Camera,
  MapPin,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Target,
  Flame,
  Zap,
  Play,
  Volume2,
  Layers,
  Clock,
  Star,
  Check,
  Mic,
  Send,
  Sliders,
  Tv,
  RotateCcw,
  TrendingUp,
  Eye,
} from "lucide-react";

/**
 * COMPONENT HIỆU ỨNG CUỘN XUẤT HIỆN (SCROLL REVEAL MOTION)
 * Khi người dùng cuộn tới, các khối sẽ trượt nhẹ và hiện rõ dần lên.
 */
function Reveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right" | "none";
}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
    );

    const el = ref.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, []);

  const getTransform = () => {
    if (isVisible) return "translate-x-0 translate-y-0 opacity-100 scale-100";
    if (direction === "up") return "translate-y-8 opacity-0 scale-[0.98]";
    if (direction === "left") return "-translate-x-8 opacity-0";
    if (direction === "right") return "translate-x-8 opacity-0";
    return "opacity-0 scale-95";
  };

  return (
    <div
      ref={ref}
      style={{ transitionDelay: isVisible ? `${delay}ms` : "0ms" }}
      className={`transition-all duration-700 ease-out transform ${getTransform()} ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * COMPONENT ĐẾM SỐ TỰ ĐỘNG CHUYỂN ĐỘNG (ANIMATED COUNTER)
 */
function AnimatedCounter({
  target,
  suffix = "",
  duration = 2000,
}: {
  target: number;
  suffix?: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
        } else {
          setHasStarted(false);
          setCount(0);
        }
      },
      { threshold: 0.15 }
    );

    const el = elementRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, []);

  useEffect(() => {
    if (!hasStarted) return;

    const frameRate = 16;
    const totalFrames = Math.round(duration / frameRate);
    let frame = 0;

    const timer = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.round(target * ease);

      setCount(current);

      if (frame >= totalFrames) {
        clearInterval(timer);
        setCount(target);
      }
    }, frameRate);

    return () => clearInterval(timer);
  }, [hasStarted, target, duration]);

  return (
    <span ref={elementRef} className="tabular-nums tracking-tight">
      {count}
      {suffix}
    </span>
  );
}

export default function HomePage() {
  // 3-Card Hero Showcase State (Theo hình ảnh tham chiếu số 2)
  // Card nào đang ở vị trí trung tâm (to nhất, viền vàng). Tự động xoay vòng 3 ảnh.
  const [activeHeroCard, setActiveHeroCard] = useState<number>(1);
  const [isHeroPaused, setIsHeroPaused] = useState(false);

  useEffect(() => {
    if (isHeroPaused) return;
    const timer = setInterval(() => {
      setActiveHeroCard((prev) => (prev + 1) % 3);
    }, 3500);
    return () => clearInterval(timer);
  }, [isHeroPaused]);

  const heroShowcaseCards = [
    {
      id: "su-kien",
      title: "Sự kiện chuyên nghiệp",
      image: "/images/hero/hero-event-pro.jpg",
      icon: <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D4AF37]" />,
      link: "/dich-vu#su-kien",
    },
    {
      id: "giao-duc",
      title: "Chương trình giáo dục & Team Building",
      image: "/images/hero/hero-edu-pro.jpg",
      icon: <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D4AF37]" />,
      link: "/dich-vu#du-lich",
    },
    {
      id: "du-lich",
      title: "Du lịch & Team Tour",
      image: "/images/hero/hero-team-pro.jpg",
      icon: <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D4AF37]" />,
      link: "/dich-vu#du-lich",
    },
  ];

  // Services category filter
  const [serviceFilter, setServiceFilter] = useState<"all" | "su-kien" | "du-lich">("all");

  // Projects filter
  const [projectFilter, setProjectFilter] = useState<"all" | "su-kien" | "du-lich">("all");




  const filteredServices = SERVICES_DATA.filter((s) => {
    if (serviceFilter === "all") return true;
    return s.category === serviceFilter;
  });

  // Services Carousel States & Logic
  const [serviceSlide, setServiceSlide] = useState(0);
  const [isServiceHovered, setIsServiceHovered] = useState(false);
  const [cardsPerPage, setCardsPerPage] = useState(3);

  // Responsive cards per page calculation
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setCardsPerPage(1);
      } else if (window.innerWidth < 1024) {
        setCardsPerPage(2);
      } else {
        setCardsPerPage(3);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Reset slide index when changing category tab
  useEffect(() => {
    setServiceSlide(0);
  }, [serviceFilter]);

  const maxServiceSlide = Math.max(0, filteredServices.length - cardsPerPage);

  // Auto-play horizontal slide every 3.5s (pauses on mouse hover)
  useEffect(() => {
    if (isServiceHovered || maxServiceSlide <= 0) return;

    const interval = setInterval(() => {
      setServiceSlide((prev) => (prev >= maxServiceSlide ? 0 : prev + 1));
    }, 3500);

    return () => clearInterval(interval);
  }, [isServiceHovered, maxServiceSlide]);

  const handlePrevService = () => {
    setServiceSlide((prev) => (prev <= 0 ? maxServiceSlide : prev - 1));
  };

  const handleNextService = () => {
    setServiceSlide((prev) => (prev >= maxServiceSlide ? 0 : prev + 1));
  };

  const filteredProjects = PROJECTS_DATA.filter((p) => {
    if (projectFilter === "all") return true;
    return p.category === projectFilter;
  });

  // Projects Coverflow Center-Focused Slider State
  const [activeProjectIndex, setActiveProjectIndex] = useState(2); // Mặc định card trung tâm là Vinpearl Nam Hội An (index 2) theo ảnh mẫu
  const [isProjectHovered, setIsProjectHovered] = useState(false);
  const [windowWidth, setWindowWidth] = useState(1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setActiveProjectIndex((prev) => (prev >= filteredProjects.length ? 0 : prev));
  }, [projectFilter, filteredProjects.length]);

  const handlePrevProject = () => {
    if (filteredProjects.length === 0) return;
    setActiveProjectIndex((prev) => (prev <= 0 ? filteredProjects.length - 1 : prev - 1));
  };

  const handleNextProject = () => {
    if (filteredProjects.length === 0) return;
    setActiveProjectIndex((prev) => (prev >= filteredProjects.length - 1 ? 0 : prev + 1));
  };

  // Auto-play horizontal slide every 4.5s (pauses on mouse hover)
  useEffect(() => {
    if (isProjectHovered || filteredProjects.length <= 1) return;

    const interval = setInterval(() => {
      setActiveProjectIndex((prev) => (prev >= filteredProjects.length - 1 ? 0 : prev + 1));
    }, 4500);

    return () => clearInterval(interval);
  }, [isProjectHovered, filteredProjects.length]);



  // Marquee list of prestigious clients
  const marqueeClients = [
    "Trung Ương Đoàn TNCS Hồ Chí Minh",
    "Công An TP Hà Nội - PA05",
    "Thành Đoàn Hà Nội",
    "Tổng Cục Đường Bộ Việt Nam",
    "Đại Học Bách Khoa Hà Nội",
    "Đại Học Quốc Gia Hà Nội",
    "Viettel Group",
    "Vingroup",
    "Sun Group",
    "Bệnh Viện Quân Y 108",
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 selection:bg-[#D4AF37] selection:text-[#0A1E5E]">
      {/* CSS KEYFRAMES INLINE CHO HIỆU ỨNG ÁNH SÁNG & CHUYỂN ĐỘNG */}
      <style jsx global>{`
        @keyframes floatSlow {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        @keyframes pulseBeam {
          0%, 100% {
            opacity: 0.15;
            transform: scale(1);
          }
          50% {
            opacity: 0.35;
            transform: scale(1.12);
          }
        }
        @keyframes tabProgress {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }
        @keyframes haloGlow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(212, 175, 55, 0.25);
          }
          50% {
            box-shadow: 0 0 35px rgba(212, 175, 55, 0.5);
          }
        }
        .anim-float {
          animation: floatSlow 4s ease-in-out infinite;
        }
        .anim-beam-1 {
          animation: pulseBeam 6s ease-in-out infinite;
        }
        .anim-beam-2 {
          animation: pulseBeam 8s ease-in-out infinite 2s;
        }
        .anim-progress {
          animation: tabProgress 5s linear infinite;
        }
        .anim-halo {
          animation: haloGlow 3s ease-in-out infinite;
        }
        @keyframes eqBar {
          0%, 100% {
            height: 6px;
          }
          50% {
            height: 24px;
          }
        }
        .anim-eq-1 { animation: eqBar 1.1s ease-in-out infinite 0.1s; }
        .anim-eq-2 { animation: eqBar 0.9s ease-in-out infinite 0.3s; }
        .anim-eq-3 { animation: eqBar 1.4s ease-in-out infinite 0.2s; }
        .anim-eq-4 { animation: eqBar 0.8s ease-in-out infinite 0.4s; }
        .anim-eq-5 { animation: eqBar 1.3s ease-in-out infinite 0.15s; }
        .anim-eq-6 { animation: eqBar 1.0s ease-in-out infinite 0.35s; }
      `}</style>

      {/* =========================================================================
          1. HERO SECTION (SANG TRỌNG, ĐÈN SÂN KHẤU CHUYỂN ĐỘNG, SHOWCASE SỐNG ĐỘNG)
      ========================================================================= */}
      <section className="relative bg-[#050D26] text-white overflow-hidden pt-12 pb-24 lg:pt-16 lg:pb-32 border-b border-[#D4AF37]/25">
        {/* Ambient Stage Lights & Moving Glow Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,_#16327e_0%,_transparent_55%),radial-gradient(circle_at_80%_80%,_#0c215e_0%,_transparent_60%)] opacity-90" />
        
        {/* Animated Stage Spotlights Cones Effect */}
        <div className="absolute -top-32 left-1/4 w-[520px] h-[520px] bg-[#D4AF37] rounded-full blur-[140px] pointer-events-none anim-beam-1" />
        <div className="absolute top-1/3 -right-20 w-[620px] h-[620px] bg-blue-600 rounded-full blur-[160px] pointer-events-none anim-beam-2" />
        
        {/* Subtle Grid overlay for high-tech stage feel */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Top Badge: Brand Reputation */}
          <Reveal delay={100}>
            <div className="flex items-center justify-center lg:justify-start mb-6">
              <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-white/10 via-[#D4AF37]/15 to-white/10 border border-[#D4AF37]/40 shadow-[0_0_20px_rgba(212,175,55,0.2)] backdrop-blur-md hover:scale-105 transition-transform cursor-default">
                <span className="flex h-2 w-2 rounded-full bg-[#D4AF37] animate-ping" />
                <span className="text-xs sm:text-sm font-medium tracking-wide text-amber-200">
                  Trường Hải Event & Travel • Đơn Vị Tổ Chức Sự Kiện & Tour Uy Tín
                </span>
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse hidden sm:inline" />
              </div>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
            {/* Left Column: Headline & Value Proposition */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-5 text-center lg:text-left">
              <Reveal delay={200}>
                <h1 className="text-3xl sm:text-5xl lg:text-[45px] font-bold tracking-tight leading-[1.25]">
                  <span className="text-white drop-shadow-sm">SỰ KIỆN</span>{" "}
                  <span className="bg-gradient-to-r from-[#FFF4B8] via-[#D4AF37] to-[#F59E0B] bg-clip-text text-transparent drop-shadow-md">
                    CHUYÊN NGHIỆP
                  </span>
                  <br />
                  <span className="text-white drop-shadow-sm">DU LỊCH</span>{" "}
                  <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-[#D4AF37] bg-clip-text text-transparent">
                    TRẢI NGHIỆM
                  </span>
                  <span
                    style={{ fontFamily: "'Careera Script', 'Careera Script PERSONAL USE', cursive" }}
                    className="block mt-2 sm:mt-2.5 -mb-1 sm:-mb-2 font-careera text-3xl sm:text-4xl lg:text-[46px] font-normal bg-gradient-to-r from-amber-100 via-amber-300 to-[#D4AF37] bg-clip-text text-transparent leading-[1.2] tracking-normal drop-shadow-md"
                  >
                    Kết nối thành công
                  </span>
                </h1>
              </Reveal>

              <Reveal delay={300}>
                <p className="text-sm sm:text-base text-slate-300 max-w-2xl font-normal leading-relaxed mx-auto lg:mx-0">
                  Đồng hành tổ chức thành công hơn <span className="text-white font-medium">500+ đại lễ khánh thành</span>, hội nghị, khai trương, tiệc tất niên Y.E.P và các hành trình du lịch Team Building bùng nổ cho cơ quan Trung ương, trường đại học và các tập đoàn lớn toàn quốc.
                </p>
              </Reveal>

              {/* Action Buttons */}
              <Reveal delay={400}>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-4 pt-1">
                  <Link
                    href="/dich-vu#bao-gia"
                    className="group relative px-7 py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-[#D4AF37] via-[#f7dd81] to-[#D4AF37] text-[#050D26] shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] hover:scale-[1.02] active:scale-[0.99] transition-all duration-200 flex items-center justify-center overflow-hidden anim-halo"
                  >
                    <span className="relative z-10 flex items-center">
                      Nhận Kịch Bản & Báo Giá 30 Phút
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1.5 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-white/25 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                  </Link>

                  <a
                    href={`tel:${COMPANY_INFO.hotline}`}
                    className="px-6 py-3.5 rounded-xl font-medium text-sm bg-white/10 hover:bg-white/15 text-white border border-white/20 hover:border-[#D4AF37]/70 transition-all duration-200 flex items-center justify-center backdrop-blur-md group hover:scale-[1.02]"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/20 flex items-center justify-center mr-3 group-hover:bg-[#D4AF37] transition-colors">
                      <Phone className="w-4 h-4 text-[#D4AF37] group-hover:text-[#050D26] transition-colors" />
                    </div>
                    <div className="text-left">
                      <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-normal">Hotline Tư Vấn 24/7</span>
                      <span className="font-semibold text-white text-sm">{COMPANY_INFO.hotlineDisplay}</span>
                    </div>
                  </a>
                </div>
              </Reveal>

              {/* Trust Badges Bar */}
              <Reveal delay={500}>
                <div className="pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs text-slate-300">
                  <div className="flex items-center space-x-2.5 bg-white/5 p-2.5 rounded-xl border border-white/5 hover:border-[#D4AF37]/40 hover:bg-white/10 transition-all duration-300">
                    <div className="w-6 h-6 rounded-md bg-[#D4AF37]/20 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 text-[#D4AF37]" />
                    </div>
                    <span className="font-normal text-slate-200">100% Thiết bị kho trực tiếp</span>
                  </div>
                  <div className="flex items-center space-x-2.5 bg-white/5 p-2.5 rounded-xl border border-white/5 hover:border-[#D4AF37]/40 hover:bg-white/10 transition-all duration-300">
                    <div className="w-6 h-6 rounded-md bg-[#D4AF37]/20 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 text-[#D4AF37]" />
                    </div>
                    <span className="font-normal text-slate-200">Kịch bản sáng tạo độc bản 1:1</span>
                  </div>
                  <div className="flex items-center space-x-2.5 bg-white/5 p-2.5 rounded-xl border border-white/5 hover:border-[#D4AF37]/40 hover:bg-white/10 transition-all duration-300">
                    <div className="w-6 h-6 rounded-md bg-[#D4AF37]/20 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 text-[#D4AF37]" />
                    </div>
                    <span className="font-normal text-slate-200">Bảo chứng pháp lý & VAT đầy đủ</span>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Right Column: 3 KHUNG ẢNH NẰM NGANG BÁM SÁT HÌNH THAM CHIẾU SỐ 2 */}
            <div className="lg:col-span-5 relative">
              <Reveal delay={300} direction="right">
                <div className="relative pt-6 pb-6">
                  {/* VẦNG HÀO QUANG VÀNG KIM RỰC RỠ PHÍA SAU (Bám sát ảnh tham chiếu) */}
                  <div className="absolute inset-0 -m-10 sm:-m-16 pointer-events-none -z-20 flex items-center justify-center">
                    {/* Hào quang nền tỏa rộng êm dịu */}
                    <div className="w-[125%] h-[125%] rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(245,158,11,0.38)_0%,_rgba(212,175,55,0.18)_42%,_transparent_72%)] blur-3xl pointer-events-none" />
                    {/* Hào quang điểm nhấn trung tâm sau card giữa & card phải */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-amber-500/25 via-amber-400/35 to-yellow-200/25 blur-2xl pointer-events-none animate-pulse" style={{ animationDuration: "3.5s" }} />
                  </div>

                  {/* ĐƯỜNG QUỸ ĐẠO ÁNH SÁNG VÀNG UỐN LƯỢN + ĐƯỜNG BAY + SAO LẤP LÁNH */}
                  <div className="absolute -inset-10 sm:-inset-16 pointer-events-none -z-10 overflow-visible">
                    <svg className="w-full h-full" viewBox="0 0 700 500" fill="none" preserveAspectRatio="none">
                      {/* Vệt sáng tỏa rộng phía dưới các card */}
                      <path
                        d="M 10 410 Q 340 470 690 280"
                        stroke="#D4AF37"
                        strokeWidth="16"
                        opacity="0.15"
                        className="blur-md"
                      />
                      {/* Tia sáng vàng chính uốn lượn rực rỡ ôm trọn chân 3 card */}
                      <path
                        d="M 10 410 Q 340 470 690 280"
                        stroke="url(#heroGoldOrbitMain)"
                        strokeWidth="3.2"
                        className="filter drop-shadow-[0_0_12px_rgba(245,158,11,0.95)]"
                      />
                      {/* Tia phụ mỏng tạo chiều sâu đôi */}
                      <path
                        d="M 50 425 Q 360 480 670 295"
                        stroke="url(#heroGoldOrbitSec)"
                        strokeWidth="1.5"
                        opacity="0.65"
                      />

                      {/* Quỹ đạo uốn cong mờ phía trên vòng sau các card */}
                      <path
                        d="M 80 200 C 150 50, 430 40, 560 70"
                        stroke="url(#heroGoldOrbitTop)"
                        strokeWidth="1.5"
                        opacity="0.4"
                      />

                      {/* Tia sáng vàng uốn lượn phía trên góc phải */}
                      <path
                        d="M 460 110 C 510 75, 560 60, 600 55"
                        stroke="url(#heroGoldOrbitSec)"
                        strokeWidth="1.5"
                        opacity="0.5"
                      />

                      {/* Các ngôi sao 4 cánh lấp lánh (Sparkle glints ✦) bám sát ảnh tham chiếu */}
                      {/* Ngôi sao lớn ở chân cụm card (gần đáy phải) */}
                      <g transform="translate(640, 310) scale(1.1)" className="animate-pulse">
                        <path d="M 0 -14 Q 0 0 -14 0 Q 0 0 0 14 Q 0 0 14 0 Q 0 0 0 -14 Z" fill="#FFF4B8" className="filter drop-shadow-[0_0_8px_rgba(255,244,184,1)]" />
                        <circle cx="0" cy="0" r="3" fill="#FFFFFF" />
                      </g>
                      {/* Ngôi sao nhỏ ở chân giữa */}
                      <g transform="translate(380, 445) scale(0.7)" className="animate-pulse" style={{ animationDelay: "1s" }}>
                        <path d="M 0 -14 Q 0 0 -14 0 Q 0 0 0 14 Q 0 0 14 0 Q 0 0 0 -14 Z" fill="#FFF4B8" className="filter drop-shadow-[0_0_6px_rgba(255,244,184,0.9)]" />
                      </g>
                      {/* Ngôi sao nhỏ ở góc trên phải */}
                      <g transform="translate(615, 65) scale(0.75)" className="animate-pulse" style={{ animationDelay: "0.5s" }}>
                        <path d="M 0 -14 Q 0 0 -14 0 Q 0 0 0 14 Q 0 0 14 0 Q 0 0 0 -14 Z" fill="#FFF4B8" className="filter drop-shadow-[0_0_6px_rgba(255,244,184,0.9)]" />
                      </g>

                      {/* Hạt bụi sáng vàng dọc quỹ đạo */}
                      <circle cx="170" cy="425" r="2.5" fill="#FFE58F" className="animate-ping opacity-75" />
                      <circle cx="490" cy="385" r="3" fill="#FFF4B8" className="animate-pulse" />
                      <circle cx="580" cy="220" r="2.5" fill="#D4AF37" />

                      <defs>
                        <linearGradient id="heroGoldOrbitMain" x1="0%" y1="100%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#D4AF37" stopOpacity="0" />
                          <stop offset="20%" stopColor="#F59E0B" stopOpacity="0.85" />
                          <stop offset="60%" stopColor="#FFF4B8" stopOpacity="1" />
                          <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.9" />
                        </linearGradient>
                        <linearGradient id="heroGoldOrbitSec" x1="0%" y1="100%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#D4AF37" stopOpacity="0" />
                          <stop offset="35%" stopColor="#F59E0B" stopOpacity="0.6" />
                          <stop offset="100%" stopColor="#FFE58F" stopOpacity="0.15" />
                        </linearGradient>
                        <linearGradient id="heroGoldOrbitTop" x1="0%" y1="50%" x2="100%" y2="50%">
                          <stop offset="0%" stopColor="#D4AF37" stopOpacity="0" />
                          <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.5" />
                          <stop offset="100%" stopColor="#FFE58F" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>

                  {/* CÁC HÌNH NHỎ (FLOATING GLASS BADGES) ĐỒNG BỘ */}
                  {/* 1. Badge Micro Sự kiện / Sân khấu (Top Left, trên card 1) */}
                  <div className="absolute -top-3 left-[14%] sm:left-[16%] z-40 pointer-events-none animate-[floatSlow_4.5s_ease-in-out_infinite]">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#081845]/85 backdrop-blur-md border border-amber-300/40 shadow-[0_0_18px_rgba(245,158,11,0.4),inset_0_0_10px_rgba(245,158,11,0.2)] -rotate-6 flex items-center justify-center">
                      <Mic className="w-5 h-5 text-amber-300 fill-amber-300/20" />
                    </div>
                  </div>

                  {/* 2. Badge Định vị MapPin (Bên trái Card 1) */}
                  <div className="absolute top-[44%] -left-3 sm:-left-5 z-40 pointer-events-none animate-[floatSlow_5s_ease-in-out_infinite_1s]">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#081845]/85 backdrop-blur-md border border-amber-300/40 shadow-[0_0_18px_rgba(245,158,11,0.4),inset_0_0_10px_rgba(245,158,11,0.2)] -rotate-6 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-amber-300 fill-amber-300/20" />
                    </div>
                  </div>

                  {/* 3. Badge Máy ảnh Camera (Top Right, trên Card 3) */}
                  <div className="absolute -top-3 right-[15%] sm:right-[18%] z-40 pointer-events-none animate-[floatSlow_4.2s_ease-in-out_infinite_0.5s]">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#081845]/85 backdrop-blur-md border border-amber-300/40 shadow-[0_0_18px_rgba(245,158,11,0.4),inset_0_0_10px_rgba(245,158,11,0.2)] rotate-3 flex items-center justify-center">
                      <Camera className="w-5 h-5 text-amber-300 fill-amber-300/20" />
                    </div>
                  </div>

                  {/* 4. Badge Lịch Calendar (Bên phải Card 3, dưới máy bay) */}
                  <div className="absolute top-[12%] -right-2 sm:-right-4 z-40 pointer-events-none animate-[floatSlow_5.2s_ease-in-out_infinite_1.5s]">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#081845]/85 backdrop-blur-md border border-amber-300/40 shadow-[0_0_18px_rgba(245,158,11,0.4),inset_0_0_10px_rgba(245,158,11,0.2)] rotate-6 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-amber-300 fill-amber-300/20" />
                    </div>
                  </div>

                  {/* Cụm 3 khung ảnh LỚN, cao, chồng lấn nhẹ, nghiêng phối cảnh — bám sát hình tham chiếu số 2.
                      Kích thước theo % của khung chứa (không cố định px) nên luôn vừa cột phải. */}
                  <div
                    className="relative w-full"
                    style={{ aspectRatio: "1 / 0.98", perspective: "1400px" }}
                    onMouseEnter={() => setIsHeroPaused(true)}
                    onMouseLeave={() => setIsHeroPaused(false)}
                  >
                    {heroShowcaseCards.map((card, idx) => {
                      // Vị trí hiện tại của card: 0 = trái, 1 = giữa (nổi bật), 2 = phải
                      const slot = (idx - activeHeroCard + 1 + 3) % 3;
                      const isHighlighted = slot === 1;
                      // Vị trí / kích thước / độ nghiêng từng ô (trái nhỏ – giữa to nhất ở trước – phải nhỏ)
                      const layouts = [
                        { left: "1%", top: "15%", width: "37%", height: "68%", rot: "rotateY(14deg) rotateZ(-3deg)", z: 10 },
                        { left: "29%", top: "2%", width: "42%", height: "88%", rot: "rotateY(0deg) rotateZ(-4deg)", z: 30 },
                        { left: "62%", top: "13%", width: "37%", height: "68%", rot: "rotateY(-16deg) rotateZ(4deg)", z: 20 },
                      ];
                      const l = layouts[slot];

                      return (
                        <Link
                          key={card.id}
                          href={card.link}
                          style={{
                            position: "absolute",
                            left: l.left,
                            top: l.top,
                            width: l.width,
                            height: l.height,
                            zIndex: l.z,
                            transform: `${l.rot} scale(${isHighlighted ? 1.03 : 1})`,
                          }}
                          className={`group rounded-[22px] sm:rounded-[28px] overflow-hidden cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] select-none hover:-translate-y-1 ${
                            isHighlighted
                              ? "border-2 border-amber-300 shadow-[0_0_28px_rgba(245,158,11,0.7),0_0_60px_rgba(212,175,55,0.3)]"
                              : "border border-amber-200/40 shadow-[0_10px_30px_rgba(0,0,0,0.45),0_0_14px_rgba(212,175,55,0.2)] hover:border-amber-300/80"
                          }`}
                        >
                          {/* Ảnh phủ kín khung, zoom nhẹ khi hover */}
                          <img
                            src={card.image}
                            alt={card.title}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                          />

                          {/* Gradient navy ở chân ảnh */}
                          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#050D26]/95 via-[#050D26]/55 to-transparent" />

                          {/* Nhãn kính mờ: icon, tên dịch vụ (được xuống 2 dòng, không cắt ...), mũi tên */}
                          <div className="absolute inset-x-2 sm:inset-x-3 bottom-2 sm:bottom-3 z-10 flex items-center gap-1.5 sm:gap-2 rounded-2xl bg-[#071642]/70 backdrop-blur-md border border-white/15 px-1.5 sm:px-2.5 py-1.5 sm:py-2">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/60 border border-amber-300/40 flex items-center justify-center shrink-0">
                              {card.icon}
                            </div>
                            <span className="flex-1 text-[11px] sm:text-[13px] font-semibold text-white leading-tight break-words group-hover:text-amber-200 transition-colors">
                              {card.title}
                            </span>
                            <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 group-hover:translate-x-0.5 transition-transform duration-300" />
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. FLOATING STATS COUNTER STRIP (CHUYỂN ĐỘNG SỐ TỰ ĐỘNG CHẠY TỪ 0 LÊN)
      ========================================================================= */}
      <section className="relative z-20 -mt-10 sm:-mt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal delay={200}>
          <div className="rounded-2xl bg-white shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-200/80 p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden group">
            {/* Subtle golden top gradient accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-80" />

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
              {/* Stat 1: 500+ */}
              <div className="text-center group/stat transition-all duration-300">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#0A1E5E] via-[#12318b] to-[#D4AF37] bg-clip-text text-transparent group-hover/stat:scale-110 transition-transform duration-300">
                  <AnimatedCounter target={500} suffix="+" duration={2000} />
                </div>
                <div className="text-sm font-semibold text-slate-800 mt-2">
                  Sự kiện thành công
                </div>
                <div className="text-xs text-slate-500 mt-1 max-w-[200px] mx-auto leading-relaxed font-normal">
                  Quy mô từ 50 đến 5.000 khách
                </div>
              </div>

              {/* Stat 2: 100+ */}
              <div className="text-center group/stat transition-all duration-300 sm:pl-6">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#0A1E5E] via-[#12318b] to-[#D4AF37] bg-clip-text text-transparent group-hover/stat:scale-110 transition-transform duration-300">
                  <AnimatedCounter target={100} suffix="+" duration={1800} />
                </div>
                <div className="text-sm font-semibold text-slate-800 mt-2">
                  Đối tác & Doanh nghiệp
                </div>
                <div className="text-xs text-slate-500 mt-1 max-w-[200px] mx-auto leading-relaxed font-normal">
                  Đoàn thể, tập đoàn, trường học tin cậy
                </div>
              </div>

              {/* Stat 3: 10+ */}
              <div className="text-center group/stat transition-all duration-300 pt-4 sm:pt-0 sm:pl-6">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#0A1E5E] via-[#12318b] to-[#D4AF37] bg-clip-text text-transparent group-hover/stat:scale-110 transition-transform duration-300">
                  <AnimatedCounter target={10} suffix="+" duration={1500} />
                </div>
                <div className="text-sm font-semibold text-slate-800 mt-2">
                  Năm kinh nghiệm
                </div>
                <div className="text-xs text-slate-500 mt-1 max-w-[200px] mx-auto leading-relaxed font-normal">
                  Đội ngũ chuyên gia tổ chức sự kiện & tour
                </div>
              </div>

              {/* Stat 4: 99% */}
              <div className="text-center group/stat transition-all duration-300 pt-4 sm:pt-0 sm:pl-6">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#0A1E5E] via-[#12318b] to-[#D4AF37] bg-clip-text text-transparent group-hover/stat:scale-110 transition-transform duration-300">
                  <AnimatedCounter target={99} suffix="%" duration={1600} />
                </div>
                <div className="text-sm font-semibold text-slate-800 mt-2">
                  Khách hàng hài lòng
                </div>
                <div className="text-xs text-slate-500 mt-1 max-w-[200px] mx-auto leading-relaxed font-normal">
                  Tỉ lệ phản hồi tích cực và tái ký hợp đồng
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* =========================================================================
          CONTINUOUS PARTNER TICKER STRIP (BĂNG CHỮ CHẠY VÔ TẬN)
      ========================================================================= */}
      <section className="py-6 bg-slate-100/80 border-b border-slate-200 overflow-hidden">
        <div className="animate-marquee flex items-center space-x-8 text-xs font-semibold uppercase tracking-wider text-slate-600">
          {[...marqueeClients, ...marqueeClients].map((client, idx) => (
            <div key={idx} className="flex items-center space-x-3 shrink-0 px-2">
              <span className="text-[#D4AF37]">✦</span>
              <span>{client}</span>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          3. VỀ CHÚNG TÔI - GIỚI THIỆU TỔNG QUAN (PHONG CÁCH ẢNH THAM CHIẾU SỐ 2)
      ========================================================================= */}
      <section className="py-14 sm:py-16 lg:py-20 bg-white border-b border-slate-200 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Cột trái: Khung Video / Giới thiệu thương hiệu (16:9) với nút Play */}
            <div className="lg:col-span-6">
              <Reveal delay={100} direction="left">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 group aspect-[16/10] sm:aspect-[16/9] bg-[#06123B]">
                  {/* Background Image sự kiện hoành tráng */}
                  <img
                    src="https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80"
                    alt="Trường Hải Event giới thiệu"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-35"
                  />

                  {/* Gradient Overlay tối sang trọng */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#06123B] via-[#06123B]/60 to-transparent" />

                  {/* Trung tâm: Logo Hexagon & Nút Play nổi bật */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
                    {/* Logo Hexagon Brand TH */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#D4AF37] via-[#F5E08B] to-[#997A15] p-0.5 shadow-2xl mb-3.5 group-hover:scale-105 transition-transform">
                      <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center overflow-hidden">
                        <Image
                          src="/images/logo.png"
                          alt="Logo Trường Hải Event & Travel"
                          width={160}
                          height={160}
                          className="w-full h-full object-contain scale-125"
                        />
                      </div>
                    </div>

                    <div className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-1">
                      TRƯỜNG HẢI <span className="text-[#D4AF37]">EVENT</span>
                    </div>
                    <div className="text-xs sm:text-sm text-slate-300 font-light italic mb-4">
                      Khoảnh khắc đáng nhớ – Dấu ấn tinh hoa
                    </div>

                    {/* Circular Glowing Play Button */}
                    <Link
                      href="/ve-chung-toi"
                      className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/20 hover:bg-[#D4AF37] text-white hover:text-slate-950 flex items-center justify-center backdrop-blur-md border border-white/40 shadow-xl transition-all duration-300 hover:scale-110 group/play"
                      aria-label="Xem chi tiết giới thiệu"
                    >
                      <span className="absolute -inset-2 rounded-full border border-white/25 animate-ping opacity-60" />
                      <Play className="w-6 h-6 ml-1 fill-current" />
                    </Link>
                  </div>

                  {/* Bottom bar thông tin Hotline */}
                  <div className="absolute bottom-0 left-0 right-0 py-3 px-5 bg-black/60 backdrop-blur-md border-t border-white/10 flex items-center justify-between text-xs text-slate-300 z-10">
                    <span className="flex items-center text-amber-400 font-medium">
                      <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-400" />
                      Phim giới thiệu năng lực doanh nghiệp
                    </span>
                    <span className="font-mono text-white font-semibold">
                      Hotline: {COMPANY_INFO.hotlineDisplay}
                    </span>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Cột phải: Nội dung giới thiệu & Nút dẫn sang trang Giới thiệu */}
            <div className="lg:col-span-6 space-y-4">
              <Reveal delay={150} direction="right">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-[#0A1E5E] px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 inline-block mb-3">
                    Về Chúng Tôi
                  </span>
                  
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0A1E5E] tracking-tight leading-tight mb-2">
                    TRƯỜNG HẢI <span className="text-[#D4AF37]">EVENT &amp; TRAVEL</span>
                  </h2>

                  <div className="text-sm sm:text-base font-semibold text-slate-700 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                    <span>Tổ chức sự kiện chuyên nghiệp &amp; Du lịch trải nghiệm uy tín</span>
                  </div>

                  <div className="space-y-3.5 text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
                    <p>
                      Trường Hải Event &amp; Travel là đơn vị chuyên hoạt động trong lĩnh vực tổ chức sự kiện, đại lễ kỷ niệm, hội nghị, hội thảo, teambuilding... cung cấp 100% kho thiết bị sự kiện và nhân sự cao cấp. Với hơn 10 năm kinh nghiệm cùng hàng trăm sự kiện trọng điểm trên toàn quốc, chúng tôi tự hào mang đến giải pháp toàn diện – từ ý tưởng đến hiện thực.
                    </p>
                    <p>
                      Cam kết &ldquo;Sự kiện chuyên nghiệp – Du lịch trải nghiệm – Kết nối thành công&rdquo;, Trường Hải Event chính là đối tác lý tưởng cho những trải nghiệm ấn tượng và khác biệt. Hãy cùng chúng tôi biến mọi khoảnh khắc thành tuyệt tác!
                    </p>
                  </div>

                  <div className="pt-5">
                    <Link
                      href="/ve-chung-toi"
                      className="inline-flex items-center px-6 py-3.5 rounded-xl font-bold text-sm bg-[#0A1E5E] hover:bg-[#122b82] text-white shadow-lg hover:shadow-xl transition-all duration-200 group border border-[#D4AF37]/40 hover:scale-105"
                    >
                      <span>Khám Phá Về Chúng Tôi</span>
                      <ArrowRight className="w-4 h-4 ml-2 text-[#D4AF37] group-hover:translate-x-1.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. HỆ THỐNG DỊCH VỤ TRỌNG TÂM (STAGGERED SLIDE UP MOTION)
      ========================================================================= */}
      <section className="py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal delay={100}>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-[#0A1E5E] px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 inline-block mb-3">
                  Dịch Vụ Toàn Diện
                </span>
                <h2 className="text-2xl sm:text-4xl font-bold text-[#0A1E5E]">
                  Giải Pháp Sự Kiện & Du Lịch Trọn Gói
                </h2>
                <p className="text-sm sm:text-base text-slate-600 mt-2 font-normal">
                  Mọi khâu từ ý tưởng, kịch bản, thiết bị đến điều hành tour đều được thực hiện trọn gói.
                </p>
              </div>

              {/* Filter Buttons */}
              <div className="flex items-center space-x-2 mt-6 md:mt-0 p-1.5 bg-slate-100 rounded-xl">
                <button
                  onClick={() => setServiceFilter("all")}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                    serviceFilter === "all"
                      ? "bg-[#0A1E5E] text-white shadow-sm scale-105"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Tất Cả ({SERVICES_DATA.length})
                </button>
                <button
                  onClick={() => setServiceFilter("su-kien")}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                    serviceFilter === "su-kien"
                      ? "bg-[#0A1E5E] text-white shadow-sm scale-105"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  🎪 Tổ Chức Sự Kiện
                </button>
                <button
                  onClick={() => setServiceFilter("du-lich")}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                    serviceFilter === "du-lich"
                      ? "bg-[#0A1E5E] text-white shadow-sm scale-105"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  ✈️ Du Lịch & Vận Tải
                </button>
              </div>
            </div>
          </Reveal>

          {/* Horizontal Auto-Playing Carousel Container */}
          <div
            className="relative"
            onMouseEnter={() => setIsServiceHovered(true)}
            onMouseLeave={() => setIsServiceHovered(false)}
          >
            {/* Carousel Overflow Window */}
            <div className="overflow-hidden py-4 -mx-3">
              <div
                className="flex transition-transform duration-700 ease-out"
                style={{
                  transform: `translateX(-${serviceSlide * (100 / cardsPerPage)}%)`,
                }}
              >
                {filteredServices.map((service) => (
                  <div
                    key={service.id}
                    className="shrink-0 px-3"
                    style={{ width: `${100 / cardsPerPage}%` }}
                  >
                    <div className="group rounded-2xl border border-slate-200 bg-white overflow-hidden hover:shadow-2xl hover:border-[#D4AF37]/60 transition-all duration-300 flex flex-col hover:-translate-y-1.5 h-full">
                      {/* Image & Badges */}
                      <div className="h-52 relative overflow-hidden bg-slate-950">
                        <img
                          src={service.image_url}
                          alt={service.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />

                        <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#0A1E5E]/90 backdrop-blur-md text-[11px] font-semibold text-[#D4AF37] border border-[#D4AF37]/30">
                          {service.category === "su-kien" ? "Sự Kiện Chuyên Nghiệp" : "Du Lịch & Vận Tải"}
                        </div>

                        {service.popular && (
                          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-gradient-to-r from-amber-500 to-[#D4AF37] text-[#0A1E5E] text-[10px] font-bold uppercase tracking-wider shadow-sm">
                            Được Đặt Nhiều Nhất
                          </div>
                        )}

                        <div className="absolute bottom-3 left-3 right-3">
                          <span className="text-[11px] text-slate-300 font-normal">Trường Hải Event & Travel</span>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                        <div>
                          <h3 className="font-bold text-base sm:text-lg text-[#0A1E5E] group-hover:text-[#D4AF37] transition-colors line-clamp-2 leading-snug mb-2">
                            {service.title}
                          </h3>
                          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-normal">
                            {service.description}
                          </p>
                        </div>

                        {/* Highlights Bullet List */}
                        <div className="space-y-2 py-3 border-y border-slate-100 text-xs text-slate-700 font-normal">
                          {service.features.slice(0, 3).map((feat, fIdx) => (
                            <div key={fIdx} className="flex items-start space-x-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                              <span className="line-clamp-1">{feat}</span>
                            </div>
                          ))}
                        </div>

                        {/* Card Action */}
                        <div className="flex items-center justify-between pt-1">
                          <Link
                            href="/dich-vu#bao-gia"
                            className="inline-flex items-center text-xs font-semibold text-[#0A1E5E] hover:text-[#D4AF37] transition-colors group/link"
                          >
                            <span>Yêu cầu báo giá chi tiết</span>
                            <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover/link:translate-x-1.5 transition-transform" />
                          </Link>

                          <a
                            href={`tel:${COMPANY_INFO.hotline}`}
                            className="text-xs text-slate-400 hover:text-[#0A1E5E] font-medium"
                          >
                            Tư vấn ngay
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Carousel Controls: Pagination Dots + Navigation Arrows */}
            {maxServiceSlide > 0 && (
              <div className="flex items-center justify-between pt-4 pb-2">
                {/* Dots indicator */}
                <div className="flex items-center space-x-2">
                  {Array.from({ length: maxServiceSlide + 1 }).map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      onClick={() => setServiceSlide(dotIdx)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        serviceSlide === dotIdx
                          ? "w-8 bg-[#0A1E5E]"
                          : "w-2 bg-slate-200 hover:bg-slate-300"
                      }`}
                      aria-label={`Chuyển đến slide ${dotIdx + 1}`}
                    />
                  ))}
                  <span className="text-[11px] text-slate-400 pl-2 hidden sm:inline-block">
                    {isServiceHovered ? "Đã tạm dừng để đọc" : "✦ Tự động chuyển mỗi 3.5s"}
                  </span>
                </div>

                {/* Prev / Next Buttons */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handlePrevService}
                    className="w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 transition-all"
                    aria-label="Dịch vụ trước"
                  >
                    <ChevronLeft className="w-5 h-5 text-slate-700" />
                  </button>
                  <button
                    onClick={handleNextService}
                    className="w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 transition-all"
                    aria-label="Dịch vụ tiếp theo"
                  >
                    <ChevronRight className="w-5 h-5 text-slate-700" />
                  </button>
                </div>
              </div>
            )}
          </div>

          <Reveal delay={200}>
            <div className="text-center mt-12">
              <Link
                href="/dich-vu"
                className="inline-flex items-center px-8 py-3.5 rounded-xl font-semibold text-sm bg-slate-100 hover:bg-[#0A1E5E] text-[#0A1E5E] hover:text-white transition-all duration-200 border border-slate-200 hover:shadow-lg hover:scale-105"
              >
                <span>Xem Toàn Bộ Bảng Báo Giá Dịch Vụ</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>


      {/* =========================================================================
          5. DỰ ÁN NỔI BẬT (COVERFLOW CENTER-FOCUSED SLIDER)
      ========================================================================= */}
      {(() => {
        const isDesktop = windowWidth >= 1024;
        const isTablet = windowWidth >= 640 && windowWidth < 1024;
        const centerWidth = isDesktop ? 700 : isTablet ? 540 : Math.min(windowWidth - 48, 380);
        const sideWidth = isDesktop ? 330 : isTablet ? 270 : 200;
        const gap = isDesktop ? 24 : 14;

        let trackCenterOffset = 0;
        for (let i = 0; i < activeProjectIndex; i++) {
          trackCenterOffset += sideWidth + gap;
        }
        trackCenterOffset += centerWidth / 2;

        return (
          <section className="py-16 sm:py-20 lg:py-24 bg-[#050D26] text-white relative overflow-hidden select-none">
            {/* Soft Ambient Radial Glow */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -z-0" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-8 sm:mb-10">
              <Reveal delay={100}>
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                  {/* Left Column: Badge + Title + Subtitle */}
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-widest text-[#FBBF24] px-3.5 py-1.5 rounded-full bg-white/5 border border-[#FBBF24]/40 inline-block mb-3 shadow-sm">
                      Minh Chứng Năng Lực
                    </span>
                    <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight leading-tight mb-2">
                      Dự Án <span className="text-[#FBBF24]">Nổi Bật</span>
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 font-normal max-w-xl">
                      Các sự kiện trọng điểm cấp cơ quan Trung ương và các tập đoàn lớn toàn quốc.
                    </p>
                  </div>

                  {/* Right Column: Filter Tabs & Navigation Buttons */}
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Category Filter Pills */}
                    <div className="flex items-center p-1 bg-white/10 rounded-full border border-white/10 backdrop-blur-sm">
                      <button
                        onClick={() => setProjectFilter("all")}
                        className={`px-4 sm:px-5 py-2 rounded-full text-xs font-semibold transition-all ${
                          projectFilter === "all"
                            ? "bg-[#FBBF24] text-slate-950 shadow-md"
                            : "text-slate-300 hover:text-white"
                        }`}
                      >
                        Tất Cả Dự Án
                      </button>
                      <button
                        onClick={() => setProjectFilter("su-kien")}
                        className={`px-4 sm:px-5 py-2 rounded-full text-xs font-semibold transition-all ${
                          projectFilter === "su-kien"
                            ? "bg-[#FBBF24] text-slate-950 shadow-md"
                            : "text-slate-300 hover:text-white"
                        }`}
                      >
                        Đại Lễ Sự Kiện
                      </button>
                      <button
                        onClick={() => setProjectFilter("du-lich")}
                        className={`px-4 sm:px-5 py-2 rounded-full text-xs font-semibold transition-all ${
                          projectFilter === "du-lich"
                            ? "bg-[#FBBF24] text-slate-950 shadow-md"
                            : "text-slate-300 hover:text-white"
                        }`}
                      >
                        Tour & Team Building
                      </button>
                    </div>

                    {/* Prev / Next Circular Navigation Arrows */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handlePrevProject}
                        className="w-10 h-10 rounded-full border border-white/20 bg-white/5 hover:bg-white/15 text-white/70 hover:text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                        aria-label="Dự án trước"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={handleNextProject}
                        className="w-10 h-10 rounded-full border border-[#FBBF24]/70 bg-[#FBBF24]/10 hover:bg-[#FBBF24]/25 text-[#FBBF24] flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                        aria-label="Dự án tiếp theo"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* COVERFLOW SLIDER TRACK */}
            <div
              className="relative w-full py-4 overflow-hidden"
              onMouseEnter={() => setIsProjectHovered(true)}
              onMouseLeave={() => setIsProjectHovered(false)}
            >
              <div
                className="flex items-center transition-transform duration-700 ease-out"
                style={{
                  transform: `translateX(calc(50% - ${trackCenterOffset}px))`,
                  gap: `${gap}px`,
                }}
              >
                {filteredProjects.map((proj, idx) => {
                  const isActive = idx === activeProjectIndex;
                  const currentWidth = isActive ? centerWidth : sideWidth;

                  return (
                    <div
                      key={proj.id}
                      onClick={() => setActiveProjectIndex(idx)}
                      style={{ width: `${currentWidth}px` }}
                      className={`relative shrink-0 transition-all duration-700 ease-out cursor-pointer ${
                        isActive
                          ? "h-[390px] sm:h-[430px] z-30"
                          : "h-[330px] sm:h-[370px] z-10 opacity-60 hover:opacity-90"
                      }`}
                    >
                      <div
                        className={`w-full h-full relative overflow-hidden flex flex-col justify-between transition-all duration-500 group ${
                          isActive
                            ? "rounded-3xl border-2 border-[#FBBF24] shadow-[0_0_40px_rgba(245,158,11,0.35)]"
                            : "rounded-2xl border border-white/10 hover:border-white/30"
                        }`}
                      >
                        {/* Background Image */}
                        <img
                          src={proj.image_url}
                          alt={proj.title}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />

                        {/* Gradient Overlays */}
                        <div
                          className={`absolute inset-0 transition-opacity duration-500 ${
                            isActive
                              ? "bg-gradient-to-t from-[#050D26] via-[#050D26]/40 to-black/25"
                              : "bg-gradient-to-t from-[#050D26] via-[#050D26]/60 to-black/40"
                          }`}
                        />

                        {/* Top Badges */}
                        <div className="relative z-10 p-4 sm:p-5 flex items-center justify-between">
                          {isActive && proj.client_name ? (
                            <div className="px-3.5 py-1.5 rounded-full bg-[#FBBF24] text-slate-950 text-xs font-semibold shadow-md line-clamp-1 max-w-[65%]">
                              {proj.client_name}
                            </div>
                          ) : (
                            <div />
                          )}

                          {proj.location && (
                            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] sm:text-xs text-slate-200 ml-auto font-medium">
                              <MapPin className="w-3.5 h-3.5 text-[#FBBF24]" />
                              <span>
                                {proj.location} - {proj.year}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Bottom Content Overlay */}
                        <div className="relative z-10 p-5 sm:p-7">
                          {isActive ? (
                            // ACTIVE CENTER CARD CONTENT
                            <div>
                              <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight mb-2 line-clamp-2">
                                {proj.title}
                              </h3>

                              <p className="text-xs sm:text-sm text-slate-200/90 leading-relaxed line-clamp-2 max-w-xl mb-4 font-normal">
                                {proj.description}
                              </p>

                              <div className="flex items-center justify-between pt-2">
                                <div className="flex flex-wrap items-center gap-4 text-xs">
                                  <span className="text-[#FBBF24] flex items-center gap-1.5 font-semibold">
                                    <Sparkles className="w-4 h-4 text-[#FBBF24]" />
                                    Trường Hải Event bảo chứng
                                  </span>
                                  <span className="text-slate-300 flex items-center gap-1.5 font-normal">
                                    <Star className="w-4 h-4 text-[#FBBF24] fill-[#FBBF24]" />
                                    Thành công 100%
                                  </span>
                                </div>

                                {/* Floating Gold CTA Arrow */}
                                <Link
                                  href={`/du-an#${proj.id}`}
                                  onClick={(e) => e.stopPropagation()}
                                  className="w-12 h-12 rounded-full bg-[#FBBF24] hover:bg-amber-300 text-slate-950 flex items-center justify-center shadow-lg transition-transform hover:scale-110 shrink-0"
                                  aria-label="Xem chi tiết dự án"
                                >
                                  <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                                </Link>
                              </div>
                            </div>
                          ) : (
                            // INACTIVE SIDE CARD CONTENT
                            <div>
                              <h4 className="text-sm sm:text-base font-semibold text-white line-clamp-2 leading-snug mb-1.5">
                                {proj.title}
                              </h4>

                              <p className="text-[11px] text-slate-300/80 line-clamp-2 leading-relaxed font-normal mb-3">
                                {proj.description}
                              </p>

                              <div className="flex justify-end">
                                <div className="w-8 h-8 rounded-full border border-white/20 bg-black/40 text-white flex items-center justify-center group-hover:border-[#FBBF24] group-hover:text-[#FBBF24] transition-colors">
                                  <ArrowRight className="w-4 h-4" />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* BOTTOM PAGINATION BAR & DASH INDICATORS */}
            <div className="flex items-center justify-center gap-4 mt-6 sm:mt-8 relative z-10">
              <div className="flex items-center gap-2">
                {filteredProjects.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    onClick={() => setActiveProjectIndex(dotIdx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      dotIdx === activeProjectIndex
                        ? "w-8 bg-[#FBBF24]"
                        : "w-5 bg-slate-700/80 hover:bg-slate-500"
                    }`}
                    aria-label={`Chuyển tới slide ${dotIdx + 1}`}
                  />
                ))}
              </div>

              <span className="text-xs text-slate-400 font-medium font-mono pl-1">
                {activeProjectIndex + 1} / {filteredProjects.length} dự án nổi bật
              </span>
            </div>

            {/* Subtle Wavy Gold Wireline Accent Background */}
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-28 opacity-25 overflow-hidden">
              <svg viewBox="0 0 1440 120" className="w-full h-full" fill="none">
                <path d="M0,70 C360,130 480,-10 720,60 C960,130 1140,10 1440,70" stroke="#FBBF24" strokeWidth="1.5" />
                <path d="M0,90 C320,30 520,120 920,40 C1180,0 1340,100 1440,80" stroke="#FBBF24" strokeWidth="1" strokeDasharray="5 5" />
              </svg>
            </div>
          </section>
        );
      })()}

      {/* =========================================================================
          6. ĐỐI TÁC CHIẾN LƯỢC & MẠNG LƯỚI KHÁCH HÀNG (RUNNING LOGO RIBBON)
      ========================================================================= */}
      <section className="py-10 sm:py-12 lg:py-14 bg-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal delay={100}>
            <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8 flex flex-col items-center">
              <span className="inline-flex items-center text-xs font-semibold uppercase tracking-widest text-[#0A1E5E] px-3.5 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 mb-2.5 shadow-sm">
                Mạng Lưới Uy Tín
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0A1E5E] tracking-tight mb-2">
                Đối Tác & Khách Hàng Đồng Hành
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-normal max-w-2xl">
                Trường Hải Event & Travel tự hào là đối tác chiến lược tin cậy của các cơ quan Trung ương, trường đại học hàng đầu và các tập đoàn kinh tế uy tín.
              </p>
            </div>
          </Reveal>
        </div>

        {/* Dải logo nhãn hàng chạy ngang liên tục */}
        <Reveal delay={200}>
          <PartnerLogoMarquee />
        </Reveal>
      </section>

      {/* =========================================================================
          8. TRÁCH NHIỆM XÃ HỘI & THIỆN NGUYỆN (CSR)
      ========================================================================= */}
      <section className="py-20 bg-gradient-to-b from-white to-amber-50/30 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <Reveal delay={100} direction="left">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
                  <Heart className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
                  <span>Trách Nhiệm Cộng Đồng (CSR)</span>
                </div>
                
                <h2 className="text-2xl sm:text-4xl font-bold text-[#0A1E5E] leading-tight mt-3">
                  Hoạt Động Thiện Nguyện & Phúc Lợi Xã Hội
                </h2>
                
                <p className="text-sm text-slate-600 leading-relaxed font-normal mt-3">
                  Bên cạnh sứ mệnh kinh doanh, Trường Hải Event & Travel luôn trích một phần lợi nhuận để đồng hành cùng các chương trình thiện nguyện nhân văn, mang lại nụ cười và tương lai tươi sáng cho các em nhỏ vùng cao biên giới.
                </p>

                <div className="space-y-3.5 text-xs pt-4">
                  <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-start space-x-3.5 hover:shadow-md transition-shadow">
                    <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-800 block font-semibold">Chương trình "Chắp cánh ước mơ" (Yên Bái):</strong>
                      <span className="text-slate-600 font-normal">Trao tặng hàng trăm suất học bổng, áo ấm mùa đông và xây dựng tủ sách yêu thương cho học sinh vùng cao.</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-start space-x-3.5 hover:shadow-md transition-shadow">
                    <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-800 block font-semibold">Hành trình "Hướng về Sìn Hồ" (Lai Châu):</strong>
                      <span className="text-slate-600 font-normal">Áo ấm, chăn bông và nhu yếu phẩm thiết yếu trao tận tay các hộ gia đình đặc biệt khó khăn.</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-start space-x-3.5 hover:shadow-md transition-shadow">
                    <Award className="w-4 h-4 text-[#0A1E5E] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-800 block font-semibold">Lễ tôn vinh "Tuổi trẻ cống hiến vì cộng đồng":</strong>
                      <span className="text-slate-600 font-normal">Đồng hành cùng Trung tâm Tình nguyện Quốc gia và Thành Đoàn Hà Nội trong các phong trào tình nguyện lớn.</span>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-7">
              <Reveal delay={200} direction="right">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="rounded-2xl overflow-hidden shadow-xl border border-slate-200 group hover:-translate-y-2 transition-transform duration-300">
                    <div className="h-64 overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80"
                        alt="Thiện nguyện vùng cao"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                    <div className="p-4 bg-white text-xs">
                      <span className="font-bold text-[#0A1E5E] block text-sm">Lan tỏa yêu thương vùng cao Sìn Hồ</span>
                      <span className="text-slate-500 font-normal">Trường Hải Event & Đoàn thiện nguyện thanh niên</span>
                    </div>
                  </div>

                  <div className="rounded-2xl overflow-hidden shadow-xl border border-slate-200 sm:translate-y-6 group hover:-translate-y-2 transition-transform duration-300">
                    <div className="h-64 overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80"
                        alt="Chắp cánh ước mơ Yên Bái"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                    <div className="p-4 bg-white text-xs">
                      <span className="font-bold text-[#0A1E5E] block text-sm">Chắp cánh ước mơ - Yên Bái</span>
                      <span className="text-slate-500 font-normal">Tài trợ điểm trường và học bổng học sinh nghèo</span>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          9. CLOSING CALL TO ACTION BANNER (SCALE UP REVEAL)
      ========================================================================= */}
      <section className="bg-[#050D26] text-white py-20 relative overflow-hidden border-t border-[#D4AF37]/30">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#123282_0%,_#050D26_75%)] opacity-80" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-7">
          <Reveal delay={100} direction="none">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/10 text-xs font-semibold text-[#D4AF37] border border-[#D4AF37]/40 shadow-inner">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Đồng Hành Kiến Tạo Những Sự Kiện Để Đời</span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white max-w-4xl mx-auto leading-tight mt-4">
              Sẵn Sàng Cho Một Sự Kiện <br />
              <span className="bg-gradient-to-r from-[#FFF4B8] via-[#D4AF37] to-[#F59E0B] bg-clip-text text-transparent">
                Thăng Hoa & Đẳng Cấp?
              </span>
            </h2>

            <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto font-normal leading-relaxed mt-4">
              Liên hệ ngay với Trường Hải Event & Travel hôm nay để nhận kịch bản độc quyền, phương án tối ưu ngân sách và bảng báo giá chi tiết trong vòng 30 phút.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              <Link
                href="/dich-vu#bao-gia"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-[#D4AF37] via-[#f5d774] to-[#D4AF37] text-[#050D26] shadow-[0_0_25px_rgba(212,175,55,0.35)] hover:scale-105 active:scale-95 transition-all duration-200 anim-halo"
              >
                Gửi Yêu Cầu Báo Giá Trực Tuyến
              </Link>

              <a
                href={`tel:${COMPANY_INFO.hotline}`}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-sm bg-white/10 hover:bg-white/20 border border-white/25 text-white flex items-center justify-center transition-all duration-200 backdrop-blur-md hover:scale-105"
              >
                <Phone className="w-4 h-4 mr-2 text-[#D4AF37]" />
                Hotline 24/7: {COMPANY_INFO.hotlineDisplay}
              </a>
            </div>

            <div className="pt-8 border-t border-white/10 text-xs text-slate-400 space-y-1 font-normal">
              <p>
                Trụ sở: {COMPANY_INFO.address}
              </p>
              <p>
                Email: {COMPANY_INFO.email} • Giám đốc: {COMPANY_INFO.director} • MST: {COMPANY_INFO.taxId}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

<<<<<<< Updated upstream
      {/* =========================================================================
          FLOATING QUICK CONTACT BUTTONS (BOFU - CHỐT ĐƠN 24/7)
      ========================================================================= */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2.5 pointer-events-auto">
        {/* Zalo Button */}
        <a
          href="https://zalo.me/0844198333"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackLandingLead("ZALO")}
          className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white shadow-xl hover:scale-110 active:scale-95 transition-all duration-200 hover:shadow-blue-500/50"
          title="Chat Zalo Tư Vấn Nhanh"
        >
          <span className="font-bold text-xs tracking-tight">Zalo</span>
          <span className="absolute right-14 whitespace-nowrap bg-slate-900 text-white text-xs px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md">
            Chat Zalo tư vấn ngay
          </span>
        </a>

        {/* Hotline Call Button with Pulse Ring */}
        <a
          href={`tel:${COMPANY_INFO.hotline}`}
          onClick={() => trackLandingLead("HOTLINE")}
          className="group relative flex items-center gap-2 pl-3 pr-4 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-[#D4AF37] text-[#050D26] font-bold text-xs shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200"
          title={`Gọi Hotline ${COMPANY_INFO.hotlineDisplay}`}
        >
          <span className="absolute -inset-1 rounded-full bg-amber-400 opacity-30 animate-ping -z-10" />
          <div className="w-6 h-6 rounded-full bg-[#050D26] text-[#D4AF37] flex items-center justify-center shrink-0">
            <Phone className="w-3.5 h-3.5" />
          </div>
          <span className="hidden sm:inline-block font-semibold">
            Hotline: {COMPANY_INFO.hotlineDisplay}
          </span>
        </a>
      </div>
=======
>>>>>>> Stashed changes
    </div>
  );
}
