"use client";

import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  Briefcase,
  Calendar,
  Camera,
  CheckCircle2,
  ChevronRight,
  Clock,
  DollarSign,
  Download,
  Edit3,
  ExternalLink,
  Eye,
  FileCheck,
  FileText,
  Filter,
  HelpCircle,
  Info,
  Layers,
  MapPin,
  Paperclip,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  Star,
  Trash2,
  TrendingUp,
  Users,
  Wrench,
  X,
} from "lucide-react";
import {
  EventProfile,
  EventCategory,
  getStoredEventProfiles,
  saveEventProfilesToStorage,
  addEventProfile,
  updateEventProfile,
  deleteEventProfile,
  fetchAndSyncRealEventProfiles,
  setupRealtimeEventProfilesSync,
} from "./event-profiles-data";
import {
  generateCaseStudyArticle,
  saveGeneratedCaseStudyToCMS,
  formatVND,
  GeneratedCaseStudyResult,
} from "./event-case-study-generator";

interface EventProfileArchiveProps {
  onOpenInRadarEditor?: (post: any) => void;
  onPostCreated?: (post: any) => void;
}

const CATEGORY_STYLES: Record<EventCategory, { badge: string; text: string }> = {
  "khai-truong": { badge: "bg-amber-50 text-amber-800 border-amber-200", text: "text-amber-700" },
  "gala-dinner": { badge: "bg-purple-50 text-purple-800 border-purple-200", text: "text-purple-700" },
  "hoi-nghi": { badge: "bg-blue-50 text-blue-800 border-blue-200", text: "text-blue-700" },
  "teambuilding": { badge: "bg-emerald-50 text-emerald-800 border-emerald-200", text: "text-emerald-700" },
  "thiet-bi": { badge: "bg-rose-50 text-rose-800 border-rose-200", text: "text-rose-700" },
  "le-hoi": { badge: "bg-cyan-50 text-cyan-800 border-cyan-200", text: "text-cyan-700" },
};

export default function EventProfileArchive({
  onOpenInRadarEditor,
  onPostCreated,
}: EventProfileArchiveProps) {
  // Dữ liệu hồ sơ sự kiện
  const [profiles, setProfiles] = useState<EventProfile[]>(() => getStoredEventProfiles());
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [syncedLeadCount, setSyncedLeadCount] = useState<number>(0);
  const [syncToast, setSyncToast] = useState<string | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"all" | EventCategory>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "completed" | "ongoing" | "archived">("all");
  const [originFilter, setOriginFilter] = useState<"all" | "crm" | "standard">("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Modal giải thích chi tiết khi ấn vào từng thẻ chỉ số & nút chức năng
  const [activeMetricModal, setActiveMetricModal] = useState<
    "total_events" | "revenue" | "rating" | "seo" | "sync_crm" | null
  >(null);

  // Tự động kết nối Supabase CRM & đồng bộ các sự kiện đã/đang tổ chức
  useEffect(() => {
    let isMounted = true;

    async function initialSync() {
      setIsSyncing(true);
      try {
        const res = await fetchAndSyncRealEventProfiles();
        if (isMounted) {
          setProfiles(res.profiles);
          setLastSyncTime(res.lastSyncTime);
          setSyncedLeadCount(res.syncedLeadCount);
        }
      } catch (err) {
        console.warn("Lỗi tự động đồng bộ CRM:", err);
      } finally {
        if (isMounted) setIsSyncing(false);
      }
    }

    initialSync();

    // Lắng nghe sự thay đổi Realtime từ Supabase (nếu sales chốt hợp đồng hoặc có lead mới)
    const unsubscribe = setupRealtimeEventProfilesSync((updatedProfiles) => {
      if (isMounted) {
        setProfiles(updatedProfiles);
        setLastSyncTime(new Date().toLocaleTimeString("vi-VN"));
        setSyncToast("🟢 Đã tự động cập nhật sự kiện mới từ CRM!");
        setTimeout(() => setSyncToast(null), 4000);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const handleManualSync = async () => {
    setIsSyncing(true);
    setSyncToast(null);
    try {
      const res = await fetchAndSyncRealEventProfiles();
      setProfiles(res.profiles);
      setLastSyncTime(res.lastSyncTime);
      setSyncedLeadCount(res.syncedLeadCount);
      setSyncToast(
        `Đã tự động đồng bộ thành công ${res.syncedLeadCount} sự kiện thực tế từ Supabase CRM!`
      );
      setTimeout(() => setSyncToast(null), 4000);
    } catch (err) {
      console.error("Lỗi đồng bộ:", err);
      setSyncToast("Đã cập nhật danh sách sự kiện từ bộ nhớ hệ thống.");
      setTimeout(() => setSyncToast(null), 4000);
    } finally {
      setIsSyncing(false);
    }
  };

  // Modal xem chi tiết hồ sơ
  const [viewingProfile, setViewingProfile] = useState<EventProfile | null>(null);
  const [detailTab, setDetailTab] = useState<"info" | "finance" | "gallery" | "docs">("info");

  // Modal thêm mới / sửa
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Modal tạo bài viết SEO Case Study
  const [generatingForProfile, setGeneratingForProfile] = useState<EventProfile | null>(null);
  const [generatedArticle, setGeneratedArticle] = useState<GeneratedCaseStudyResult | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [generationSuccessMsg, setGenerationSuccessMsg] = useState<string | null>(null);

  // Form state cho Thêm mới sự kiện
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<EventCategory>("khai-truong");
  const [newDate, setNewDate] = useState("2026-10-24");
  const [newClientCompany, setNewClientCompany] = useState("");
  const [newClientRep, setNewClientRep] = useState("");
  const [newClientPhone, setNewClientPhone] = useState("");
  const [newClientEmail, setNewClientEmail] = useState("");
  const [newVenue, setNewVenue] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newCity, setNewCity] = useState("Hà Nội");
  const [newGuestCount, setNewGuestCount] = useState<number>(200);
  const [newBudget, setNewBudget] = useState<number>(50000000);
  const [newActualCost, setNewActualCost] = useState<number>(35000000);
  const [newCoverImage, setNewCoverImage] = useState("/images/blog/khai-truong-showroom.jpg");
  const [newDirector, setNewDirector] = useState("Hoàng Minh Triết");
  const [newChiefEngineer, setNewChiefEngineer] = useState("Mr. Tuấn Anh");
  const [newSoundLightingLead, setNewSoundLightingLead] = useState("Trần Quang Huy");
  const [newMC, setNewMC] = useState("MC Đức Bảo");
  const [newHighlights, setNewHighlights] = useState("Nghi thức cắt băng khánh thành hoành tráng\nSân khấu LED P3 và âm thanh Line Array bùng nổ");
  const [newEquipment, setNewEquipment] = useState("Màn hình LED Indoor P3\nDàn loa Line Array RCF Italy\nĐèn Moving Beam 350W");
  const [newTestimonialQuote, setNewTestimonialQuote] = useState("");

  // Thống kê tổng quan
  const stats = useMemo(() => {
    const totalEvents = profiles.length;
    const totalRevenue = profiles.reduce((sum, p) => sum + p.financials.totalBudget, 0);
    const totalProfit = profiles.reduce((sum, p) => sum + p.financials.profit, 0);
    const avgProfitMargin =
      totalRevenue > 0 ? Math.round((totalProfit / totalRevenue) * 100) : 0;
    const seoArticlesCount = profiles.filter((p) => p.seoMeta?.isGenerated).length;

    return {
      totalEvents,
      totalRevenue,
      totalProfit,
      avgProfitMargin,
      seoArticlesCount,
    };
  }, [profiles]);

  // Danh sách hồ sơ đã lọc
  const filteredProfiles = useMemo(() => {
    return profiles.filter((p) => {
      // Filter origin (CRM vs Standard)
      if (originFilter === "crm" && !p.isAutoSynced) return false;
      if (originFilter === "standard" && p.isAutoSynced) return false;
      // Filter category
      if (categoryFilter !== "all" && p.category !== categoryFilter) return false;
      // Filter status
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      // Filter search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchTitle = p.title.toLowerCase().includes(query);
        const matchClient =
          p.client.company.toLowerCase().includes(query) ||
          p.client.representative.toLowerCase().includes(query);
        const matchVenue =
          p.location.venue.toLowerCase().includes(query) ||
          p.location.city.toLowerCase().includes(query);
        const matchKeyword = p.seoMeta?.suggestedKeyword.toLowerCase().includes(query);
        if (!matchTitle && !matchClient && !matchVenue && !matchKeyword) return false;
      }
      return true;
    });
  }, [profiles, originFilter, categoryFilter, statusFilter, searchQuery]);

  // Xử lý Xóa hồ sơ
  const handleDelete = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!window.confirm("Bạn có chắc chắn muốn xóa hồ sơ sự kiện này khỏi hệ thống lưu trữ?")) return;
    const updated = deleteEventProfile(id);
    setProfiles(updated);
    if (viewingProfile?.id === id) {
      setViewingProfile(null);
    }
  };

  // Khởi chạy tạo bài viết SEO Case Study
  const handleStartGenerateSeo = (profile: EventProfile, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setGeneratingForProfile(profile);
    setGenerationSuccessMsg(null);
    const result = generateCaseStudyArticle(profile);
    setGeneratedArticle(result);
  };

  // Lưu và xuất bản bài viết Case Study vào CMS
  const handleSaveAndPublishSeo = async (status: "published" | "draft") => {
    if (!generatingForProfile || !generatedArticle) return;
    setIsPublishing(true);

    try {
      const articleToSave = { ...generatedArticle, status };
      const savedPost = await saveGeneratedCaseStudyToCMS(
        articleToSave,
        generatingForProfile.id,
        (post) => {
          if (onPostCreated) {
            onPostCreated(post);
          }
        }
      );

      setProfiles(getStoredEventProfiles());

      setGenerationSuccessMsg(
        status === "published"
          ? `Đã xuất bản thành công bài viết lên trang Tin tức (/tin-tuc/${articleToSave.slug})!`
          : `Đã lưu bài viết vào danh sách nháp của bảng 'posts' thành công!`
      );
    } catch (err: any) {
      alert("Lỗi khi lưu bài viết: " + (err?.message || String(err)));
    } finally {
      setIsPublishing(false);
    }
  };

  // Chuyển bài viết sang Trình soạn thảo Radar SEO
  const handleOpenInEditor = () => {
    if (!generatedArticle || !onOpenInRadarEditor) return;
    onOpenInRadarEditor({
      title: generatedArticle.title,
      slug: generatedArticle.slug,
      content: generatedArticle.content,
      meta_description: generatedArticle.meta_description,
      focus_keyword: generatedArticle.focus_keyword,
      reading_time: generatedArticle.reading_time,
      status: "draft",
    });
    setGeneratingForProfile(null);
  };

  // Xử lý tạo mới hồ sơ sự kiện
  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newClientCompany.trim()) {
      alert("Vui lòng nhập tên sự kiện và công ty khách hàng.");
      return;
    }

    const profit = Math.max(0, newBudget - newActualCost);
    const profitMargin = newBudget > 0 ? Math.round((profit / newBudget) * 1000) / 10 : 0;

    const highlightsArr = newHighlights
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    const equipmentArr = newEquipment
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const categoryLabels: Record<EventCategory, string> = {
      "khai-truong": "Lễ Khai Trương",
      "gala-dinner": "Gala Dinner & Kỷ Niệm",
      "hoi-nghi": "Hội Nghị Quốc Tế",
      "teambuilding": "Teambuilding & Du Lịch",
      "thiet-bi": "Cho Thuê Thiết Bị AV",
      "le-hoi": "Lễ Hội & Festival",
    };

    addEventProfile({
      title: newTitle.trim(),
      category: newCategory,
      categoryLabel: categoryLabels[newCategory] || "Sự Kiện",
      status: "completed",
      statusLabel: "Đã hoàn thành",
      date: newDate,
      client: {
        name: newClientRep || "Đại diện công ty",
        company: newClientCompany.trim(),
        representative: newClientRep || newClientCompany.trim(),
        phone: newClientPhone || "0912 345 678",
        email: newClientEmail || "contact@client.vn",
        industry: "Doanh nghiệp đối tác",
      },
      location: {
        venue: newVenue.trim() || "Trung tâm tổ chức sự kiện",
        address: newAddress.trim() || "Khu đô thị mới",
        city: newCity.trim() || "Hà Nội",
      },
      guestCount: Number(newGuestCount) || 150,
      financials: {
        totalBudget: Number(newBudget) || 50000000,
        actualCost: Number(newActualCost) || 35000000,
        profit,
        profitMargin,
        paymentStatus: "paid_full",
        paymentStatusLabel: "Đã tất toán 100%",
        items: [
          {
            id: `cost-${Date.now()}-1`,
            category: "Sân khấu & Màn hình LED",
            description: "Gói sân khấu trọn gói và hiển thị visual đồ họa",
            unit: "Gói",
            quantity: 1,
            unitPrice: Math.round(newBudget * 0.4),
            totalPrice: Math.round(newBudget * 0.4),
          },
          {
            id: `cost-${Date.now()}-2`,
            category: "Âm thanh Ánh sáng & Kỹ thuật",
            description: "Hệ thống âm thanh Line Array và ánh sáng chuyên nghiệp",
            unit: "Gói",
            quantity: 1,
            unitPrice: Math.round(newBudget * 0.35),
            totalPrice: Math.round(newBudget * 0.35),
          },
          {
            id: `cost-${Date.now()}-3`,
            category: "Nhân sự & Nghi thức",
            description: "Đội ngũ MC, điều phối, PG và quà tặng nhận diện",
            unit: "Gói",
            quantity: 1,
            unitPrice: Math.round(newBudget * 0.25),
            totalPrice: Math.round(newBudget * 0.25),
          },
        ],
      },
      team: {
        director: newDirector || "Hoàng Minh Triết",
        chiefEngineer: newChiefEngineer || "Mr. Tuấn Anh",
        soundLightingLead: newSoundLightingLead || "Trần Quang Huy",
        mc: newMC || "MC Đức Bảo",
        coordinator: "Ekip Trường Hải",
      },
      keyHighlights:
        highlightsArr.length > 0
          ? highlightsArr
          : ["Tổ chức chỉn chu, kịch bản độc bản tạo dấu ấn thương hiệu sâu sắc"],
      equipmentList:
        equipmentArr.length > 0
          ? equipmentArr
          : ["Màn hình LED P3 cabin đúc", "Loa Line Array công suất lớn", "Hệ thống đèn Moving Beam"],
      coverImage: newCoverImage || "/images/blog/khai-truong-showroom.jpg",
      gallery: [
        {
          id: `gal-${Date.now()}-1`,
          url: newCoverImage || "/images/blog/khai-truong-showroom.jpg",
          caption: `Hình ảnh toàn cảnh sự kiện ${newTitle}`,
          phase: "main",
        },
      ],
      documents: [
        {
          id: `doc-${Date.now()}-1`,
          name: `Hop_dong_kinh_te_${newClientCompany.replace(/\s+/g, "_")}.pdf`,
          type: "contract",
          docNumber: `HĐ-TH/2026-${Date.now().toString().slice(-4)}`,
          fileSize: "2.1 MB",
          uploadDate: newDate,
          signedBy: `${newClientRep} & Trương Việt Hải`,
        },
      ],
      testimonial: newTestimonialQuote.trim()
        ? {
            author: newClientRep || "Đại diện khách hàng",
            position: "Đại diện lãnh đạo",
            company: newClientCompany,
            quote: newTestimonialQuote.trim(),
            rating: 5,
          }
        : undefined,
      seoMeta: {
        suggestedKeyword: `tổ chức ${newTitle.toLowerCase()}`,
        suggestedSlug: `ho-so-du-an-${Date.now().toString().slice(-6)}`,
        isGenerated: false,
      },
    });

    setProfiles(getStoredEventProfiles());
    setIsAddModalOpen(false);

    // Reset form
    setNewTitle("");
    setNewClientCompany("");
    setNewClientRep("");
    setNewVenue("");
    setNewTestimonialQuote("");
  };

  return (
    <div className="space-y-6">
      {/* =====================================================================
          HEADER BAR: EXECUTIVE, CLEAN & SCIENTIFIC
      ===================================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#A78113]">
            TRƯỜNG HẢI EVENT &amp; TRAVEL
          </p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            Hồ sơ sự kiện &amp; Dự án đã tổ chức
          </h1>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
          <div className="inline-flex items-center rounded-xl border border-slate-200 bg-white p-0.5 shadow-sm">
            <button
              type="button"
              onClick={handleManualSync}
              disabled={isSyncing}
              className="inline-flex items-center gap-2 hover:bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 rounded-lg transition disabled:opacity-50"
              title="Đồng bộ danh sách sự kiện từ CRM"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${isSyncing ? "animate-spin text-[#0A1E5E]" : ""}`} />
              <span>{isSyncing ? "Đang đồng bộ..." : "Đồng bộ CRM"}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveMetricModal("sync_crm")}
              className="p-2 text-slate-400 hover:text-[#0A1E5E] hover:bg-slate-50 rounded-lg transition"
              title="Tìm hiểu: Tính năng Đồng bộ CRM là gì?"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#0A1E5E] hover:bg-[#142d75] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm hồ sơ sự kiện</span>
          </button>
        </div>
      </div>

      {/* Toast thông báo nhanh */}
      {syncToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 text-white px-4 py-3 text-xs font-semibold shadow-xl border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{syncToast}</span>
        </div>
      )}

      {/* =====================================================================
          4 METRIC KPI CARDS: ENTERPRISE STANDARD (CLICKABLE DETAILS)
      ===================================================================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Tổng sự kiện */}
        <div
          onClick={() => setActiveMetricModal("total_events")}
          className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs hover:shadow-md hover:border-[#0A1E5E]/40 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer relative"
          title="Nhấp để xem chi tiết: Tổng sự kiện lưu trữ là gì?"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-semibold text-slate-500 group-hover:text-[#0A1E5E] transition-colors">
                  Tổng sự kiện lưu trữ
                </p>
                <Info className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0A1E5E] transition-colors" />
              </div>
              <p className="mt-2 text-2xl font-black tracking-tight text-slate-900">{stats.totalEvents} dự án</p>
            </div>
            <span className="rounded-xl bg-blue-50 border border-blue-100 p-2.5 text-blue-600 group-hover:scale-105 transition-transform">
              <Briefcase className="h-5 w-5" />
            </span>
          </div>
          <div className="mt-2.5 flex items-center justify-between text-xs font-semibold text-emerald-600">
            <span className="flex items-center">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> 100% hoàn thành
            </span>
            <span className="text-[11px] text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity font-bold">
              Chi tiết →
            </span>
          </div>
        </div>

        {/* Card 2: Doanh số hợp đồng */}
        <div
          onClick={() => setActiveMetricModal("revenue")}
          className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs hover:shadow-md hover:border-amber-500/40 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer relative"
          title="Nhấp để xem chi tiết: Doanh số hợp đồng là gì?"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-semibold text-slate-500 group-hover:text-amber-800 transition-colors">
                  Doanh số hợp đồng
                </p>
                <Info className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600 transition-colors" />
              </div>
              <p className="mt-2 text-2xl font-black tracking-tight text-slate-900">{formatVND(stats.totalRevenue)}</p>
            </div>
            <span className="rounded-xl bg-amber-50 border border-amber-100 p-2.5 text-amber-600 group-hover:scale-105 transition-transform">
              <DollarSign className="h-5 w-5" />
            </span>
          </div>
          <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Biên lợi nhuận ~{stats.avgProfitMargin}%</span>
            <span className="text-[11px] text-amber-700 opacity-0 group-hover:opacity-100 transition-opacity font-bold">
              Chi tiết →
            </span>
          </div>
        </div>

        {/* Card 3: Đánh giá khách hàng */}
        <div
          onClick={() => setActiveMetricModal("rating")}
          className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs hover:shadow-md hover:border-emerald-500/40 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer relative"
          title="Nhấp để xem chi tiết: Đánh giá khách hàng là gì?"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-semibold text-slate-500 group-hover:text-emerald-800 transition-colors">
                  Đánh giá khách hàng
                </p>
                <Info className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
              </div>
              <p className="mt-2 text-2xl font-black tracking-tight text-slate-900">5.0 / 5.0 ⭐</p>
            </div>
            <span className="rounded-xl bg-amber-50 border border-amber-100 p-2.5 text-amber-500 group-hover:scale-105 transition-transform">
              <Star className="h-5 w-5 fill-amber-500" />
            </span>
          </div>
          <div className="mt-2.5 flex items-center justify-between text-xs font-semibold text-emerald-600">
            <span>Hài lòng tuyệt đối</span>
            <span className="text-[11px] text-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity font-bold">
              Phản hồi →
            </span>
          </div>
        </div>

        {/* Card 4: Bài viết SEO Case Study */}
        <div
          onClick={() => setActiveMetricModal("seo")}
          className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs hover:shadow-md hover:border-purple-500/40 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer relative"
          title="Nhấp để xem chi tiết: Bài viết SEO Case Study là gì?"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-semibold text-slate-500 group-hover:text-purple-800 transition-colors">
                  Bài viết SEO Case Study
                </p>
                <Info className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-600 transition-colors" />
              </div>
              <p className="mt-2 text-2xl font-black tracking-tight text-purple-700">
                {stats.seoArticlesCount} / {stats.totalEvents} bài
              </p>
            </div>
            <span className="rounded-xl bg-purple-50 border border-purple-100 p-2.5 text-purple-600 group-hover:scale-105 transition-transform">
              <Sparkles className="h-5 w-5" />
            </span>
          </div>
          <div className="mt-2.5 flex items-center justify-between text-xs font-medium text-purple-600">
            <span>Tích hợp Radar SEO AI</span>
            <span className="text-[11px] text-purple-700 opacity-0 group-hover:opacity-100 transition-opacity font-bold">
              Khám phá →
            </span>
          </div>
        </div>
      </div>

      {/* =====================================================================
          FILTER & SEARCH TOOLBAR: CLEAN & PROFESSIONAL
      ===================================================================== */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo tên sự kiện, khách hàng, địa điểm, từ khóa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-200 text-slate-800 text-xs outline-none focus:border-[#0A1E5E] focus:ring-1 focus:ring-[#0A1E5E] placeholder:text-slate-400 transition"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as any)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 outline-none focus:border-[#0A1E5E]"
          >
            <option value="all">Tất cả loại hình ({profiles.length})</option>
            <option value="khai-truong">Lễ Khai Trương</option>
            <option value="gala-dinner">Gala Dinner &amp; Kỷ Niệm</option>
            <option value="hoi-nghi">Hội Nghị Quốc Tế</option>
            <option value="teambuilding">Teambuilding &amp; Du Lịch</option>
          </select>

          {/* Status Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 outline-none focus:border-[#0A1E5E]"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="completed">Đã hoàn thành</option>
            <option value="ongoing">Đang diễn ra</option>
            <option value="archived">Lưu trữ</option>
          </select>

          {/* Origin Dropdown: All vs CRM vs Standard */}
          <select
            value={originFilter}
            onChange={(e) => setOriginFilter(e.target.value as any)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 outline-none focus:border-[#0A1E5E]"
          >
            <option value="all">Tất cả nguồn ({profiles.length})</option>
            <option value="crm">Đồng bộ CRM ({profiles.filter((p) => p.isAutoSynced).length})</option>
            <option value="standard">Hồ sơ nội bộ ({profiles.filter((p) => !p.isAutoSynced).length})</option>
          </select>

          {/* View Mode */}
          <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                viewMode === "grid"
                  ? "bg-white text-[#0A1E5E] shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Lưới Card
            </button>
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                viewMode === "table"
                  ? "bg-white text-[#0A1E5E] shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Bảng Danh Sách
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================================
          MAIN DISPLAY: GRID VIEW OR TABLE VIEW
      ===================================================================== */}
      {filteredProfiles.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-sm">
          <Briefcase className="w-12 h-12 mx-auto text-slate-400 mb-3 opacity-60" />
          <p className="text-base font-bold text-slate-800">Không tìm thấy hồ sơ sự kiện phù hợp</p>
          <p className="text-xs text-slate-400 mt-1">Thử thay đổi từ khóa tìm kiếm hoặc làm mới bộ lọc.</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredProfiles.map((p) => {
            const catStyle = CATEGORY_STYLES[p.category] || CATEGORY_STYLES["khai-truong"];
            const isSeoGenerated = Boolean(p.seoMeta?.isGenerated);

            return (
              <div
                key={p.id}
                onClick={() => {
                  setViewingProfile(p);
                  setDetailTab("info");
                }}
                className="group relative flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-[#0A1E5E]/40 transition-all duration-200 cursor-pointer overflow-hidden"
              >
                {/* Header Image */}
                <div className="relative h-44 w-full rounded-xl overflow-hidden bg-slate-100 mb-4 border border-slate-100">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                    style={{ backgroundImage: `url(${p.coverImage})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                  {/* Category Pill */}
                  <div className="absolute top-3 left-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border ${catStyle.badge} shadow-sm backdrop-blur-md`}
                    >
                      {p.categoryLabel}
                    </span>
                  </div>

                  {/* Status Pill */}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.status === "ongoing"
                          ? "bg-blue-600 text-white shadow-sm animate-pulse"
                          : "bg-emerald-600 text-white shadow-sm"
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-white mr-1.5" />
                      {p.statusLabel}
                    </span>
                  </div>

                  {/* Budget & Date */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                    <span className="font-extrabold text-amber-300 text-sm">
                      {formatVND(p.financials.totalBudget)}
                    </span>
                    <span className="text-[11px] text-slate-200 flex items-center font-medium">
                      <Calendar className="w-3.5 h-3.5 mr-1 text-amber-300" />
                      {p.date.split("-").reverse().join("/")}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 group-hover:text-[#0A1E5E] transition-colors line-clamp-2 leading-snug">
                      {p.title}
                    </h3>

                    <p className="text-xs text-slate-600 font-semibold mt-1.5 line-clamp-1">
                      🏢 {p.client.company}
                    </p>

                    <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                      <div className="flex items-center">
                        <MapPin className="w-3.5 h-3.5 mr-2 text-rose-500 shrink-0" />
                        <span className="truncate">{p.location.venue} ({p.location.city})</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="w-3.5 h-3.5 mr-2 text-blue-600 shrink-0" />
                        <span>Quy mô: <strong>{p.guestCount} khách VIP</strong></span>
                      </div>
                      <div className="flex items-center">
                        <Paperclip className="w-3.5 h-3.5 mr-2 text-amber-600 shrink-0" />
                        <span>Tài liệu &amp; hợp đồng: <strong>{p.documents.length} tệp tin</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & SEO indicator */}
                  <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
                    {isSeoGenerated ? (
                      <span className="inline-flex items-center text-[10px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Đã sinh bài SEO
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-medium">
                        Chưa sinh bài SEO
                      </span>
                    )}

                    <div className="flex items-center space-x-1.5">
                      <button
                        type="button"
                        onClick={(e) => handleStartGenerateSeo(p, e)}
                        className="px-3 py-1.5 rounded-lg bg-[#0A1E5E] hover:bg-[#142d75] text-white text-xs font-bold shadow-sm flex items-center space-x-1 transition"
                        title="Tạo bài viết SEO chuẩn E-E-A-T từ hồ sơ này"
                      >
                        <Sparkles className="w-3 h-3 text-amber-300" />
                        <span>Viết bài SEO</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleDelete(p.id, e)}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition"
                        title="Xóa hồ sơ sự kiện"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 uppercase text-[11px] text-slate-500 border-b border-slate-200 font-bold">
              <tr>
                <th className="py-3 px-4">Tên sự kiện / Dự án</th>
                <th className="py-3 px-4">Khách hàng &amp; Địa điểm</th>
                <th className="py-3 px-4">Ngày tổ chức</th>
                <th className="py-3 px-4">Quy mô</th>
                <th className="py-3 px-4">Tổng chi phí</th>
                <th className="py-3 px-4">Trạng thái SEO</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProfiles.map((p) => {
                const catStyle = CATEGORY_STYLES[p.category] || CATEGORY_STYLES["khai-truong"];
                const isSeoGenerated = Boolean(p.seoMeta?.isGenerated);

                return (
                  <tr
                    key={p.id}
                    onClick={() => {
                      setViewingProfile(p);
                      setDetailTab("info");
                    }}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-extrabold text-slate-900 text-xs">{p.title}</div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${catStyle.badge}`}
                        >
                          {p.categoryLabel}
                        </span>
                        {p.isAutoSynced && (
                          <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            ⚡ CRM
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800">{p.client.company}</div>
                      <div className="text-[11px] text-slate-500 truncate max-w-xs">
                        {p.location.venue} ({p.location.city})
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-600 font-mono font-medium">
                      {p.date.split("-").reverse().join("/")}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {p.guestCount} khách
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-extrabold text-slate-900">
                        {formatVND(p.financials.totalBudget)}
                      </span>
                      <div className="text-[10px] text-emerald-600 font-semibold">
                        Lãi: {formatVND(p.financials.profit)} ({p.financials.profitMargin}%)
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {isSeoGenerated ? (
                        <span className="inline-flex items-center text-[10px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Đã sinh bài
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">Chưa sinh</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-1.5">
                      <button
                        type="button"
                        onClick={(e) => handleStartGenerateSeo(p, e)}
                        className="px-2.5 py-1 rounded-lg bg-[#0A1E5E] hover:bg-[#142d75] text-white font-bold text-[11px] inline-flex items-center space-x-1"
                      >
                        <Sparkles className="w-3 h-3 text-amber-300" />
                        <span>Viết SEO</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleDelete(p.id, e)}
                        className="p-1 rounded border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* =====================================================================
          MODAL 1: CHI TIẾT HỒ SƠ SỰ KIỆN (DRILL-DOWN MODAL)
      ===================================================================== */}
      {viewingProfile && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-white text-slate-900 shadow-2xl border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4 bg-slate-50/70">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#0A1E5E] text-white">
                    {viewingProfile.categoryLabel}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    Mã hồ sơ: <strong>{viewingProfile.id}</strong>
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                  {viewingProfile.title}
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Khách hàng: <strong>{viewingProfile.client.company}</strong> ({viewingProfile.client.representative})
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleStartGenerateSeo(viewingProfile)}
                  className="px-3.5 py-2 rounded-xl bg-[#0A1E5E] hover:bg-[#142d75] text-white text-xs font-bold shadow-sm flex items-center space-x-1.5"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Viết bài SEO</span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewingProfile(null)}
                  className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center border-b border-slate-200 px-6 bg-white overflow-x-auto">
              <button
                type="button"
                onClick={() => setDetailTab("info")}
                className={`py-3 px-4 text-xs font-bold border-b-2 transition ${
                  detailTab === "info"
                    ? "border-[#0A1E5E] text-[#0A1E5E]"
                    : "border-transparent text-slate-500 hover:text-slate-900"
                }`}
              >
                1. Thông tin &amp; Ekip
              </button>

              <button
                type="button"
                onClick={() => setDetailTab("finance")}
                className={`py-3 px-4 text-xs font-bold border-b-2 transition ${
                  detailTab === "finance"
                    ? "border-[#0A1E5E] text-[#0A1E5E]"
                    : "border-transparent text-slate-500 hover:text-slate-900"
                }`}
              >
                2. Báo giá &amp; Chi phí bóc tách
              </button>

              <button
                type="button"
                onClick={() => setDetailTab("gallery")}
                className={`py-3 px-4 text-xs font-bold border-b-2 transition ${
                  detailTab === "gallery"
                    ? "border-[#0A1E5E] text-[#0A1E5E]"
                    : "border-transparent text-slate-500 hover:text-slate-900"
                }`}
              >
                3. Thư viện ảnh ({viewingProfile.gallery.length})
              </button>

              <button
                type="button"
                onClick={() => setDetailTab("docs")}
                className={`py-3 px-4 text-xs font-bold border-b-2 transition ${
                  detailTab === "docs"
                    ? "border-[#0A1E5E] text-[#0A1E5E]"
                    : "border-transparent text-slate-500 hover:text-slate-900"
                }`}
              >
                4. Hợp đồng &amp; Tài liệu ({viewingProfile.documents.length})
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm">
              {detailTab === "info" && (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A1E5E]">
                        Thông Tin Khách Hàng
                      </h4>
                      <p><strong>Công ty:</strong> {viewingProfile.client.company}</p>
                      <p><strong>Người đại diện:</strong> {viewingProfile.client.representative}</p>
                      <p><strong>Điện thoại:</strong> {viewingProfile.client.phone}</p>
                      <p><strong>Email:</strong> {viewingProfile.client.email}</p>
                      <p><strong>Ngành nghề:</strong> {viewingProfile.client.industry}</p>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A1E5E]">
                        Địa Điểm &amp; Quy Mô
                      </h4>
                      <p><strong>Địa điểm:</strong> {viewingProfile.location.venue}</p>
                      <p><strong>Sảnh tiệc:</strong> {viewingProfile.location.hall || "Sảnh chính"}</p>
                      <p><strong>Địa chỉ:</strong> {viewingProfile.location.address}, {viewingProfile.location.city}</p>
                      <p><strong>Số lượng khách:</strong> {viewingProfile.guestCount} khách VIP</p>
                      <p><strong>Ngày tổ chức:</strong> {viewingProfile.date.split("-").reverse().join("/")}</p>
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A1E5E]">
                      Điểm Nhấn Sáng Tạo &amp; Nghi Thức
                    </h4>
                    <ul className="list-disc pl-5 space-y-1 text-xs text-slate-700">
                      {viewingProfile.keyHighlights.map((hl, i) => (
                        <li key={i}>{hl}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Team */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A1E5E]">
                      Đội Ngũ Nhân Sự Vận Hành
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className="text-slate-500 block">Tổng đạo diễn:</span>
                        <strong className="text-slate-900">{viewingProfile.team.director}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Chỉ huy kỹ thuật:</span>
                        <strong className="text-slate-900">{viewingProfile.team.chiefEngineer}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Phụ trách âm thanh:</span>
                        <strong className="text-slate-900">{viewingProfile.team.soundLightingLead}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block">MC dẫn chương trình:</span>
                        <strong className="text-slate-900">{viewingProfile.team.mc}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Điều phối viên:</span>
                        <strong className="text-slate-900">{viewingProfile.team.coordinator}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Testimonial */}
                  {viewingProfile.testimonial && (
                    <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 text-slate-800">
                      <div className="flex items-center gap-1 text-amber-500 mb-2">
                        {[...Array(viewingProfile.testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-500" />
                        ))}
                        <span className="text-xs font-bold text-slate-900 ml-2">Đánh giá 5.0 sao từ khách hàng</span>
                      </div>
                      <blockquote className="italic text-xs leading-relaxed text-slate-700">
                        &ldquo;{viewingProfile.testimonial.quote}&rdquo;
                      </blockquote>
                      <p className="text-right text-xs font-bold text-slate-900 mt-2">
                        — {viewingProfile.testimonial.author} ({viewingProfile.testimonial.position})
                      </p>
                    </div>
                  )}
                </div>
              )}

              {detailTab === "finance" && (
                <div className="space-y-6">
                  {/* Financial Metrics */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                      <span className="text-xs text-slate-500">Giá trị hợp đồng:</span>
                      <p className="text-lg font-black text-[#A78113] mt-1">
                        {formatVND(viewingProfile.financials.totalBudget)}
                      </p>
                    </div>
                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                      <span className="text-xs text-slate-500">Chi phí thực tế:</span>
                      <p className="text-lg font-black text-slate-700 mt-1">
                        {formatVND(viewingProfile.financials.actualCost)}
                      </p>
                    </div>
                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                      <span className="text-xs text-slate-500">Lợi nhuận gộp:</span>
                      <p className="text-lg font-black text-emerald-600 mt-1">
                        {formatVND(viewingProfile.financials.profit)}
                      </p>
                    </div>
                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                      <span className="text-xs text-slate-500">Tỷ suất lợi nhuận:</span>
                      <p className="text-lg font-black text-purple-700 mt-1">
                        {viewingProfile.financials.profitMargin}%
                      </p>
                    </div>
                  </div>

                  {/* Cost Breakdown Table */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
                      Bảng Bóc Tách Chi Phí Hạng Mục Thực Tế
                    </h4>
                    <div className="overflow-x-auto rounded-xl border border-slate-200">
                      <table className="w-full text-left text-xs text-slate-700">
                        <thead className="bg-slate-50 uppercase text-[10px] text-slate-500 border-b border-slate-200">
                          <tr>
                            <th className="py-2.5 px-3">Hạng mục</th>
                            <th className="py-2.5 px-3">Chi tiết kỹ thuật</th>
                            <th className="py-2.5 px-3 text-center">Số lượng</th>
                            <th className="py-2.5 px-3 text-right">Đơn giá</th>
                            <th className="py-2.5 px-3 text-right">Thành tiền</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {viewingProfile.financials.items.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50/60">
                              <td className="py-2.5 px-3 font-bold text-slate-900">{item.category}</td>
                              <td className="py-2.5 px-3 text-slate-600">{item.description}</td>
                              <td className="py-2.5 px-3 text-center">{item.quantity} {item.unit}</td>
                              <td className="py-2.5 px-3 text-right">{formatVND(item.unitPrice)}</td>
                              <td className="py-2.5 px-3 text-right font-extrabold text-slate-900">
                                {formatVND(item.totalPrice)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {detailTab === "gallery" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {viewingProfile.gallery.map((img) => (
                    <div
                      key={img.id}
                      className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm"
                    >
                      <div
                        className="h-40 bg-cover bg-center"
                        style={{ backgroundImage: `url(${img.url})` }}
                      />
                      <div className="p-3">
                        <p className="text-xs text-slate-700 font-medium line-clamp-2">{img.caption}</p>
                        <span className="inline-block mt-1 text-[10px] font-bold text-[#A78113] uppercase">
                          Giai đoạn: {img.phase}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {detailTab === "docs" && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-500">
                    Danh mục hồ sơ tài liệu cũ, hợp đồng đã ký kết và biên bản bàn giao:
                  </p>
                  <div className="space-y-2">
                    {viewingProfile.documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-100 transition"
                      >
                        <div className="flex items-center space-x-3">
                          <FileCheck className="w-5 h-5 text-[#0A1E5E]" />
                          <div>
                            <p className="text-xs font-bold text-slate-900">{doc.name}</p>
                            <p className="text-[10px] text-slate-500">
                              Mã số: {doc.docNumber || "Chưa cấp"} · Dung lượng: {doc.fileSize} · Người ký: {doc.signedBy || "Hai bên"}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => alert(`Đang tải tệp tin: ${doc.name}`)}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center space-x-1 shadow-sm"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Tải về</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200 flex items-center justify-between bg-slate-50">
              <span className="text-xs text-slate-500">
                Trường Hải Event &amp; Travel · Hotline: 096.388.9830
              </span>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setViewingProfile(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-xs font-bold text-slate-700"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  onClick={() => handleStartGenerateSeo(viewingProfile)}
                  className="px-4 py-2 rounded-xl bg-[#0A1E5E] hover:bg-[#142d75] text-white text-xs font-bold shadow-sm flex items-center space-x-1.5"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Viết bài SEO từ hồ sơ này</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 2: TẠO BÀI VIẾT SEO CASE STUDY TỪ HỒ SƠ
      ===================================================================== */}
      {generatingForProfile && generatedArticle && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-white text-slate-900 shadow-2xl border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4 bg-slate-50/70">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-bold uppercase mb-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Bài viết SEO Case Study</span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  {generatingForProfile.title}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tổng hợp từ hồ sơ dự án thực tế của Trường Hải Event.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setGeneratingForProfile(null)}
                className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {generationSuccessMsg && (
              <div className="px-6 py-3 bg-emerald-50 border-b border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between">
                <span className="flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600" />
                  {generationSuccessMsg}
                </span>
                <Link
                  href={`/tin-tuc/${generatedArticle.slug}`}
                  target="_blank"
                  className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[11px] hover:bg-emerald-700 inline-flex items-center shadow-sm"
                >
                  Xem bài viết trên web <ExternalLink className="w-3 h-3 ml-1" />
                </Link>
              </div>
            )}

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50">
                <div>
                  <span className="text-slate-500 block font-semibold">Từ khóa SEO (Focus Keyword):</span>
                  <strong className="text-slate-900 text-sm">{generatedArticle.focus_keyword}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block font-semibold">Đường dẫn Slug:</span>
                  <span className="font-mono text-purple-700 truncate block">/tin-tuc/{generatedArticle.slug}</span>
                </div>
                <div>
                  <span className="text-slate-500 block font-semibold">Thời gian đọc dự kiến:</span>
                  <strong className="text-emerald-700">{generatedArticle.reading_time} (khoảng 2.000 từ)</strong>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1">
                <span className="text-slate-500 font-semibold block">Tiêu đề bài viết SEO (H1):</span>
                <p className="text-sm font-extrabold text-slate-900">{generatedArticle.title}</p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1">
                <span className="text-slate-500 font-semibold block">Thẻ mô tả (Meta Description):</span>
                <p className="text-xs text-slate-600 italic">{generatedArticle.meta_description}</p>
              </div>

              {/* Preview Markdown Box */}
              <div className="space-y-1">
                <span className="text-slate-500 font-semibold block">Nội dung bài viết (Xem trước):</span>
                <div className="max-h-64 overflow-y-auto p-4 rounded-xl border border-slate-200 bg-slate-50 font-mono text-[11px] text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {generatedArticle.content}
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="p-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50">
              <button
                type="button"
                onClick={handleOpenInEditor}
                className="px-4 py-2 rounded-xl border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-bold flex items-center space-x-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Mở trong Bộ Soạn Thảo Radar SEO để tối ưu thêm</span>
              </button>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  disabled={isPublishing}
                  onClick={() => handleSaveAndPublishSeo("draft")}
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold"
                >
                  Lưu bản nháp
                </button>

                <button
                  type="button"
                  disabled={isPublishing}
                  onClick={() => handleSaveAndPublishSeo("published")}
                  className="px-4 py-2 rounded-xl bg-[#0A1E5E] hover:bg-[#142d75] text-white text-xs font-bold shadow-sm flex items-center space-x-1.5"
                >
                  <Award className="w-4 h-4 text-amber-300" />
                  <span>{isPublishing ? "Đang xuất bản..." : "Duyệt & Xuất bản lên web"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 3: THÊM HỒ SƠ SỰ KIỆN MỚI (+)
      ===================================================================== */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl bg-white text-slate-900 shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Thêm hồ sơ sự kiện mới</h3>
                <p className="text-xs text-slate-500 mt-0.5">Nhập thông tin dự án để lưu trữ và quản lý</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProfile} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Tên sự kiện / Dự án *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Lễ Ra Mắt Sản Phẩm Mới VinFast 2026"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 outline-none focus:border-[#0A1E5E] focus:ring-1 focus:ring-[#0A1E5E]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Loại hình sự kiện *</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 outline-none focus:border-[#0A1E5E]"
                  >
                    <option value="khai-truong">Lễ Khai Trương / Khánh Thành</option>
                    <option value="gala-dinner">Gala Dinner &amp; Kỷ Niệm</option>
                    <option value="hoi-nghi">Hội Nghị / Hội Thảo</option>
                    <option value="teambuilding">Teambuilding &amp; Tour</option>
                    <option value="thiet-bi">Cho Thuê Thiết Bị AV</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Ngày tổ chức *</label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 outline-none focus:border-[#0A1E5E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Tên công ty / Khách hàng *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Tập Đoàn Hòa Phát"
                    value={newClientCompany}
                    onChange={(e) => setNewClientCompany(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 outline-none focus:border-[#0A1E5E]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Người đại diện</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Mr. Nguyễn Văn A"
                    value={newClientRep}
                    onChange={(e) => setNewClientRep(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 outline-none focus:border-[#0A1E5E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Địa điểm</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Khách sạn Meliá"
                    value={newVenue}
                    onChange={(e) => setNewVenue(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 outline-none focus:border-[#0A1E5E]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Thành phố</label>
                  <input
                    type="text"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 outline-none focus:border-[#0A1E5E]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Số lượng khách</label>
                  <input
                    type="number"
                    value={newGuestCount}
                    onChange={(e) => setNewGuestCount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 outline-none focus:border-[#0A1E5E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Tổng ngân sách hợp đồng (VNĐ)</label>
                  <input
                    type="number"
                    step="1000000"
                    value={newBudget}
                    onChange={(e) => setNewBudget(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 outline-none focus:border-[#0A1E5E]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Chi phí thực tế vận hành (VNĐ)</label>
                  <input
                    type="number"
                    step="1000000"
                    value={newActualCost}
                    onChange={(e) => setNewActualCost(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 outline-none focus:border-[#0A1E5E]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Điểm nhấn sự kiện (mỗi dòng một ý)</label>
                <textarea
                  rows={2}
                  value={newHighlights}
                  onChange={(e) => setNewHighlights(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 outline-none focus:border-[#0A1E5E]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Đánh giá của khách hàng</label>
                <textarea
                  rows={2}
                  placeholder="Trường Hải Event làm việc rất chu đáo, sân khấu và âm thanh ánh sáng bùng nổ..."
                  value={newTestimonialQuote}
                  onChange={(e) => setNewTestimonialQuote(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 outline-none focus:border-[#0A1E5E]"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0A1E5E] hover:bg-[#142d75] text-white font-bold shadow-sm"
                >
                  Lưu hồ sơ sự kiện
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          POPUP MODAL CHI TIẾT KHI ẤN VÀO TỪNG THẺ NỘI DUNG / NÚT CHỨC NĂNG
      ===================================================================== */}
      {activeMetricModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200"
          onClick={() => setActiveMetricModal(null)}
        >
          <div
            className="w-full max-w-2xl max-h-[85vh] bg-white rounded-3xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-3">
                {activeMetricModal === "total_events" && (
                  <span className="rounded-xl bg-blue-50 border border-blue-200 p-2.5 text-blue-700">
                    <Briefcase className="w-5 h-5" />
                  </span>
                )}
                {activeMetricModal === "revenue" && (
                  <span className="rounded-xl bg-amber-50 border border-amber-200 p-2.5 text-amber-700">
                    <DollarSign className="w-5 h-5" />
                  </span>
                )}
                {activeMetricModal === "rating" && (
                  <span className="rounded-xl bg-amber-50 border border-amber-200 p-2.5 text-amber-600">
                    <Star className="w-5 h-5 fill-amber-500" />
                  </span>
                )}
                {activeMetricModal === "seo" && (
                  <span className="rounded-xl bg-purple-50 border border-purple-200 p-2.5 text-purple-700">
                    <Sparkles className="w-5 h-5" />
                  </span>
                )}
                {activeMetricModal === "sync_crm" && (
                  <span className="rounded-xl bg-emerald-50 border border-emerald-200 p-2.5 text-emerald-700">
                    <RefreshCw className="w-5 h-5" />
                  </span>
                )}

                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    {activeMetricModal === "total_events" && "Tổng sự kiện lưu trữ là gì?"}
                    {activeMetricModal === "revenue" && "Doanh số hợp đồng là gì?"}
                    {activeMetricModal === "rating" && "Đánh giá khách hàng là gì?"}
                    {activeMetricModal === "seo" && "Bài viết SEO Case Study là gì?"}
                    {activeMetricModal === "sync_crm" && "Tính năng Đồng bộ CRM là gì?"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Thông tin chi tiết và dữ liệu bóc tách từ hệ thống
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveMetricModal(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs sm:text-sm text-slate-700 leading-relaxed">
              {/* NỘI DUNG 1: TỔNG SỰ KIỆN LƯU TRỮ */}
              {activeMetricModal === "total_events" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 text-blue-950">
                    <h4 className="font-bold text-sm text-blue-900 mb-1">
                      Khái niệm &amp; Mục đích
                    </h4>
                    <p className="text-xs text-blue-900/80 leading-normal">
                      <strong>Tổng sự kiện lưu trữ</strong> là toàn bộ các chương trình sự kiện (Khai trương, Gala Dinner, Hội nghị, Teambuilding, Lễ ra mắt) đã được Trường Hải Event &amp; Travel ký hợp đồng và tổ chức thực tế. Mỗi hồ sơ sự kiện lưu trữ đầy đủ: Báo cáo vận hành, thư viện ảnh hiện trường, bóc tách chi phí thực tế và hồ sơ tài liệu hợp đồng số hóa.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-500 mb-2">
                      Danh sách các dự án đang lưu trữ ({profiles.length} sự kiện)
                    </h4>
                    <div className="space-y-2">
                      {profiles.map((p, idx) => (
                        <div
                          key={p.id}
                          onClick={() => {
                            setActiveMetricModal(null);
                            setViewingProfile(p);
                            setDetailTab("info");
                          }}
                          className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-[#0A1E5E] hover:bg-slate-50/80 transition cursor-pointer"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs shrink-0">
                              {idx + 1}
                            </span>
                            <div className="min-w-0">
                              <p className="font-bold text-slate-900 truncate text-xs sm:text-sm">
                                {p.title}
                              </p>
                              <p className="text-[11px] text-slate-500">
                                🏢 {p.client.company} • 📍 {p.location.city} • 👥 {p.guestCount} khách
                              </p>
                            </div>
                          </div>
                          <div className="text-right shrink-0 ml-3">
                            <p className="font-extrabold text-amber-700 text-xs sm:text-sm">
                              {formatVND(p.financials.totalBudget)}
                            </p>
                            <span className="text-[10px] text-blue-600 font-semibold hover:underline">
                              Xem hồ sơ →
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* NỘI DUNG 2: DOANH SỐ HỢP ĐỒNG */}
              {activeMetricModal === "revenue" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-100 text-amber-950">
                    <h4 className="font-bold text-sm text-amber-900 mb-1">
                      Khái niệm &amp; Cơ cấu tài chính
                    </h4>
                    <p className="text-xs text-amber-900/80 leading-normal">
                      <strong>Doanh số hợp đồng</strong> là tổng giá trị kinh tế của toàn bộ các hợp đồng sự kiện thực tế đã ký kết và quyết toán với khách hàng. Hệ thống tự động bóc tách doanh thu thực tế, chi phí vận hành (âm thanh ánh sáng, sân khấu, màn hình LED, nhân sự) và lợi nhuận gộp theo từng dự án.
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-xl border border-slate-200 bg-white text-center">
                      <p className="text-[11px] text-slate-500 font-medium">Tổng doanh thu</p>
                      <p className="text-base font-black text-slate-900 mt-1">{formatVND(stats.totalRevenue)}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">100% giá trị hợp đồng</p>
                    </div>
                    <div className="p-3.5 rounded-xl border border-slate-200 bg-white text-center">
                      <p className="text-[11px] text-slate-500 font-medium">Chi phí vận hành</p>
                      <p className="text-base font-black text-rose-600 mt-1">{formatVND(stats.totalRevenue - stats.totalProfit)}</p>
                      <p className="text-[10px] text-rose-500 mt-0.5">Thiết bị &amp; nhân sự (~70%)</p>
                    </div>
                    <div className="p-3.5 rounded-xl border border-slate-200 bg-white text-center">
                      <p className="text-[11px] text-slate-500 font-medium">Lợi nhuận gộp</p>
                      <p className="text-base font-black text-emerald-600 mt-1">{formatVND(stats.totalProfit)}</p>
                      <p className="text-[10px] text-emerald-600 mt-0.5">Biên lợi nhuận ~{stats.avgProfitMargin}%</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-500 mb-2">
                      Chi tiết doanh số theo từng dự án
                    </h4>
                    <div className="space-y-2">
                      {profiles.map((p) => (
                        <div key={p.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50 text-xs">
                          <div>
                            <p className="font-bold text-slate-900">{p.title}</p>
                            <p className="text-slate-500 text-[11px]">Trạng thái: {p.financials.paymentStatusLabel}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-black text-slate-900">{formatVND(p.financials.totalBudget)}</p>
                            <p className="text-[10px] text-emerald-600 font-semibold">Lãi: {formatVND(p.financials.profit)} ({p.financials.profitMargin}%)</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* NỘI DUNG 3: ĐÁNH GIÁ KHÁCH HÀNG */}
              {activeMetricModal === "rating" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-100 text-amber-950">
                    <h4 className="font-bold text-sm text-amber-900 mb-1">
                      Chỉ số hài lòng khách hàng (CSAT)
                    </h4>
                    <p className="text-xs text-amber-900/80 leading-normal">
                      Đây là điểm đánh giá chất lượng dịch vụ và phản hồi thực tế từ các đại diện doanh nghiệp, đối tác sau khi kết thúc chương trình. 100% dự án đều đạt phản hồi tích cực và đánh giá 5 sao tuyệt đối.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {profiles
                      .filter((p) => p.testimonial)
                      .map((p) => (
                        <div key={p.id} className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-bold text-slate-900 text-xs sm:text-sm">
                                {p.testimonial?.author} • <span className="text-slate-500 font-normal">{p.testimonial?.position}</span>
                              </p>
                              <p className="text-xs font-semibold text-blue-700">{p.testimonial?.company}</p>
                            </div>
                            <span className="px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-extrabold flex items-center gap-1">
                              5.0 ⭐
                            </span>
                          </div>
                          <p className="text-xs italic text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                            "{p.testimonial?.quote}"
                          </p>
                          <p className="text-[11px] text-slate-400">
                            Sự kiện: <strong>{p.title}</strong> ({p.date})
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* NỘI DUNG 4: BÀI VIẾT SEO CASE STUDY */}
              {activeMetricModal === "seo" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100 text-purple-950">
                    <h4 className="font-bold text-sm text-purple-900 mb-1">
                      Tính năng tạo bài viết SEO Case Study (E-E-A-T)
                    </h4>
                    <p className="text-xs text-purple-900/80 leading-normal">
                      Khác với các bài viết AI thông thường chỉ tổng hợp lý thuyết, tính năng này <strong>sử dụng trực tiếp dữ liệu hồ sơ sự kiện thật</strong> (người thật, việc thật, chi phí thật, ảnh hiện trường thật) để sinh bài viết PR và Case Study chuyên sâu đạt chuẩn E-E-A-T (Kinh nghiệm, Chuyên môn, Thẩm quyền, Uy tín) của Google, giúp website thăng hạng vượt bậc.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs">
                    <p><strong>• Tiến độ hiện tại:</strong> {stats.seoArticlesCount} sự kiện đã xuất bản bài viết Case Study vào CMS Tin Tức.</p>
                    <p><strong>• Tiềm năng khai thác:</strong> Còn {stats.totalEvents - stats.seoArticlesCount} hồ sơ sự kiện sẵn sàng tạo bài mới.</p>
                    <p><strong>• Lợi ích:</strong> Google ưu tiên xếp hạng cao gấp 3 lần cho các bài viết có bảng chi phí bóc tách, thông số kỹ thuật âm thanh ánh sáng và ảnh chụp thực tế từ hiện trường.</p>
                  </div>

                  <div className="text-center pt-2">
                    <p className="text-xs text-slate-500 mb-3">
                      Bạn có thể bấm vào nút <strong>"Viết bài SEO"</strong> trên từng thẻ sự kiện bên dưới để tự động tạo và xuất bản bài viết ngay lập tức!
                    </p>
                    <button
                      type="button"
                      onClick={() => setActiveMetricModal(null)}
                      className="px-5 py-2.5 rounded-xl bg-[#0A1E5E] text-white font-bold text-xs shadow-sm hover:bg-[#142d75] transition"
                    >
                      Đã hiểu, quay lại danh sách sự kiện
                    </button>
                  </div>
                </div>
              )}

              {/* NỘI DUNG 5: TÍNH NĂNG ĐỒNG BỘ CRM */}
              {activeMetricModal === "sync_crm" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-emerald-950">
                    <h4 className="font-bold text-sm text-emerald-900 mb-1">
                      Tính năng Đồng bộ CRM là gì?
                    </h4>
                    <p className="text-xs text-emerald-900/80 leading-normal">
                      Đây là cơ chế liên kết dữ liệu tự động 2 chiều giữa <strong>Landing Page / Khách hàng tiềm năng (Leads)</strong> và <strong>Hồ sơ sự kiện lưu trữ</strong>.
                    </p>
                  </div>

                  <div className="space-y-2.5 text-xs text-slate-600">
                    <div className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-200 bg-white">
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-xs">1</span>
                      <p><strong>Khách hàng gửi yêu cầu:</strong> Khi khách điền form nhận báo giá ngoài trang chủ, qua Zalo, hoặc Hotline, thông tin sự kiện và ngày dự kiến được ghi nhận vào CRM.</p>
                    </div>
                    <div className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-200 bg-white">
                      <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 font-bold flex items-center justify-center shrink-0 text-xs">2</span>
                      <p><strong>Chốt hợp đồng &amp; đặt cọc:</strong> Khi sự kiện được chuyển trạng thái sang "Đã chốt (WON)" hoặc "Đã tổ chức (COMPLETED)", hệ thống tự động bóc tách thành Hồ sơ sự kiện lưu trữ.</p>
                    </div>
                    <div className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-200 bg-white">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center shrink-0 text-xs">3</span>
                      <p><strong>Tự động hiển thị &amp; cấp dữ liệu SEO:</strong> Sự kiện ngay lập tức được vẽ lên Lịch và hiển thị trong kho hồ sơ năng lực này để phục vụ viết bài Case Study.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setActiveMetricModal(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 text-xs font-bold transition"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
