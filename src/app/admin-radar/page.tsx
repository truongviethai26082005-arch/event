"use client";

/**
 * =========================================================================
 * KHU VỰC DÀNH CHO THÀNH VIÊN 4: CÔNG NGHỆ LÕI RADAR SEO ADMIN
 * Giao diện Trung tâm Quản trị & Radar SEO AI Trường Hải Event & Travel
 * =========================================================================
 */

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { COMPANY_INFO, MOCK_BLOG_POSTS } from "@/lib/company-data";
import { supabase, isSupabaseConfigured, DatabasePost, DatabaseLead } from "@/lib/supabase";
import ConversionFunnel from "./ConversionFunnel";
import CustomerSourcesChart from "./CustomerSourcesChart";
import EventCalendar from "./EventCalendar";
import EventProfileArchive from "./EventProfileArchive";
import { getStoredEventProfiles, DEFAULT_EVENT_PROFILES } from "./event-profiles-data";
import {
  Radar,
  Sparkles,
  Search,
  ExternalLink,
  Save,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  Layers,
  Edit3,
  Globe,
  Trash2,
  RefreshCw,
  Send,
  Calendar,
  TrendingUp,
  ShieldAlert,
  ArrowRight,
  ShieldCheck,
  Check,
  Eye,
  Users,
  PhoneCall,
  Mail,
  MessageSquare,
  CheckSquare,
  Square,
  PlayCircle,
  Loader2,
  ListFilter,
  CheckCheck,
  Briefcase,
} from "lucide-react";
import ArticleContentRenderer from "@/components/ArticleContentRenderer";
import CompetitorPresetDirectory from "./CompetitorPresetDirectory";
import SeoScoreChecklist from "./SeoScoreChecklist";
import {
  CompetitorPreset,
  saveCustomCompetitor,
} from "./competitor-presets";
import { ensureAccentedKeyword } from "@/app/api/radar/services/vietnamese-diacritics";
import { toSentenceCase } from "@/app/api/radar/services/content-generator";

// Hàm định dạng ngày giờ chi tiết: Giờ:Phút:Giây - Ngày/Tháng/Năm
function formatFullDateTime(dateString?: string): string {
  if (!dateString) return "Mới tạo";
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return "Mới tạo";
  return d.toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function RadarSeoAdminPage() {
  // Input form state
  const [competitorUrl, setCompetitorUrl] = useState("");
  const [targetKeyword, setTargetKeyword] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");

  // Chế độ quét: "domain" (Quét tự động toàn bộ domain/sitemap) hoặc "single" (URL bài viết đơn lẻ)
  const [scanMode, setScanMode] = useState<"domain" | "single">("domain");

  // Domain Scan state
  const [domainInput, setDomainInput] = useState("");
  const [isScanningDomain, setIsScanningDomain] = useState(false);
  const [scannedResult, setScannedResult] = useState<{
    domain: string;
    sitemapFound: string | null;
    totalFound: number;
    unscrapedCount: number;
    urls: {
      url: string;
      title: string;
      isScraped: boolean;
      lastMod?: string;
      status?: "idle" | "waiting" | "scraping" | "generating" | "success" | "error";
      error?: string;
    }[];
  } | null>(null);

  // Danh sách các URL được tick chọn trong Domain Scanner
  const [selectedUrls, setSelectedUrls] = useState<string[]>([]);
  const [domainFilter, setDomainFilter] = useState<"all" | "unscraped">("all");

  // Batch execution progress cho Radar hàng loạt
  const [isBatchRunning, setIsBatchRunning] = useState(false);
  const [batchProgress, setBatchProgress] = useState<{
    current: number;
    total: number;
    currentTitle: string;
    successCount: number;
    errorCount: number;
  }>({ current: 0, total: 0, currentTitle: "", successCount: 0, errorCount: 0 });

  // Processing state & step tracker
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [processStep, setProcessStep] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Result state
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [editablePost, setEditablePost] = useState<any>(null);
  // MẶC ĐỊNH MỞ TAB "analysis" ĐỂ ADMIN ĐỌC VÀ HIỂU BỐI CẢNH ĐỐI THỦ TRƯỚC
  const [activeResultTab, setActiveResultTab] = useState<"analysis" | "article">("analysis");
  // Chế độ xem trước trực quan (preview) hoặc sửa mã nguồn (edit)
  const [articlePreviewMode, setArticlePreviewMode] = useState<"preview" | "edit">("preview");
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Hẹn lịch đăng bài state
  const [scheduledTime, setScheduledTime] = useState<string>("");
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const [editingPostId, setEditingPostId] = useState<string | null>(null);

  // Leads state
  const [leadsList, setLeadsList] = useState<DatabaseLead[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(false);
  const [activeAdminTab, setActiveAdminTab] = useState<"posts" | "leads" | "events">("posts");
  const [eventProfilesCount, setEventProfilesCount] = useState<number>(() => {
    if (typeof window !== "undefined") {
      return getStoredEventProfiles().length;
    }
    return DEFAULT_EVENT_PROFILES.length;
  });

  // Hồ sơ sự kiện liên kết với Radar SEO
  const [selectedEventId, setSelectedEventId] = useState<string>("auto");
  const [includeRealImages, setIncludeRealImages] = useState<boolean>(true);
  const [includeRealPricing, setIncludeRealPricing] = useState<boolean>(true);
  const [includeTestimonial, setIncludeTestimonial] = useState<boolean>(true);
  const [availableProfiles, setAvailableProfiles] = useState<any[]>(() => {
    if (typeof window !== "undefined") {
      return getStoredEventProfiles();
    }
    return DEFAULT_EVENT_PROFILES;
  });

  const activeEventProfile = React.useMemo(() => {
    if (selectedEventId && selectedEventId !== "auto") {
      const found = availableProfiles.find((p) => p.id === selectedEventId);
      if (found) return found;
    }
    const kw = (targetKeyword || competitorUrl || "").toLowerCase();
    if (
      kw.includes("khai trương") ||
      kw.includes("khai truong") ||
      kw.includes("showroom") ||
      kw.includes("khánh thành") ||
      kw.includes("ra mắt")
    ) {
      if (kw.includes("xe") || kw.includes("ô tô") || kw.includes("vinfast")) {
        return availableProfiles.find((p) => p.id === "ep-vinfast-launch") || availableProfiles[0];
      }
      return availableProfiles.find((p) => p.category === "khai-truong") || availableProfiles[0];
    }
    if (
      kw.includes("gala") ||
      kw.includes("kỷ niệm") ||
      kw.includes("ky niem") ||
      kw.includes("yep") ||
      kw.includes("tất niên") ||
      kw.includes("tri ân")
    ) {
      return availableProfiles.find((p) => p.category === "gala-dinner") || availableProfiles[0];
    }
    if (
      kw.includes("hội nghị") ||
      kw.includes("hoi nghi") ||
      kw.includes("hội thảo") ||
      kw.includes("hoi thao") ||
      kw.includes("seminar") ||
      kw.includes("ai") ||
      kw.includes("diễn đàn")
    ) {
      return availableProfiles.find((p) => p.category === "hoi-nghi") || availableProfiles[0];
    }
    if (
      kw.includes("teambuilding") ||
      kw.includes("du lịch") ||
      kw.includes("du lich") ||
      kw.includes("team building") ||
      kw.includes("nghỉ dưỡng")
    ) {
      return availableProfiles.find((p) => p.category === "teambuilding") || availableProfiles[0];
    }
    return availableProfiles[0];
  }, [selectedEventId, availableProfiles, targetKeyword, competitorUrl]);

  // Posts table state
  const [postsList, setPostsList] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft" | "scheduled">("all");

  const filteredPosts = postsList.filter((post) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      (post.title && post.title.toLowerCase().includes(query)) ||
      (post.focus_keyword && post.focus_keyword.toLowerCase().includes(query)) ||
      (post.slug && post.slug.toLowerCase().includes(query));

    const matchesStatus =
      statusFilter === "all" || post.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const publishedCount = postsList.filter((p) => p.status === "published").length;
  const draftCount = postsList.filter((p) => p.status === "draft" || !p.status).length;

  // Fetch leads from Supabase
  const fetchLeads = async () => {
    setLoadingLeads(true);
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from("leads")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data) {
          setLeadsList(data);
          setLoadingLeads(false);
          return;
        }
      } catch (e) {
        console.warn("Lỗi tải leads từ Supabase:", e);
      }
    }

    // Mock leads fallback
    setLeadsList([
      {
        id: "lead-1",
        full_name: "Nguyễn Văn Hùng",
        phone: "0912 345 678",
        email: "hung.nv@techcorp.vn",
        event_type: "Hội nghị khách hàng 300 khách",
        notes: "Cần báo giá trọn gói âm thanh ánh sáng & tiệc teabreak tại Hà Nội cuối tháng sau.",
        created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
      {
        id: "lead-2",
        full_name: "Trần Thị Mai Anh",
        phone: "0988 765 432",
        email: "maianh.event@vietgroup.com",
        event_type: "Lễ khai trương chi nhánh mới",
        notes: "Cần kịch bản đón tiếp khách VIP và đội múa Lân Sư Rồng tại Cầu Giấy.",
        created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
      },
      {
        id: "lead-3",
        full_name: "Lê Hoàng Long",
        phone: "0903 112 233",
        email: "long.lh@sunshine.vn",
        event_type: "Teambuilding & Gala Dinner 2N1Đ",
        notes: "Đoàn 150 người tại Hạ Long, yêu cầu MC nhiệt huyết và quà tặng teambuilding.",
        created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
      },
    ]);
    setLoadingLeads(false);
  };

  const handleDeleteLead = async (leadId?: string) => {
    if (!leadId) return;
    if (!window.confirm("Bạn có chắc muốn xóa yêu cầu tư vấn của khách hàng này?")) return;
    if (isSupabaseConfigured) {
      try {
        await supabase.from("leads").delete().eq("id", leadId);
        fetchLeads();
        return;
      } catch (e) {
        console.warn("Lỗi khi xóa lead:", e);
      }
    }
    setLeadsList(leadsList.filter((l) => l.id !== leadId));
  };

  const handleStartEditPost = (post: any) => {
    setEditingPostId(post.id);
    setEditablePost({
      title: post.title,
      slug: post.slug,
      content: post.content,
      meta_description: post.meta_description,
      focus_keyword: post.focus_keyword,
      category: "su-kien",
      reading_time: "5 phút",
    });
    setActiveResultTab("article");
    setTimeout(() => {
      const editorEl = document.getElementById("radar-results-editor");
      if (editorEl) {
        editorEl.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const handleCancelEdit = () => {
    setEditingPostId(null);
    setEditablePost(null);
    setSaveStatus(null);
  };

  // Load existing posts from Supabase or mock
  const fetchPosts = async () => {
    setLoadingPosts(true);
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from("posts")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data) {
          const sanitized = data.map((p) => ({
            ...p,
            title: toSentenceCase(ensureAccentedKeyword(p.title || "")),
            focus_keyword: p.focus_keyword ? ensureAccentedKeyword(p.focus_keyword) : "N/A",
          }));
          setPostsList(sanitized);
          setLoadingPosts(false);
          return;
        }
      } catch (e) {
        console.warn("Lỗi tải bài viết Supabase:", e);
      }
    }

    // Fallback: mock posts
    const mappedMocks = MOCK_BLOG_POSTS.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      content: p.content,
      meta_description: p.meta_description,
      focus_keyword: p.focus_keyword,
      status: p.status,
      created_at: p.created_at,
    }));
    setPostsList(mappedMocks);
    setLoadingPosts(false);
  };

  useEffect(() => {
    fetchPosts();
    fetchLeads();
    if (typeof window !== "undefined") {
      setAvailableProfiles(getStoredEventProfiles());
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab");
      if (tabParam === "events") {
        setActiveAdminTab("events");
      } else if (tabParam === "leads") {
        setActiveAdminTab("leads");
      }
    }
  }, []);

  // Quick fill samples
  const fillSample = (url: string, keyword: string, promptText: string) => {
    setCompetitorUrl(url);
    setTargetKeyword(keyword);
    setCustomPrompt(promptText);
  };

  // Nạp minh chứng dự án thực tế từ Hồ sơ sự kiện vào Prompt AI
  const injectEventProof = (
    title: string,
    company: string,
    guests: number,
    venue: string,
    equipment: string
  ) => {
    const proofText = `Lồng ghép minh chứng dự án thực tế của Trường Hải Event: Dự án "${title}" tổ chức cho ${company} quy mô ${guests} khách VIP tại ${venue} (Hệ thống thiết bị: ${equipment}). Khẳng định năng lực thực chiến vượt trội so với đối thủ.`;
    setCustomPrompt((prev) => (prev ? `${prev}\n- ${proofText}` : proofText));
  };

  // Main Radar Action: Call /api/radar
  const handleScanAndGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!competitorUrl) return;

    setIsAnalyzing(true);
    setErrorMsg(null);
    setSaveStatus(null);
    setProcessStep(1);

    try {
      // Giả lập trực quan các giai đoạn chuẩn Skill System Content v2.4.5 (13 Bước Workflow)
      const stepTimer1 = setTimeout(() => setProcessStep(2), 600);
      const stepTimer2 = setTimeout(() => setProcessStep(3), 1300);
      const stepTimer3 = setTimeout(() => setProcessStep(4), 2100);
      const stepTimer4 = setTimeout(() => setProcessStep(5), 2900);
      const stepTimer5 = setTimeout(() => setProcessStep(6), 3700);

      const res = await fetch("/api/radar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          competitorUrl: competitorUrl.trim(),
          targetKeyword: targetKeyword.trim(),
          customPrompt: customPrompt.trim(),
          selectedEventId,
          eventProfileProof: activeEventProfile,
          includeRealImages,
          includeRealPricing,
          includeTestimonial,
        }),
      });

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);
      clearTimeout(stepTimer4);
      clearTimeout(stepTimer5);

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Không thể phân tích nội dung.");
      }

      setAnalysisResult(data.analysis);
      setEditablePost(data.generatedPost);
      // ƯU TIÊN MỞ TAB "analysis" ĐỂ ADMIN NẮM ĐƯỢC BỐI CẢNH VÀ LỖ HỔNG
      setActiveResultTab("analysis");

      // Reload posts table if server saved it
      if (data.isSupabaseSaved) {
        fetchPosts();
      }
    } catch (err: any) {
      console.error("Radar error:", err);
      setErrorMsg(err.message || "Đã xảy ra lỗi khi quét bài viết đối thủ.");
    } finally {
      setIsAnalyzing(false);
      setProcessStep(0);
    }
  };

  // QUÉT TỰ ĐỘNG DOMAIN ĐỐI THỦ
  const handleScanDomain = async (
    e?: React.FormEvent,
    overrideDomain?: string
  ) => {
    if (e) e.preventDefault();
    const targetDomain = (overrideDomain || domainInput).trim();
    if (!targetDomain) return;

    if (overrideDomain) {
      setDomainInput(overrideDomain);
    }

    setIsScanningDomain(true);
    setErrorMsg(null);
    setSelectedUrls([]);

    try {
      const res = await fetch("/api/radar/scan-domain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: targetDomain }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Không thể quét sitemap từ tên miền đối thủ.");
      }

      const formattedUrls = (data.urls || []).map((u: any) => ({
        ...u,
        status: "idle",
      }));

      setScannedResult({
        domain: data.domain,
        sitemapFound: data.sitemapFound,
        totalFound: data.totalFound,
        unscrapedCount: data.unscrapedCount,
        urls: formattedUrls,
      });

      // Mặc định chọn các bài chưa cào (tối đa 10 bài đầu tiên)
      const unscraped = formattedUrls
        .filter((u: any) => !u.isScraped)
        .slice(0, 10)
        .map((u: any) => u.url);
      setSelectedUrls(
        unscraped.length > 0
          ? unscraped
          : formattedUrls.slice(0, 5).map((u: any) => u.url)
      );
    } catch (err: any) {
      console.error("Scan domain error:", err);
      setErrorMsg(err.message || "Lỗi khi quét sitemap domain đối thủ.");
    } finally {
      setIsScanningDomain(false);
    }
  };

  // Xử lý khi chọn đối thủ từ Danh bạ nạp sẵn
  const handleSelectCompetitorPreset = (
    competitor: CompetitorPreset,
    autoScan: boolean = false
  ) => {
    setDomainInput(competitor.domain);
    if (competitor.suggestedPrompt && !customPrompt.trim()) {
      setCustomPrompt(competitor.suggestedPrompt);
    }
    if (autoScan) {
      handleScanDomain(undefined, competitor.domain);
    }
  };

  // Chọn / bỏ chọn 1 URL trong danh sách
  const handleToggleSelectUrl = (url: string) => {
    setSelectedUrls((prev) =>
      prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url]
    );
  };

  // Chọn tất cả URL
  const handleSelectAllUrls = (urlsToSelect: string[]) => {
    setSelectedUrls(urlsToSelect);
  };

  // Bỏ chọn tất cả
  const handleDeselectAllUrls = () => {
    setSelectedUrls([]);
  };

  // CHẠY RADAR HÀNG LOẠT CHO CÁC BÀI ĐÃ CHỌN (QUEUE RUNNER TUẦN TỰ)
  const handleRunBatchRadar = async () => {
    if (!scannedResult || selectedUrls.length === 0 || isBatchRunning) return;

    setIsBatchRunning(true);
    setErrorMsg(null);
    setSaveStatus(null);

    const targets = scannedResult.urls.filter((u) => selectedUrls.includes(u.url));
    const total = targets.length;
    let successCount = 0;
    let errorCount = 0;

    // Đặt tất cả các bài được chọn vào trạng thái 'waiting' (Chờ xử lý)
    setScannedResult((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        urls: prev.urls.map((u) =>
          selectedUrls.includes(u.url) && u.status !== "success"
            ? { ...u, status: "waiting" }
            : u
        ),
      };
    });

    setBatchProgress({
      current: 0,
      total,
      currentTitle: "Khởi tạo hàng đợi xử lý...",
      successCount: 0,
      errorCount: 0,
    });

    for (let i = 0; i < targets.length; i++) {
      const target = targets[i];
      setBatchProgress((prev) => ({
        ...prev,
        current: i + 1,
        currentTitle: target.title,
      }));

      // Bước 1: Đang cào & phân tích đối thủ
      setScannedResult((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          urls: prev.urls.map((u) =>
            u.url === target.url ? { ...u, status: "scraping" } : u
          ),
        };
      });

      // Hiệu ứng visual chuyển sang 'generating' sau 2.5s
      const genTimer = setTimeout(() => {
        setScannedResult((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            urls: prev.urls.map((u) =>
              u.url === target.url && u.status === "scraping"
                ? { ...u, status: "generating" }
                : u
            ),
          };
        });
      }, 2500);

      try {
        const matchedForBatch =
          availableProfiles.find((p) => {
            const t = (target.title || "").toLowerCase();
            if (t.includes("khai trương") || t.includes("ra mắt") || t.includes("showroom")) return p.category === "khai-truong";
            if (t.includes("gala") || t.includes("kỷ niệm") || t.includes("yep")) return p.category === "gala-dinner";
            if (t.includes("hội nghị") || t.includes("hội thảo") || t.includes("ai")) return p.category === "hoi-nghi";
            if (t.includes("teambuilding") || t.includes("du lịch")) return p.category === "teambuilding";
            return false;
          }) || activeEventProfile;

        const res = await fetch("/api/radar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            competitorUrl: target.url,
            targetKeyword: target.title,
            customPrompt: customPrompt.trim(),
            selectedEventId: matchedForBatch.id,
            eventProfileProof: matchedForBatch,
            includeRealImages,
            includeRealPricing,
            includeTestimonial,
          }),
        });

        clearTimeout(genTimer);
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Lỗi xử lý bài viết.");
        }

        successCount++;
        // Cập nhật trạng thái hoàn thành (Đã lưu nháp)
        setScannedResult((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            urls: prev.urls.map((u) =>
              u.url === target.url
                ? { ...u, status: "success", isScraped: true }
                : u
            ),
          };
        });

        // Tự động reload danh sách bài viết từ Supabase sau mỗi bài
        await fetchPosts();
      } catch (itemErr: any) {
        clearTimeout(genTimer);
        errorCount++;
        console.warn(`Lỗi khi cào bài ${target.url}:`, itemErr);
        setScannedResult((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            urls: prev.urls.map((u) =>
              u.url === target.url
                ? { ...u, status: "error", error: itemErr.message || "Lỗi xử lý" }
                : u
            ),
          };
        });
      }

      setBatchProgress((prev) => ({
        ...prev,
        successCount,
        errorCount,
      }));
    }

    setIsBatchRunning(false);
    setSaveStatus(
      `Hoàn tất Radar hàng loạt: Đã tạo thành công ${successCount}/${total} bài viết nháp trong Database!`
    );
  };

  // CHẠY NGẦM RIÊNG 1 BÀI TẠI CHỖ (KHÔNG CHUYỂN TAB)
  const handleRunSingleInPlace = async (targetUrl: string, targetTitle: string) => {
    // Đặt trạng thái đang cào & phân tích
    setScannedResult((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        urls: prev.urls.map((u) =>
          u.url === targetUrl ? { ...u, status: "scraping" } : u
        ),
      };
    });

    const genTimer = setTimeout(() => {
      setScannedResult((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          urls: prev.urls.map((u) =>
            u.url === targetUrl && u.status === "scraping"
              ? { ...u, status: "generating" }
              : u
          ),
        };
      });
    }, 2500);

    try {
      const matchedForSingle =
        availableProfiles.find((p) => {
          const t = (targetTitle || "").toLowerCase();
          if (t.includes("khai trương") || t.includes("ra mắt") || t.includes("showroom")) return p.category === "khai-truong";
          if (t.includes("gala") || t.includes("kỷ niệm") || t.includes("yep")) return p.category === "gala-dinner";
          if (t.includes("hội nghị") || t.includes("hội thảo") || t.includes("ai")) return p.category === "hoi-nghi";
          if (t.includes("teambuilding") || t.includes("du lịch")) return p.category === "teambuilding";
          return false;
        }) || activeEventProfile;

      const res = await fetch("/api/radar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          competitorUrl: targetUrl,
          targetKeyword: targetTitle,
          customPrompt: customPrompt.trim(),
          selectedEventId: matchedForSingle.id,
          eventProfileProof: matchedForSingle,
          includeRealImages,
          includeRealPricing,
          includeTestimonial,
        }),
      });

      clearTimeout(genTimer);
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Lỗi xử lý bài viết.");
      }

      // Đánh dấu hoàn tất
      setScannedResult((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          urls: prev.urls.map((u) =>
            u.url === targetUrl
              ? { ...u, status: "success", isScraped: true }
              : u
          ),
        };
      });

      // Cập nhật bảng bài viết bên dưới
      await fetchPosts();
      setSaveStatus(`Đã tạo nháp thành công bài viết: "${targetTitle.slice(0, 35)}..."`);
    } catch (err: any) {
      clearTimeout(genTimer);
      setScannedResult((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          urls: prev.urls.map((u) =>
            u.url === targetUrl
              ? { ...u, status: "error", error: err.message || "Lỗi xử lý" }
              : u
          ),
        };
      });
      setErrorMsg(`Lỗi khi chạy bài "${targetTitle.slice(0, 30)}...": ${err.message}`);
    }
  };

  // Lưu vào Supabase với trạng thái tùy chọn
  const handleSaveToSupabase = async (status: "draft" | "published" | "scheduled") => {
    if (!editablePost) return;

    const statusText =
      status === "published"
        ? "Đang xuất bản bài viết..."
        : status === "scheduled"
        ? `Đang lên lịch đăng bài (${scheduledTime || "tự động"})...`
        : "Đang lưu bản nháp vào Supabase...";

    setSaveStatus(statusText);

    try {
      const payload: any = {
        title: editablePost.title,
        slug: editablePost.slug,
        content: editablePost.content,
        meta_description: editablePost.meta_description,
        focus_keyword: editablePost.focus_keyword,
        competitor_source_url: competitorUrl,
        status: status === "scheduled" ? "draft" : status, // Nếu DB chưa có enum scheduled thì lưu draft kèm ghi chú
      };

      if (isSupabaseConfigured) {
        if (editingPostId) {
          const { error } = await supabase
            .from("posts")
            .update(payload)
            .eq("id", editingPostId);
          if (error) throw error;
          setSaveStatus(
            status === "published"
              ? "Đã cập nhật & xuất bản bài viết thành công!"
              : "Đã cập nhật bài viết thành công!"
          );
          setEditingPostId(null);
          fetchPosts();
        } else {
          const { error } = await supabase.from("posts").insert([payload]);
          if (error) throw error;
          setSaveStatus(
            status === "published"
              ? "Đã xuất bản bài viết thành công lên trang Tin tức!"
              : status === "scheduled"
              ? `Đã lên lịch xuất bản bài viết thành công: ${scheduledTime}!`
              : "Đã lưu bản nháp vào bảng 'posts' thành công!"
          );
          fetchPosts();
        }
      } else {
        if (editingPostId) {
          setPostsList(
            postsList.map((p) =>
              p.id === editingPostId
                ? { ...p, ...editablePost, status }
                : p
            )
          );
          setSaveStatus("Đã cập nhật bài viết (chế độ demo)!");
          setEditingPostId(null);
        } else {
        // Mock save
        const newMockPost = {
          id: `post-${Date.now()}`,
          title: editablePost.title,
          slug: editablePost.slug,
          content: editablePost.content,
          meta_description: editablePost.meta_description,
          focus_keyword: editablePost.focus_keyword,
          competitor_source_url: competitorUrl,
          status: status,
          scheduled_at: scheduledTime,
          created_at: new Date().toISOString(),
        };
        setPostsList([newMockPost, ...postsList]);
        setSaveStatus(
          status === "published"
            ? "Đã xuất bản (chế độ demo)!"
            : status === "scheduled"
            ? `Đã lên lịch đăng vào: ${scheduledTime} (demo)!`
            : "Đã lưu bản nháp thành công (chế độ demo)!"
        );
        }
      }
      setShowScheduleModal(false);
    } catch (err: any) {
      console.error("Save error:", err);
      setSaveStatus(`Lỗi khi lưu: ${err.message || String(err)}`);
    }
  };

  // Toggle publish status in posts table
  const handleToggleStatus = async (post: any) => {
    const nextStatus = post.status === "published" ? "draft" : "published";

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from("posts")
          .update({ status: nextStatus })
          .eq("id", post.id);

        if (!error) {
          fetchPosts();
          return;
        }
      } catch (e) {
        console.warn("Toggle status error:", e);
      }
    }

    setPostsList(
      postsList.map((p) =>
        p.id === post.id ? { ...p, status: nextStatus } : p
      )
    );
  };

  // THAO TÁC XÓA BẢN NHÁP / BÀI VIẾT
  const handleDeletePost = async (post: any) => {
    const isConfirm = window.confirm(
      `Bạn có chắc chắn muốn xóa bài viết:\n"${post.title}" không?`
    );
    if (!isConfirm) return;

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from("posts").delete().eq("id", post.id);
        if (error) {
          console.warn("Lỗi xóa từ Supabase:", error);
        }
      } catch (err) {
        console.error("Delete error:", err);
      }
    }

    setPostsList(postsList.filter((p) => p.id !== post.id));
    setSaveStatus(`Đã xóa bài viết "${post.title.slice(0, 30)}..." thành công!`);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-white/10 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-amber-600 p-0.5 shadow-lg flex items-center justify-center">
              <div className="w-full h-full bg-[#06123B] rounded-[14px] flex items-center justify-center">
                <Radar className="w-6 h-6 text-[#D4AF37] animate-spin [animation-duration:8s]" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-black text-white tracking-tight">
                  RADAR SEO ENGINE
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#D4AF37] text-[#0A1E5E]">
                  AI v2.0
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Công cụ quét đối thủ qua Jina Reader & Tái tạo bài viết chuẩn SEO cho Trường Hải Event & Travel
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <span
              className={`px-3 py-1.5 rounded-full border flex items-center space-x-1.5 ${
                isSupabaseConfigured
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                  : "bg-amber-500/10 border-amber-500/30 text-amber-400"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isSupabaseConfigured ? "bg-emerald-400" : "bg-amber-400"
                } animate-ping`}
              />
              <span>
                {isSupabaseConfigured
                  ? "Supabase: Đã kết nối"
                  : "Chế độ: Độc lập Demo"}
              </span>
            </span>

            <Link
              href="/tin-tuc"
              target="_blank"
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#D4AF37] font-bold flex items-center space-x-1 transition-all border border-white/10"
            >
              <span>Xem Blog Thực tế</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* INPUT WORKSPACE */}
        <div className="bg-[#06123B] rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="space-y-6">
            {/* HEADER WORKSPACE & MODE SWITCHER */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <Search className="w-5 h-5 text-[#D4AF37]" />
                <h2 className="text-base font-bold text-white">
                  {scanMode === "domain"
                    ? "Chế độ 2: Quét tự động bằng Domain / Sitemap đối thủ"
                    : "Chế độ 1: Quét bài viết đơn lẻ từ URL"}
                </h2>
              </div>

              {/* Mode Switcher Buttons */}
              <div className="flex items-center bg-white/5 p-1 rounded-2xl border border-white/10 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setScanMode("domain")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                    scanMode === "domain"
                      ? "bg-gradient-to-r from-[#D4AF37] to-amber-500 text-[#0A1E5E] shadow-md shadow-[#D4AF37]/20"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Quét Domain / Sitemap</span>
                  <span className="px-1.5 py-0.5 text-[9px] uppercase tracking-wider rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Khuyên dùng
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setScanMode("single")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                    scanMode === "single"
                      ? "bg-gradient-to-r from-[#D4AF37] to-amber-500 text-[#0A1E5E] shadow-md shadow-[#D4AF37]/20"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Link bài viết đơn lẻ</span>
                </button>
              </div>
            </div>

            {/* =====================================================================
                CHẾ ĐỘ 2: QUÉT TỰ ĐỘNG THEO DOMAIN / SITEMAP
            ===================================================================== */}
            {scanMode === "domain" && (
              <div className="space-y-6">
                {/* DANH BẠ ĐỐI THỦ MẪU NẠP SẴN (PRESET DIRECTORY) */}
                <CompetitorPresetDirectory
                  currentDomain={domainInput}
                  onSelectCompetitor={handleSelectCompetitorPreset}
                  isScanning={isScanningDomain}
                />

                {/* Domain Input Form */}
                <form onSubmit={handleScanDomain} className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <label className="block text-xs font-semibold text-slate-300">
                        Hoặc nhập tên miền / website đối thủ tùy ý <span className="text-[#D4AF37]">*</span>
                      </label>

                      {domainInput.trim() && (
                        <button
                          type="button"
                          onClick={() => {
                            saveCustomCompetitor({
                              name: "",
                              domain: domainInput,
                              badge: "Đã lưu nhanh",
                              description: `Đối thủ lưu từ ô nhập: ${domainInput}`,
                            });
                            alert("Đã lưu đối thủ này vào danh bạ riêng!");
                          }}
                          className="text-[11px] font-semibold text-[#D4AF37] hover:underline flex items-center space-x-1 cursor-pointer"
                        >
                          <span>⭐ Lưu domain này vào danh bạ riêng</span>
                        </button>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="relative flex-1">
                        <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                        <input
                          type="text"
                          required
                          placeholder="VD: viet-power.vn hoặc https://viet-power.vn"
                          value={domainInput}
                          onChange={(e) => setDomainInput(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isScanningDomain || !domainInput.trim()}
                        className="px-6 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-[#D4AF37] via-[#f5e08b] to-[#D4AF37] text-[#0A1E5E] shadow-lg shadow-[#D4AF37]/20 hover:scale-105 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer shrink-0"
                      >
                        {isScanningDomain ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Đang dò tìm Sitemap...</span>
                          </>
                        ) : (
                          <>
                            <Radar className="w-4 h-4 text-[#0A1E5E]" />
                            <span>Quét bài viết đối thủ</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Yêu cầu AI bổ sung dùng chung cho cả batch */}
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-1 mb-1.5">
                      <label className="text-xs font-semibold text-slate-300">
                        Chỉ đạo nội dung cho Gemini AI (áp dụng cho tất cả bài viết được cào)
                      </label>
                      <span className="text-[11px] text-[#D4AF37] font-semibold flex items-center">
                        <Sparkles className="w-3 h-3 mr-1" /> Nạp minh chứng từ Hồ sơ sự kiện:
                      </span>
                    </div>

                    {/* Quick inject pills from event profiles */}
                    <div className="flex flex-wrap items-center gap-1.5 mb-2">
                      <button
                        type="button"
                        onClick={() =>
                          injectEventProof(
                            "Lễ Khai Trương Showroom Nam Hải Auto",
                            "Công ty Cổ phần Ô tô Nam Hải",
                            250,
                            "Cầu Giấy, Hà Nội",
                            "Màn LED P3 Cabin đúc, Line Array RCF Italy, Múa Lân Sư Rồng"
                          )
                        }
                        className="px-2 py-0.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-[10px] font-semibold transition"
                      >
                        + Khai trương Nam Hải (250 khách)
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          injectEventProof(
                            "Gala Dinner & Kỷ Niệm 15 Năm Sun Group",
                            "Tập Đoàn Sun Group",
                            500,
                            "Meliá Hà Nội 5 sao",
                            "Màn LED cong P2.5 45m², D&B Audiotechnik Đức, Visual 3D Hologram"
                          )
                        }
                        className="px-2 py-0.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/25 text-purple-300 border border-purple-500/30 text-[10px] font-semibold transition"
                      >
                        + Gala Sun Group Meliá (500 khách)
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          injectEventProof(
                            "Hội Nghị Thượng Đỉnh AI FPT Software",
                            "FPT Software Toàn Cầu",
                            400,
                            "Trung tâm Hội nghị Quốc gia NCC",
                            "Tai nghe phiên dịch 400 đại biểu, Cabin ISO, Livestream 4K"
                          )
                        }
                        className="px-2 py-0.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/25 text-blue-300 border border-blue-500/30 text-[10px] font-semibold transition"
                      >
                        + Hội Nghị FPT NCC (400 khách)
                      </button>
                    </div>

                    <textarea
                      rows={2}
                      placeholder="VD: Nhấn mạnh Trường Hải Event trực tiếp sở hữu tổng kho Line Array, LED P2.5; báo giá bóc tách theo quy mô, hotline 0844 198 333..."
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition"
                    />
                  </div>
                </form>

                {/* Batch Progress Bar khi đang chạy Radar hàng loạt */}
                {isBatchRunning && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-[#0A1E5E]/80 border border-[#D4AF37]/40 space-y-3 animate-in fade-in">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div className="flex items-center space-x-2 font-bold text-[#D4AF37]">
                        <Loader2 className="w-4 h-4 animate-spin text-[#D4AF37]" />
                        <span>Đang chạy Radar tự động: Bài {batchProgress.current} / {batchProgress.total}</span>
                      </div>
                      <div className="text-[11px] text-slate-300 truncate max-w-md">
                        Đang xử lý: <span className="font-semibold text-white">{batchProgress.currentTitle}</span>
                      </div>
                    </div>

                    {/* Progress Track */}
                    <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden relative">
                      <div
                        className="h-full bg-gradient-to-r from-[#D4AF37] to-emerald-400 transition-all duration-500 rounded-full"
                        style={{
                          width: `${Math.round((batchProgress.current / (batchProgress.total || 1)) * 100)}%`,
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>Tiến độ: {Math.round((batchProgress.current / (batchProgress.total || 1)) * 100)}%</span>
                      <div className="flex items-center space-x-3">
                        <span className="text-emerald-400 font-medium">✓ Thành công: {batchProgress.successCount}</span>
                        {batchProgress.errorCount > 0 && (
                          <span className="text-rose-400 font-medium">✕ Lỗi: {batchProgress.errorCount}</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* KẾT QUẢ QUÉT SITEMAP & DANH SÁCH BÀI VIẾT */}
                {scannedResult && (
                  <div className="space-y-4 pt-2 border-t border-white/10 animate-in fade-in">
                    {/* =========================================================
                        BATCH ACTION BAR: THANH CÔNG CỤ CHẠY HÀNG LOẠT TRÊN CÙNG
                    ========================================================= */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-white/[0.08] via-white/[0.04] to-white/[0.08] border border-white/15 shadow-xl space-y-4">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                            <h3 className="text-sm font-bold text-white tracking-wide">
                              Tìm thấy {scannedResult.totalFound} bài viết chi tiết từ {scannedResult.domain}
                            </h3>
                          </div>
                          <p className="text-xs text-slate-300">
                            {scannedResult.sitemapFound
                              ? `Nguồn: ${scannedResult.sitemapFound}`
                              : "Đã lọc qua Recursive Sitemap & Category Crawler"} •{" "}
                            <span className="text-emerald-400 font-bold">{scannedResult.unscrapedCount} bài mới</span> chưa cào •{" "}
                            Đã chọn <span className="text-[#D4AF37] font-extrabold text-sm">{selectedUrls.length}</span> / {scannedResult.totalFound} bài
                          </p>
                        </div>

                        {/* NÚT LỚN NỔI BẬT: CHẠY RADAR HÀNG LOẠT */}
                        <div className="flex flex-wrap items-center gap-2.5">
                          <button
                            type="button"
                            disabled={isBatchRunning || selectedUrls.length === 0}
                            onClick={handleRunBatchRadar}
                            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] via-amber-400 to-[#D4AF37] hover:from-amber-300 hover:to-[#D4AF37] text-[#0A1E5E] font-black text-xs shadow-xl shadow-[#D4AF37]/30 flex items-center justify-center space-x-2.5 disabled:opacity-40 cursor-pointer transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                          >
                            {isBatchRunning ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin text-[#0A1E5E]" />
                                <span>ĐANG CHẠY HÀNG ĐỢI ({batchProgress.current}/{batchProgress.total})...</span>
                              </>
                            ) : (
                              <>
                                <PlayCircle className="w-4 h-4 text-[#0A1E5E]" />
                                <span>🚀 CHẠY RADAR HÀNG LOẠT ({selectedUrls.length} BÀI ĐÃ CHỌN)</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* THANH ĐIỀU KHIỂN CHỌN BÀI & BỘ LỌC */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10 text-xs">
                        {/* Checkbox Chọn tất cả */}
                        <div className="flex items-center space-x-3">
                          <label className="flex items-center space-x-2 cursor-pointer font-semibold text-slate-200 hover:text-white select-none">
                            <input
                              type="checkbox"
                              checked={
                                selectedUrls.length > 0 &&
                                selectedUrls.length ===
                                  scannedResult.urls.filter(
                                    (u) => domainFilter === "all" || !u.isScraped
                                  ).length
                              }
                              onChange={(e) => {
                                if (e.target.checked) {
                                  const list = scannedResult.urls
                                    .filter((u) => domainFilter === "all" || !u.isScraped)
                                    .map((u) => u.url);
                                  handleSelectAllUrls(list);
                                } else {
                                  handleDeselectAllUrls();
                                }
                              }}
                              className="w-4 h-4 rounded text-[#D4AF37] bg-white/10 border-white/20 focus:ring-[#D4AF37] cursor-pointer"
                            />
                            <span>Chọn tất cả danh sách đang hiển thị</span>
                          </label>

                          <button
                            type="button"
                            onClick={() => {
                              const unscraped = scannedResult.urls
                                .filter((u) => !u.isScraped)
                                .map((u) => u.url);
                              handleSelectAllUrls(unscraped);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 text-[11px] transition cursor-pointer"
                          >
                            Chỉ chọn bài chưa cào ({scannedResult.unscrapedCount})
                          </button>
                        </div>

                        {/* Bộ lọc hiển thị (Tất cả vs Chỉ bài chưa cào) */}
                        <div className="flex items-center space-x-1.5">
                          <span className="text-slate-400 font-medium flex items-center mr-1">
                            <ListFilter className="w-3.5 h-3.5 mr-1 text-slate-400" /> Xem:
                          </span>
                          <button
                            type="button"
                            onClick={() => setDomainFilter("all")}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                              domainFilter === "all"
                                ? "bg-[#D4AF37] text-[#0A1E5E] font-bold shadow"
                                : "bg-white/5 text-slate-400 hover:text-white"
                            }`}
                          >
                            Tất cả ({scannedResult.totalFound})
                          </button>
                          <button
                            type="button"
                            onClick={() => setDomainFilter("unscraped")}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                              domainFilter === "unscraped"
                                ? "bg-emerald-500 text-white font-bold shadow"
                                : "bg-white/5 text-slate-400 hover:text-white"
                            }`}
                          >
                            Chưa cào ({scannedResult.unscrapedCount})
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* DANH SÁCH BÀI VIẾT VỚI TRẠNG THÁI TIẾN TRÌNH THỜI GIAN THỰC */}
                    <div className="max-h-[460px] overflow-y-auto space-y-2 pr-1 rounded-2xl border border-white/10 p-2.5 bg-black/30">
                      {scannedResult.urls
                        .filter((item) => domainFilter === "all" || !item.isScraped)
                        .map((item, idx) => {
                          const isSelected = selectedUrls.includes(item.url);
                          return (
                            <div
                              key={item.url}
                              className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                                item.status === "scraping"
                                  ? "bg-sky-500/15 border-sky-400/50 ring-1 ring-sky-400/40"
                                  : item.status === "generating"
                                  ? "bg-amber-500/15 border-amber-400/50 ring-1 ring-amber-400/40"
                                  : item.status === "waiting"
                                  ? "bg-white/10 border-white/20 opacity-80"
                                  : item.status === "success"
                                  ? "bg-emerald-500/15 border-emerald-500/40"
                                  : isSelected
                                  ? "bg-white/10 border-[#D4AF37]/50"
                                  : "bg-white/5 border-white/5 hover:bg-white/10"
                              }`}
                            >
                              {/* Cột Trái: Checkbox + Tiêu đề + Link */}
                              <div className="flex items-start space-x-3 min-w-0 flex-1">
                                <input
                                  type="checkbox"
                                  id={`checkbox-${idx}`}
                                  checked={isSelected}
                                  onChange={() => handleToggleSelectUrl(item.url)}
                                  disabled={isBatchRunning}
                                  className="mt-1 w-4 h-4 rounded text-[#D4AF37] bg-white/10 border-white/20 focus:ring-[#D4AF37] cursor-pointer"
                                />
                                <div className="min-w-0 flex-1 space-y-0.5">
                                  <label
                                    htmlFor={`checkbox-${idx}`}
                                    className="text-xs font-semibold text-white block truncate cursor-pointer hover:text-[#D4AF37] transition"
                                    title={item.title}
                                  >
                                    {item.title}
                                  </label>
                                  <a
                                    href={item.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[11px] text-slate-400 hover:text-slate-200 truncate flex items-center space-x-1"
                                  >
                                    <span className="truncate">{item.url}</span>
                                    <ExternalLink className="w-3 h-3 shrink-0" />
                                  </a>
                                </div>
                              </div>

                              {/* Cột Phải: Badge Trạng thái + Nút Chạy riêng tại chỗ */}
                              <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                                {/* Trạng thái Queue Runner chi tiết */}
                                {item.status === "waiting" ? (
                                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center space-x-1.5">
                                    <Clock className="w-3 h-3 text-amber-400" />
                                    <span>Chờ xử lý...</span>
                                  </span>
                                ) : item.status === "scraping" ? (
                                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/40 flex items-center space-x-1.5 animate-pulse">
                                    <Loader2 className="w-3 h-3 animate-spin text-sky-400" />
                                    <span>Đang cào & phân tích</span>
                                  </span>
                                ) : item.status === "generating" ? (
                                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 flex items-center space-x-1.5 animate-pulse">
                                    <Sparkles className="w-3 h-3 animate-spin text-[#D4AF37]" />
                                    <span>Đang sinh bài (AI)</span>
                                  </span>
                                ) : item.status === "success" ? (
                                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center space-x-1.5 shadow-sm">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                    <span>Hoàn thành (Đã lưu nháp)</span>
                                  </span>
                                ) : item.status === "error" ? (
                                  <span
                                    className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center space-x-1.5"
                                    title={item.error}
                                  >
                                    <AlertCircle className="w-3 h-3 text-rose-400" />
                                    <span>Lỗi xử lý</span>
                                  </span>
                                ) : item.isScraped ? (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-500/20 text-slate-400 border border-slate-500/30">
                                    Đã cào trước đó
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                    Chưa cào
                                  </span>
                                )}

                                {/* NÚT CHẠY RIÊNG TẠI CHỖ (KHÔNG CHUYỂN TAB) */}
                                {item.status === "success" ? (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      // Tìm bài viết trong postsList hoặc chuyển sang xem kết quả nếu muốn
                                      const foundPost = postsList.find(
                                        (p) =>
                                          p.competitor_source_url === item.url ||
                                          p.title === item.title
                                      );
                                      if (foundPost) {
                                        handleStartEditPost(foundPost);
                                      } else {
                                        setActiveResultTab("article");
                                      }
                                    }}
                                    className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[11px] font-bold transition cursor-pointer flex items-center space-x-1"
                                    title="Xem bản nháp đã lưu trong Database"
                                  >
                                    <span>Xem nháp</span>
                                    <Eye className="w-3 h-3" />
                                  </button>
                                ) : item.status === "scraping" || item.status === "generating" ? (
                                  <span className="text-[11px] text-amber-300 italic px-2 py-1">
                                    Đang xử lý ngầm...
                                  </span>
                                ) : (
                                  <button
                                    type="button"
                                    disabled={isBatchRunning || isAnalyzing}
                                    onClick={() => handleRunSingleInPlace(item.url, item.title)}
                                    className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-[#D4AF37] hover:text-[#0A1E5E] text-slate-200 text-[11px] font-medium transition cursor-pointer flex items-center space-x-1"
                                    title="Chạy ngầm bài này ngay tại đây và lưu bản nháp"
                                  >
                                    <span>Chạy riêng bài này</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* =====================================================================
                CHẾ ĐỘ 1: NHẬP LINK BÀI VIẾT ĐƠN LẺ (GIỮ NGUYÊN TOÀN BỘ TÍNH NĂNG)
            ===================================================================== */}
            {scanMode === "single" && (
              <div className="space-y-6">
                {/* Sample Buttons theo từng Search Intent */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs pb-3 border-b border-white/5">
                  <span className="text-slate-400 text-[11px] font-medium mr-1">Mẫu test v2.4.5:</span>
                  <button
                    type="button"
                    onClick={() =>
                      fillSample(
                        "https://hoabinhevents.com/chi-phi-to-chuc-le-khanh-thanh-nha-may-la-bao-nhieu",
                        "báo giá tổ chức lễ khánh thành nhà máy",
                        "Nhấn mạnh vào năng lực từng khánh thành Nhà máy EIFFEL Damsan, múa lân sư rồng và kho thiết bị Line Array nhập khẩu trực tiếp."
                      )
                    }
                    className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] transition cursor-pointer"
                  >
                    🎉 Lễ Khai trương
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      fillSample(
                        "https://vietnamevents.com/to-chuc-year-end-party",
                        "tổ chức year end party công ty",
                        "Tập trung vào concept Gatsby / Oscar, visual 3D mapping, kịch bản vinh danh 3 cung bậc cảm xúc, hotline 0844 198 333."
                      )
                    }
                    className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] transition cursor-pointer"
                  >
                    🥂 Year End Party
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      fillSample(
                        "https://vietranstour.com/tour-team-building-doanh-nghiep",
                        "tour team building kết hợp gala dinner",
                        "Nhấn mạnh mô hình Hybrid Event & Travel một đầu mối, sở hữu đội xe 16-45 chỗ đời mới, bao trọn khâu đưa đón và sân khấu gala bãi biển."
                      )
                    }
                    className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[11px] transition cursor-pointer"
                  >
                    🏖️ Team Building
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      fillSample(
                        "https://marcom.com.vn/to-chuc-hoi-nghi-hoi-thao-chuyen-nghiep",
                        "tổ chức hội thảo chuyên đề doanh nghiệp",
                        "Tập trung vào hệ thống micro cổ ngỗng UHF 16 kênh chống nhiễu, màn hình LED P2.5 trong nhà độ mịn cao không lóa mắt, teabreak VIP."
                      )
                    }
                    className="px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[11px] transition cursor-pointer"
                  >
                    🎤 Hội nghị / Tọa đàm
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      fillSample(
                        "https://chothueamthanhas.com/bang-gia-thue-am-thanh-anh-sang-ha-noi",
                        "báo giá thuê âm thanh ánh sáng màn hình led hà nội",
                        "Báo giá gốc từ kho, không qua trung gian, thông số loa Line Array nhập khẩu, màn LED P2.5/P3.91, kỹ thuật trực chiến 100%."
                      )
                    }
                    className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[11px] transition cursor-pointer"
                  >
                    🔊 Thuê thiết bị kho
                  </button>
                </div>

                <form onSubmit={handleScanAndGenerate} className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    {/* URL Input */}
                    <div className="lg:col-span-7">
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        URL bài viết đối thủ cạnh tranh <span className="text-[#D4AF37]">*</span>
                      </label>
                      <div className="relative">
                        <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                        <input
                          type="url"
                          required
                          placeholder="https://doithu.com/bai-viet-to-chuc-su-kien"
                          value={competitorUrl}
                          onChange={(e) => setCompetitorUrl(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition"
                        />
                      </div>
                    </div>

                    {/* Target Keyword */}
                    <div className="lg:col-span-5">
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Từ khóa mục tiêu (Focus keyword)
                      </label>
                      <input
                        type="text"
                        placeholder="VD: tổ chức lễ khánh thành nhà máy"
                        value={targetKeyword}
                        onChange={(e) => setTargetKeyword(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition"
                      />
                    </div>
                  </div>

                  {/* =========================================================================
                      BỘ KẾT NỐI HỒ SƠ SỰ KIỆN THỰC TẾ & BẰNG CHỨNG E-E-A-T DOANH NGHIỆP
                  ========================================================================= */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.04] border border-[#D4AF37]/35 shadow-xl space-y-3.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-white/10">
                      <div className="flex items-center space-x-2">
                        <div className="w-7 h-7 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                            <span>Liên kết Hồ Sơ Sự Kiện Thực Tế</span>
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-[#D4AF37] text-[#0A1E5E]">
                              E-E-A-T Độc Bản
                            </span>
                          </h4>
                          <p className="text-[11px] text-slate-300">
                            Tự động lấy ảnh hiện trường, bóc tách chi phí thật và trích dẫn khách hàng vào bài viết SEO
                          </p>
                        </div>
                      </div>

                      {/* Dropdown Selector */}
                      <div className="sm:w-72">
                        <select
                          value={selectedEventId}
                          onChange={(e) => setSelectedEventId(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-xl bg-[#0A1E5E] border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-semibold outline-none focus:ring-2 focus:ring-[#D4AF37] transition cursor-pointer"
                        >
                          <option value="auto">🎯 AI Tự Động Chọn Theo Từ Khóa</option>
                          {availableProfiles.map((p) => (
                            <option key={p.id} value={p.id}>
                              [{p.categoryLabel || p.category}] {p.title.slice(0, 32)}... ({p.guestCount} khách)
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Active Event Preview Card */}
                    {activeEventProfile && (
                      <div className="p-3 sm:p-3.5 rounded-xl bg-black/25 border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-3.5">
                        <div className="flex items-start sm:items-center space-x-3 min-w-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={activeEventProfile.coverImage}
                            alt={activeEventProfile.title}
                            className="w-16 h-14 sm:w-20 sm:h-16 rounded-lg object-cover border border-white/15 shrink-0 shadow-md"
                          />
                          <div className="min-w-0 space-y-1">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30">
                                {activeEventProfile.categoryLabel || activeEventProfile.category}
                              </span>
                              <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Đã hoàn thành ({activeEventProfile.guestCount} khách VIP)
                              </span>
                            </div>
                            <h5 className="text-xs sm:text-sm font-bold text-white truncate max-w-md">
                              {activeEventProfile.title}
                            </h5>
                            <p className="text-[11px] text-slate-300 truncate">
                              🏢 {activeEventProfile.client?.company} • 📍 {activeEventProfile.location?.venue}
                            </p>
                          </div>
                        </div>

                        {/* Dải ảnh hiện trường & Tùy chọn */}
                        <div className="flex flex-wrap md:flex-col items-start md:items-end gap-2 shrink-0">
                          <div className="flex items-center space-x-1.5">
                            <span className="text-[10px] text-slate-400 mr-1 hidden sm:inline">Ảnh hiện trường:</span>
                            {(activeEventProfile.gallery || []).slice(0, 3).map((img: any, gIdx: number) => (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                key={gIdx}
                                src={img.url}
                                alt={img.caption}
                                title={img.caption}
                                className="w-8 h-8 rounded-md object-cover border border-white/20 hover:scale-125 transition-transform cursor-pointer"
                              />
                            ))}
                          </div>

                          <button
                            type="button"
                            onClick={() => setActiveAdminTab("events")}
                            className="text-[11px] text-[#D4AF37] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                          >
                            <span>Xem chi tiết hồ sơ sự kiện</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Checkbox Options */}
                    <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-200">
                      <label className="flex items-center space-x-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={includeRealImages}
                          onChange={(e) => setIncludeRealImages(e.target.checked)}
                          className="w-3.5 h-3.5 rounded text-[#D4AF37] focus:ring-[#D4AF37] bg-white/10 border-white/20 cursor-pointer"
                        />
                        <span>🖼️ Nhúng ảnh thực tế hiện trường</span>
                      </label>

                      <label className="flex items-center space-x-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={includeRealPricing}
                          onChange={(e) => setIncludeRealPricing(e.target.checked)}
                          className="w-3.5 h-3.5 rounded text-[#D4AF37] focus:ring-[#D4AF37] bg-white/10 border-white/20 cursor-pointer"
                        />
                        <span>💰 Bóc tách báo giá & dự toán chi phí thật</span>
                      </label>

                      <label className="flex items-center space-x-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={includeTestimonial}
                          onChange={(e) => setIncludeTestimonial(e.target.checked)}
                          className="w-3.5 h-3.5 rounded text-[#D4AF37] focus:ring-[#D4AF37] bg-white/10 border-white/20 cursor-pointer"
                        />
                        <span>⭐ Đánh giá của khách hàng (Social proof)</span>
                      </label>
                    </div>
                  </div>

                  {/* Custom Prompt Instructions */}
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-1 mb-1.5">
                      <label className="text-xs font-semibold text-slate-300">
                        Yêu cầu bổ sung cho AI (tùy chọn: góc nhìn độc bản, chương trình khuyến mãi...)
                      </label>
                      <span className="text-[11px] text-[#D4AF37] font-semibold flex items-center">
                        <Sparkles className="w-3 h-3 mr-1" /> Nạp minh chứng từ Hồ sơ sự kiện:
                      </span>
                    </div>

                    {/* Quick inject pills from event profiles */}
                    <div className="flex flex-wrap items-center gap-1.5 mb-2">
                      <button
                        type="button"
                        onClick={() =>
                          injectEventProof(
                            "Lễ Khai Trương Showroom Nam Hải Auto",
                            "Công ty Cổ phần Ô tô Nam Hải",
                            250,
                            "Cầu Giấy, Hà Nội",
                            "Màn LED P3 Cabin đúc, Line Array RCF Italy, Múa Lân Sư Rồng"
                          )
                        }
                        className="px-2 py-0.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-[10px] font-semibold transition"
                      >
                        + Khai trương Nam Hải (250 khách)
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          injectEventProof(
                            "Gala Dinner & Kỷ Niệm 15 Năm Sun Group",
                            "Tập Đoàn Sun Group",
                            500,
                            "Meliá Hà Nội 5 sao",
                            "Màn LED cong P2.5 45m², D&B Audiotechnik Đức, Visual 3D Hologram"
                          )
                        }
                        className="px-2 py-0.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/25 text-purple-300 border border-purple-500/30 text-[10px] font-semibold transition"
                      >
                        + Gala Sun Group Meliá (500 khách)
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          injectEventProof(
                            "Hội Nghị Thượng Đỉnh AI FPT Software",
                            "FPT Software Toàn Cầu",
                            400,
                            "Trung tâm Hội nghị Quốc gia NCC",
                            "Tai nghe phiên dịch 400 đại biểu, Cabin ISO, Livestream 4K"
                          )
                        }
                        className="px-2 py-0.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/25 text-blue-300 border border-blue-500/30 text-[10px] font-semibold transition"
                      >
                        + Hội Nghị FPT NCC (400 khách)
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          injectEventProof(
                            "Teambuilding Viettel Telecom",
                            "Viettel Telecom",
                            350,
                            "Flamingo Đại Lải 5 sao",
                            "Game tool liên hoàn hơi độc quyền, Âm thanh JBL ngoài trời, Flycam 4K"
                          )
                        }
                        className="px-2 py-0.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-[10px] font-semibold transition"
                      >
                        + Teambuilding Viettel (350 khách)
                      </button>
                    </div>

                    <textarea
                      rows={2}
                      placeholder="VD: Nhấn mạnh uy tín từng tổ chức sự kiện cho Vinpearl, Vietcombank, Cầu Thăng Long; lồng ghép hotline 0844 198 333..."
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition"
                    />
                  </div>

                  {/* Submit CTA */}
                  <div className="flex flex-col sm:flex-row items-center justify-between pt-2 gap-4">
                    <div className="text-xs text-slate-400 flex items-center space-x-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Quy trình tự động: Cào qua Jina ➔ Phân tích H1-H3 và lỗ hổng ➔ Tái tạo bài viết</span>
                    </div>

                    <button
                      type="submit"
                      disabled={isAnalyzing || !competitorUrl}
                      className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-[#D4AF37] via-[#f5e08b] to-[#D4AF37] text-[#0A1E5E] shadow-lg shadow-[#D4AF37]/20 hover:scale-105 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
                    >
                      {isAnalyzing ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Đang phân tích đối thủ...</span>
                        </>
                      ) : (
                        <>
                          <Radar className="w-4 h-4 text-[#0A1E5E]" />
                          <span>Quét và phân tích đối thủ ngay</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Visual Step Progress Indicator chuẩn Skill System Content v2.4.5 (13 Bước Workflow Tự Động) */}
            {isAnalyzing && (
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3 animate-in fade-in duration-300">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold text-[#D4AF37] flex items-center">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin mr-2" />
                    Skill System Content v2.4.5 — 13 Bước Workflow Tự Động:
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    Bước {processStep}/6: Đang thực thi
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
                  <div
                    className={`p-2 rounded-xl border flex items-center space-x-1.5 transition-all ${
                      processStep >= 1
                        ? "bg-[#0A1E5E] border-emerald-500 text-white shadow-sm"
                        : "bg-white/5 border-white/5 text-slate-400"
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold shrink-0">
                      1
                    </span>
                    <span className="truncate text-[11px]">Intent & SERP</span>
                  </div>

                  <div
                    className={`p-2 rounded-xl border flex items-center space-x-1.5 transition-all ${
                      processStep >= 2
                        ? "bg-[#0A1E5E] border-emerald-500 text-white shadow-sm"
                        : "bg-white/5 border-white/5 text-slate-400"
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold shrink-0">
                      2
                    </span>
                    <span className="truncate text-[11px]">Gap Analysis</span>
                  </div>

                  <div
                    className={`p-2 rounded-xl border flex items-center space-x-1.5 transition-all ${
                      processStep >= 3
                        ? "bg-[#0A1E5E] border-[#D4AF37] text-white shadow-sm ring-1 ring-[#D4AF37]/50"
                        : "bg-white/5 border-white/5 text-slate-400"
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold shrink-0">
                      3
                    </span>
                    <span className="truncate text-[11px] font-medium text-[#D4AF37]">Outline Planning</span>
                  </div>

                  <div
                    className={`p-2 rounded-xl border flex items-center space-x-1.5 transition-all ${
                      processStep >= 4
                        ? "bg-[#0A1E5E] border-emerald-500 text-white shadow-sm"
                        : "bg-white/5 border-white/5 text-slate-400"
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold shrink-0">
                      4
                    </span>
                    <span className="truncate text-[11px]">Specificity Deep</span>
                  </div>

                  <div
                    className={`p-2 rounded-xl border flex items-center space-x-1.5 transition-all ${
                      processStep >= 5
                        ? "bg-[#0A1E5E] border-emerald-500 text-white shadow-sm"
                        : "bg-white/5 border-white/5 text-slate-400"
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold shrink-0">
                      5
                    </span>
                    <span className="truncate text-[11px]">Extractability & AI</span>
                  </div>

                  <div
                    className={`p-2 rounded-xl border flex items-center space-x-1.5 transition-all ${
                      processStep >= 6
                        ? "bg-[#0A1E5E] border-emerald-500 text-white shadow-sm"
                        : "bg-white/5 border-white/5 text-slate-400"
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold shrink-0">
                      6
                    </span>
                    <span className="truncate text-[11px]">QA & Final Output</span>
                  </div>
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center">
                <AlertCircle className="w-4 h-4 mr-2 text-rose-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>
        </div>

        {/* =====================================================================
            RESULTS WORKSPACE: BÁO CÁO PHÂN TÍCH ĐỐI THỦ & TRÌNH BIÊN TẬP
        ===================================================================== */}
        {(analysisResult || editablePost) && (
          <div id="radar-results-editor" className="bg-[#06123B] rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl space-y-6">
            {editingPostId && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs gap-2 animate-in fade-in">
                <span className="font-semibold flex items-center">
                  <Edit3 className="w-4 h-4 mr-2 text-amber-400" />
                  Đang ở chế độ chỉnh sửa bài viết đã có trong Database
                </span>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-all w-fit"
                >
                  ✕ Hủy chỉnh sửa
                </button>
              </div>
            )}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
              {/* Tab Selector: Analysis Tab is clear & primary */}
              <div className="inline-flex p-1 rounded-xl bg-white/5 border border-white/10">
                <button
                  type="button"
                  onClick={() => setActiveResultTab("analysis")}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 ${
                    activeResultTab === "analysis"
                      ? "bg-[#D4AF37] text-[#0A1E5E] shadow-md"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>1. Báo cáo phân tích đối thủ và lỗ hổng</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveResultTab("article")}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 ${
                    activeResultTab === "article"
                      ? "bg-[#D4AF37] text-[#0A1E5E] shadow-md"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>2. Bài viết mới chuẩn SEO (Trường Hải)</span>
                </button>
              </div>

              {/* Action buttons: Save draft, Schedule, Publish */}
              <div className="flex items-center space-x-2 text-xs">
                <button
                  type="button"
                  onClick={() => handleSaveToSupabase("draft")}
                  className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 border border-white/20 font-bold flex items-center space-x-1.5 transition-all"
                  title="Lưu bản nháp"
                >
                  <Save className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Lưu nháp</span>
                </button>

                {/* Nút Hẹn Lịch Đăng Bài */}
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 font-bold flex items-center space-x-1.5 transition-all"
                  title="Hẹn giờ đăng bài tự động"
                >
                  <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Hẹn lịch đăng</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSaveToSupabase("published")}
                  className="px-4 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#edd47a] text-[#0A1E5E] font-black flex items-center space-x-1.5 shadow-md transition-all"
                >
                  <Send className="w-3.5 h-3.5 text-[#0A1E5E]" />
                  <span>Xuất bản ngay</span>
                </button>
              </div>
            </div>

            {saveStatus && (
              <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-2 shrink-0 text-emerald-400" />
                <span>{saveStatus}</span>
              </div>
            )}

            {/* TAB 1: BÁO CÁO PHÂN TÍCH ĐỐI THỦ CHUYÊN SÂU */}
            {activeResultTab === "analysis" && analysisResult && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
                  {/* Cột 1: Bối cảnh bài đối thủ */}
                  <div className="lg:col-span-5 p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-white/10">
                      <h3 className="font-bold text-white text-sm flex items-center">
                        <Layers className="w-4 h-4 mr-2 text-[#D4AF37]" />
                        Bối cảnh và cấu trúc đối thủ
                      </h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#D4AF37] text-[#0A1E5E]">
                        Điểm SEO: {analysisResult.seoScore || 65}/100
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[11px]">Tiêu đề H1 của đối thủ:</span>
                      <p className="font-bold text-white text-xs mt-1 bg-black/20 p-2.5 rounded-xl border border-white/5">
                        {analysisResult.h1 || "Không xác định"}
                      </p>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[11px] mb-1.5">
                        Dàn ý các phân đoạn chính (H2, H3):
                      </span>
                      <ul className="space-y-1.5 text-slate-300 max-h-56 overflow-y-auto pr-1">
                        {analysisResult.headings?.map((h: string, hIdx: number) => (
                          <li key={hIdx} className="flex items-start bg-white/5 p-2 rounded-lg">
                            <span className="text-[#D4AF37] font-bold mr-2 shrink-0">#</span>
                            <span className="leading-snug">{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-2 border-t border-white/10 flex items-center justify-between text-slate-400">
                      <span>Dung lượng bài đối thủ: ~<strong>{analysisResult.wordCountEstimate || 500}</strong> từ</span>
                    </div>
                  </div>

                  {/* Cột 2: Ma trận Lỗ hổng vs Vũ khí Trường Hải */}
                  <div className="lg:col-span-7 p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-white/10">
                      <h3 className="font-bold text-amber-300 text-sm flex items-center">
                        <ShieldAlert className="w-4 h-4 mr-2 text-amber-400" />
                        Ma trận đối soát: Lỗ hổng đối thủ vs vũ khí Trường Hải
                      </h3>
                      <span className="text-[10px] text-slate-400">
                        {analysisResult.weaknesses?.length || 0} điểm phát hiện
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-300 leading-relaxed font-light">
                      Hệ thống đã phân tích bối cảnh bài đối thủ và đề xuất các luận điểm thế mạnh độc quyền để bài viết mới của Trường Hải hoàn toàn vượt trội:
                    </p>

                    <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                      {analysisResult.weaknesses?.map((w: string, wIdx: number) => {
                        const parts = w.split(/➔\s*(?:🎯)?\s*Vũ khí Trường Hải:/i);
                        const competitorWeakness = parts[0]?.replace(/^⚠️\s*Lỗ hổng:\s*/i, "").trim();
                        const truongHaiAdvantage = parts[1]?.trim();

                        if (truongHaiAdvantage) {
                          return (
                            <div
                              key={wIdx}
                              className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2.5 hover:border-white/20 transition-colors"
                            >
                              <div className="flex items-start space-x-2.5">
                                <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 font-bold text-[10px] shrink-0 border border-rose-500/30">
                                  Lỗ hổng đối thủ
                                </span>
                                <p className="text-slate-300 text-xs leading-relaxed">
                                  {competitorWeakness}
                                </p>
                              </div>

                              <div className="flex items-start space-x-2.5 pt-2 border-t border-white/5">
                                <span className="px-2 py-0.5 rounded-md bg-[#D4AF37]/20 text-[#D4AF37] font-bold text-[10px] shrink-0 border border-[#D4AF37]/30">
                                  Vũ khí Trường Hải
                                </span>
                                <p className="text-white text-xs font-semibold leading-relaxed">
                                  {truongHaiAdvantage}
                                </p>
                              </div>
                            </div>
                          );
                        }

                        return (
                          <div
                            key={wIdx}
                            className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-slate-200 text-xs leading-relaxed"
                          >
                            {w.replace(/⚠️/g, "").replace(/🎯/g, "")}
                          </div>
                        );
                      })}
                    </div>

                    <div className="pt-3 border-t border-white/10 flex flex-wrap items-center gap-2">
                      <span className="text-slate-400 text-[11px]">Từ khóa liên quan:</span>
                      {analysisResult.targetKeywords?.map((kw: string, kIdx: number) => (
                        <span
                          key={kIdx}
                          className="px-2 py-0.5 rounded bg-white/10 text-slate-300 text-[10px] font-mono"
                        >
                          #{kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Hộp chuyển hướng hành động sang viết bài */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0A1E5E] to-[#122868] border border-[#D4AF37]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1 text-center sm:text-left">
                    <h4 className="font-bold text-white text-sm flex items-center justify-center sm:justify-start space-x-1.5">
                      <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                      <span>Đã hoàn tất phân tích đối soát lỗ hổng đối thủ!</span>
                    </h4>
                    <p className="text-xs text-slate-300 font-light">
                      Bài viết mới chuẩn SEO đã được tạo sẵn với đầy đủ các vũ khí và cam kết của Trường Hải Event.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveResultTab("article")}
                    className="px-6 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-amber-400 text-[#0A1E5E] font-black text-xs flex items-center space-x-2 shadow-lg shrink-0 cursor-pointer"
                  >
                    <span>Xem và biên tập bài viết mới</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: ARTICLE EDITOR */}
            {activeResultTab === "article" && editablePost && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                  <div className="lg:col-span-8">
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Tiêu đề bài viết SEO
                    </label>
                    <input
                      type="text"
                      value={editablePost.title || ""}
                      onChange={(e) =>
                        setEditablePost({ ...editablePost, title: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    />
                  </div>

                  <div className="lg:col-span-4">
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Từ khóa chính (Focus keyword)
                    </label>
                    <input
                      type="text"
                      value={editablePost.focus_keyword || ""}
                      onChange={(e) =>
                        setEditablePost({
                          ...editablePost,
                          focus_keyword: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                  <div className="lg:col-span-6">
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Đường dẫn tĩnh (Slug URL)
                    </label>
                    <input
                      type="text"
                      value={editablePost.slug || ""}
                      onChange={(e) =>
                        setEditablePost({ ...editablePost, slug: e.target.value })
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-slate-300 text-xs font-mono outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    />
                  </div>

                  <div className="lg:col-span-6">
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Meta description (tóm tắt chuẩn SEO)
                    </label>
                    <input
                      type="text"
                      value={editablePost.meta_description || ""}
                      onChange={(e) =>
                        setEditablePost({
                          ...editablePost,
                          meta_description: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    />
                  </div>
                </div>

                {/* Thước đo chuẩn SEO On-Page Real-time */}
                <SeoScoreChecklist
                  title={editablePost.title || ""}
                  focusKeyword={editablePost.focus_keyword || ""}
                  metaDescription={editablePost.meta_description || ""}
                  slug={editablePost.slug || ""}
                  content={editablePost.content || ""}
                />

                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 mb-3 border-b border-white/10 gap-2">
                    <div className="flex items-center space-x-2">
                      <label className="text-xs font-bold text-white">
                        Nội dung bài viết chuẩn SEO
                      </label>
                      <span className="text-[11px] text-slate-400">
                        ({editablePost.content?.length || 0} ký tự)
                      </span>
                    </div>

                    {/* Bộ chuyển đổi: Xem trước trực quan vs Soạn thảo mã nguồn */}
                    <div className="inline-flex p-1 rounded-xl bg-white/10 border border-white/15 text-xs">
                      <button
                        type="button"
                        onClick={() => setArticlePreviewMode("preview")}
                        className={`px-3 py-1.5 rounded-lg font-bold flex items-center space-x-1.5 transition-all ${
                          articlePreviewMode === "preview"
                            ? "bg-[#D4AF37] text-[#0A1E5E] shadow-sm"
                            : "text-slate-300 hover:text-white"
                        }`}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Xem trước giao diện thực tế</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setArticlePreviewMode("edit")}
                        className={`px-3 py-1.5 rounded-lg font-bold flex items-center space-x-1.5 transition-all ${
                          articlePreviewMode === "edit"
                            ? "bg-[#D4AF37] text-[#0A1E5E] shadow-sm"
                            : "text-slate-300 hover:text-white"
                        }`}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Chỉnh sửa mã nguồn</span>
                      </button>
                    </div>
                  </div>

                  {articlePreviewMode === "preview" ? (
                    <div className="p-6 sm:p-8 rounded-3xl bg-white text-slate-800 shadow-2xl border border-slate-200 max-h-[600px] overflow-y-auto">
                      <div className="pb-4 mb-6 border-b border-slate-100 flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          Bản xem trước như hiển thị trên trang tin tức
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Đã tối ưu cấu trúc & loại bỏ ký tự thừa
                        </span>
                      </div>
                      <ArticleContentRenderer content={editablePost.content || ""} />
                    </div>
                  ) : (
                    <textarea
                      rows={18}
                      value={editablePost.content || ""}
                      onChange={(e) =>
                        setEditablePost({ ...editablePost, content: e.target.value })
                      }
                      className="w-full p-4 rounded-2xl bg-white/5 border border-white/15 text-slate-200 text-xs font-mono leading-relaxed outline-none focus:ring-2 focus:ring-[#D4AF37]"
                      placeholder="Nội dung bài viết..."
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* MODAL HẸN LỊCH ĐĂNG BÀI */}
        {showScheduleModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#0A1E5E] border border-[#D4AF37]/40 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
              <div className="flex items-center space-x-2 text-white">
                <Calendar className="w-5 h-5 text-[#D4AF37]" />
                <h3 className="font-bold text-base">Hẹn lịch đăng bài tự động</h3>
              </div>

              <p className="text-xs text-slate-300">
                Chọn ngày và giờ bạn muốn bài viết này tự động được xuất bản lên chuyên mục Tin tức & Cẩm nang:
              </p>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Thời gian xuất bản dự kiến:
                </label>
                <input
                  type="datetime-local"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-slate-300 text-xs font-semibold hover:bg-white/15"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  disabled={!scheduledTime}
                  onClick={() => handleSaveToSupabase("scheduled")}
                  className="px-5 py-2 rounded-xl bg-[#D4AF37] text-[#0A1E5E] text-xs font-bold hover:bg-amber-400 disabled:opacity-50"
                >
                  Xác nhận hẹn lịch
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            DASHBOARD METRIC CARDS (THỐNG KÊ TỔNG QUAN)
        ===================================================================== */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[#06123B] border border-white/10 shadow-xl flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Tổng bài viết SEO</p>
              <h3 className="text-2xl font-black text-white">{postsList.length}</h3>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#06123B] border border-white/10 shadow-xl flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Đã xuất bản</p>
              <h3 className="text-2xl font-black text-emerald-400">{publishedCount}</h3>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#06123B] border border-white/10 shadow-xl flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Bản nháp chờ duyệt</p>
              <h3 className="text-2xl font-black text-amber-400">{draftCount}</h3>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#06123B] border border-white/10 shadow-xl flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Khách cần tư vấn</p>
              <h3 className="text-2xl font-black text-[#D4AF37]">{leadsList.length}</h3>
            </div>
          </div>
        </div>

        {/* =====================================================================
            CMS DATA WORKSPACE: POSTS MANAGEMENT & LEADS MANAGEMENT
        ===================================================================== */}
        <div className="bg-[#06123B] rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Main CMS Tab Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
            <div className="inline-flex flex-wrap p-1 rounded-xl bg-white/5 border border-white/10 gap-1">
              <button
                type="button"
                onClick={() => setActiveAdminTab("posts")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 ${
                  activeAdminTab === "posts"
                    ? "bg-[#D4AF37] text-[#0A1E5E] shadow-md font-black"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Quản Lý Bài Viết SEO ({postsList.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveAdminTab("leads")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 ${
                  activeAdminTab === "leads"
                    ? "bg-[#D4AF37] text-[#0A1E5E] shadow-md font-black"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Khách Hàng Đăng Ký Tư Vấn ({leadsList.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveAdminTab("events")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 ${
                  activeAdminTab === "events"
                    ? "bg-[#D4AF37] text-[#0A1E5E] shadow-md font-black"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Hồ Sơ Sự Kiện & Lưu Trữ Dự Án ({eventProfilesCount})</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                fetchPosts();
                fetchLeads();
                if (typeof window !== "undefined") {
                  setEventProfilesCount(getStoredEventProfiles().length);
                }
              }}
              className="inline-flex items-center text-xs text-[#D4AF37] hover:underline self-end sm:self-auto"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1" />
              Làm mới dữ liệu
            </button>
          </div>

          {activeAdminTab === "posts" ? (
            <div className="space-y-4">
              {/* Search & Filter Toolbar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1 pb-1">
                {/* Search Input */}
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo tiêu đề, từ khóa, slug..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-8 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent placeholder:text-slate-500 transition"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs p-1"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Filter Pills */}
                <div className="flex items-center space-x-1.5 p-1 rounded-xl bg-white/5 border border-white/10 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setStatusFilter("all")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      statusFilter === "all"
                        ? "bg-[#D4AF37] text-[#0A1E5E] shadow-sm font-bold"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Tất cả ({postsList.length})
                  </button>

                  <button
                    type="button"
                    onClick={() => setStatusFilter("published")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1 ${
                      statusFilter === "published"
                        ? "bg-emerald-500 text-white shadow-sm font-bold"
                        : "text-emerald-400 hover:bg-emerald-500/10"
                    }`}
                  >
                    <span>Đã duyệt ({publishedCount})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStatusFilter("draft")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1 ${
                      statusFilter === "draft"
                        ? "bg-amber-500 text-slate-900 shadow-sm font-bold"
                        : "text-amber-400 hover:bg-amber-500/10"
                    }`}
                  >
                    <span>Nháp ({draftCount})</span>
                  </button>
                </div>
              </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-2">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center">
                <FileText className="w-5 h-5 mr-2 text-[#D4AF37]" />
                Quản lý bài viết SEO (bảng 'posts')
              </h2>
              <p className="text-xs text-slate-400">
                Theo dõi các bài viết được Radar AI tạo ra, duyệt chuyển trạng thái, hẹn lịch hoặc xóa bài viết
              </p>
            </div>

            <button
              type="button"
              onClick={fetchPosts}
              className="inline-flex items-center text-xs text-[#D4AF37] hover:underline"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1" />
              Làm mới danh sách
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-white/5 uppercase text-[10px] text-slate-400">
                <tr>
                  <th className="py-3 px-4">Tiêu đề bài viết</th>
                  <th className="py-3 px-4">Từ khóa chính</th>
                  <th className="py-3 px-4">Trạng thái</th>
                  <th className="py-3 px-4">Thời gian tạo</th>
                  <th className="py-3 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredPosts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <FileText className="w-8 h-8 text-slate-600" />
                        <p className="text-xs">
                          {searchQuery
                            ? `Không tìm thấy bài viết nào khớp với từ khóa "${searchQuery}"`
                            : "Không có bài viết nào trong danh mục này"}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-white max-w-xs truncate">
                      {post.title}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      <span className="px-2 py-0.5 rounded bg-white/10 text-[11px]">
                        {post.focus_keyword || "N/A"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {post.status === "published" ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Published
                        </span>
                      ) : post.status === "scheduled" ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                          <Calendar className="w-3 h-3 mr-1" />
                          Lên lịch
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                          <Clock className="w-3 h-3 mr-1" />
                          Draft (Nháp)
                        </span>
                      )}
                    </td>
                    {/* HIỂN THỊ RÕ GIỜ : PHÚT : GIÂY VÀ NGÀY/THÁNG/NĂM */}
                    <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap font-mono text-[11px]">
                      <span className="flex items-center text-slate-300">
                        <Clock className="w-3 h-3 text-[#D4AF37] mr-1.5 shrink-0" />
                        {formatFullDateTime(post.created_at)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2 whitespace-nowrap">
                      {/* Nút Duyệt / Thu hồi */}
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(post)}
                        className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                          post.status === "published"
                            ? "bg-white/10 hover:bg-white/20 text-slate-300"
                            : "bg-[#D4AF37] hover:bg-amber-400 text-[#0A1E5E] font-bold"
                        }`}
                      >
                        {post.status === "published" ? "Thu hồi nháp" : "Duyệt đăng"}
                      </button>

                      {/* Nút Sửa bài viết */}
                      <button
                        type="button"
                        onClick={() => handleStartEditPost(post)}
                        className="px-2 py-1 rounded bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 border border-amber-500/30 inline-flex items-center transition-all ml-1"
                        title="Chỉnh sửa bài viết"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>

                      {/* Nút Xem bài viết */}
                      <Link
                        href={`/tin-tuc/${post.slug}`}
                        target="_blank"
                        className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-slate-300 inline-flex items-center ml-1"
                        title="Xem bài viết"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </Link>

                      {/* NÚT XÓA BẢN NHÁP / BÀI VIẾT */}
                      <button
                        type="button"
                        onClick={() => handleDeletePost(post)}
                        className="px-2 py-1 rounded bg-rose-500/10 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30 inline-flex items-center transition-colors"
                        title="Xóa bài viết này"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                )))}
              </tbody>
            </table>
          </div>
            </div>
          ) : activeAdminTab === "leads" ? (
            /* =====================================================================
               LEADS MANAGEMENT TABLE (DANH SÁCH KHÁCH HÀNG BÁO GIÁ)
            ===================================================================== */
            <div className="space-y-6">
              <div className="grid grid-cols-1 xl:grid-cols-[1.3fr_0.7fr] gap-6">
                <ConversionFunnel leads={leadsList} showCardWrapper={true} />
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 text-slate-900">
                  <CustomerSourcesChart leads={leadsList} />
                </div>
              </div>

              {/* LỊCH VẬN HÀNH SỰ KIỆN & ĐIỀU PHỐI (RADAR CALENDAR) */}
              <div className="text-slate-900">
                <EventCalendar leads={leadsList} onRefreshLeads={fetchLeads} showWrapperCard={true} />
              </div>

              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400">
                  Danh sách khách hàng điền form nhận báo giá từ website Trường Hải Event & Travel
                </p>
                <span className="text-xs text-emerald-400 font-semibold flex items-center">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse mr-1.5" />
                  Đồng bộ Real-time từ Supabase
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-white/5 uppercase text-[10px] text-slate-400">
                    <tr>
                      <th className="py-3 px-4">Khách hàng</th>
                      <th className="py-3 px-4">Thông tin liên hệ</th>
                      <th className="py-3 px-4">Nhu cầu sự kiện</th>
                      <th className="py-3 px-4">Ghi chú chi tiết</th>
                      <th className="py-3 px-4 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {leadsList.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-400">
                          <div className="flex flex-col items-center justify-center space-y-2">
                            <Users className="w-8 h-8 text-slate-600" />
                            <p className="text-xs">Chưa có khách hàng nào để lại yêu cầu tư vấn</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      leadsList.map((lead) => (
                        <tr key={lead.id || Math.random()} className="hover:bg-white/5 transition-colors">
                          <td className="py-3 px-4 font-semibold text-white">
                            <div>
                              <span>{lead.full_name}</span>
                              <span className="block text-[10px] text-slate-400 font-normal">
                                {lead.created_at
                                  ? formatFullDateTime(lead.created_at)
                                  : "Mới gửi"}
                              </span>
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            <div className="space-y-1">
                              <a
                                href={`tel:${lead.phone}`}
                                className="flex items-center text-[#D4AF37] hover:underline font-bold"
                              >
                                <PhoneCall className="w-3 h-3 mr-1" />
                                {lead.phone}
                              </a>
                              {lead.email && (
                                <a
                                  href={`mailto:${lead.email}`}
                                  className="flex items-center text-slate-400 hover:text-slate-200 text-[11px]"
                                >
                                  <Mail className="w-3 h-3 mr-1" />
                                  {lead.email}
                                </a>
                              )}
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            <span className="px-2.5 py-1 rounded-lg bg-[#0A1E5E] border border-[#D4AF37]/30 text-[#D4AF37] font-semibold text-[11px] inline-block">
                              {lead.event_type}
                            </span>
                          </td>

                          <td className="py-3 px-4 text-slate-300 max-w-sm">
                            <p className="line-clamp-2 text-xs">
                              {lead.notes || "Không có ghi chú thêm."}
                            </p>
                          </td>

                          <td className="py-3 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => handleDeleteLead(lead.id)}
                              className="px-2 py-1 rounded bg-rose-500/10 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30 inline-flex items-center transition-colors"
                              title="Xóa yêu cầu tư vấn này"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* =====================================================================
               EVENT PROFILES MANAGEMENT & ARCHIVE (HỒ SƠ SỰ KIỆN & CASE STUDIES)
            ===================================================================== */
            <EventProfileArchive
              onOpenInRadarEditor={(post) => {
                setEditablePost(post);
                setActiveResultTab("article");
                setArticlePreviewMode("edit");
                setTimeout(() => {
                  const editorEl = document.getElementById("radar-results-editor");
                  if (editorEl) editorEl.scrollIntoView({ behavior: "smooth" });
                }, 100);
              }}
              onPostCreated={(newPost) => {
                setPostsList((prev) => [newPost, ...prev]);
                fetchPosts();
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
