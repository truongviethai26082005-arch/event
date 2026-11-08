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
import { supabase, isSupabaseConfigured, DatabasePost } from "@/lib/supabase";
import EventProfileArchive from "./EventProfileArchive";
import BrandBrainViewer from "./BrandBrainViewer";
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
  Compass,
  Activity,
  AlertTriangle,
  Target,
  Menu,
  Wand2,
  Bot,
  Zap,
  X,
  Plus,
} from "lucide-react";
import RadarSidebar, { RadarNavSection } from "./RadarSidebar";
import SerpRadarPanel from "./SerpRadarPanel";
import ArticleContentRenderer from "@/components/ArticleContentRenderer";
import CompetitorDropdown from "./CompetitorDropdown";
import SeoScoreChecklist from "./SeoScoreChecklist";
import CompetitorsManager from "./CompetitorsManager";
import ContentGapDashboard from "./ContentGapDashboard";
import RadarActivityLogs from "./RadarActivityLogs";
import {
  getStoredCompetitors,
  getStoredContentGaps,
  getStoredRadarLogs,
  getStoredScheduleConfig,
} from "./competitors-data";
import {
  CompetitorPreset,
  saveCustomCompetitor,
  DEFAULT_COMPETITOR_PRESETS,
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

  // 5 Mục canonical: "viet_bai" | "duyet_bai" | "bo_nao" | "doi_thu" | "ke_hoach"
  const [activeNavSection, setActiveNavSection] = useState<RadarNavSection>("top_google");

  // State duyệt bài & kiểm soát chất lượng (QA)
  const [reviewingPost, setReviewingPost] = useState<DatabasePost | null>(null);
  const [reviewingChecklist, setReviewingChecklist] = useState<{
    dataChecked: boolean;
    keywordChecked: boolean;
    brandBrainChecked: boolean;
    formatChecked: boolean;
  }>({
    dataChecked: false,
    keywordChecked: false,
    brandBrainChecked: false,
    formatChecked: false,
  });

  // State Soát lỗi QA tự động bằng máy
  const [isQaRunning, setIsQaRunning] = useState(false);
  const [qaReport, setQaReport] = useState<any>(null);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeAdminTab, setActiveAdminTab] = useState<
    "posts" | "competitors" | "content_gap" | "activity_logs" | "leads" | "events"
  >("posts");

  // Radar Engine Stats (Đối thủ, Khoảng trống SEO, Nhật ký, Lịch ngầm)
  const [trackedCompetitors, setTrackedCompetitors] = useState<any[]>([]);
  const [contentGaps, setContentGaps] = useState<any[]>([]);
  const [radarLogs, setRadarLogs] = useState<any[]>([]);
  const [scheduleConfig, setScheduleConfig] = useState<any>(null);

  const refreshRadarStats = () => {
    if (typeof window !== "undefined") {
      setTrackedCompetitors(getStoredCompetitors());
      setContentGaps(getStoredContentGaps());
      setRadarLogs(getStoredRadarLogs());
      setScheduleConfig(getStoredScheduleConfig());
    }
  };

  useEffect(() => {
    refreshRadarStats();
  }, []);
  const [eventProfilesCount, setEventProfilesCount] = useState<number>(DEFAULT_EVENT_PROFILES.length);

  // Hồ sơ sự kiện liên kết với Radar SEO
  const [selectedEventId, setSelectedEventId] = useState<string>("auto");
  const [includeRealImages, setIncludeRealImages] = useState<boolean>(true);
  const [includeRealPricing, setIncludeRealPricing] = useState<boolean>(true);
  const [includeTestimonial, setIncludeTestimonial] = useState<boolean>(true);
  const [availableProfiles, setAvailableProfiles] = useState<any[]>(DEFAULT_EVENT_PROFILES);

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

  const [postsList, setPostsList] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft" | "scheduled">("all");
  const [selectedPostIds, setSelectedPostIds] = useState<string[]>([]);
  const [postNotice, setPostNotice] = useState<{
    type: "success" | "error" | "info";
    text: string;
    slug?: string | null;
  } | null>(null);

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

  // TÍCH CHỌN HÀNG LOẠT (SELECT ALL / DESELECT ALL)
  const isAllVisibleSelected =
    filteredPosts.length > 0 &&
    filteredPosts.every((p) => selectedPostIds.includes(p.id));

  const isSomeVisibleSelected =
    filteredPosts.some((p) => selectedPostIds.includes(p.id)) && !isAllVisibleSelected;

  const handleToggleSelectPost = (id: string) => {
    setSelectedPostIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllVisible = () => {
    if (isAllVisibleSelected) {
      const visibleIds = new Set(filteredPosts.map((p) => p.id));
      setSelectedPostIds((prev) => prev.filter((id) => !visibleIds.has(id)));
    } else {
      const visibleIds = filteredPosts.map((p) => p.id);
      setSelectedPostIds((prev) => Array.from(new Set([...prev, ...visibleIds])));
    }
  };

  const publishedCount = postsList.filter((p) => p.status === "published").length;
  const draftCount = postsList.filter((p) => p.status === "draft" || !p.status).length;

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
    setActiveNavSection("viet_bai");
    setTimeout(() => {
      const editorEl = document.getElementById("radar-results-editor");
      if (editorEl) {
        editorEl.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  // Cập nhật trực tiếp số liệu thật vào bài viết từ modal QA
  const handleDirectUpdateContent = async (updatedPost: DatabasePost) => {
    setPostsList((prev) => prev.map((p) => (p.id === updatedPost.id ? updatedPost : p)));
    if (isSupabaseConfigured && updatedPost.id) {
      try {
        await supabase
          .from("posts")
          .update({
            content: updatedPost.content,
            updated_at: new Date().toISOString(),
          })
          .eq("id", updatedPost.id);
      } catch (err) {
        console.error("Direct update error:", err);
      }
    }
    setPostNotice({
      type: "success",
      text: `Đã điền số liệu thực tế vào bài viết "${updatedPost.title}"!`,
      slug: updatedPost.slug,
    });
  };

  // Xuất bản bài viết trực tiếp từ modal QA
  const handlePublishDirect = async (targetPost: DatabasePost) => {
    try {
      const updated = { ...targetPost, status: "published" as const };
      setPostsList((prev) => prev.map((p) => (p.id === targetPost.id ? updated : p)));
      if (isSupabaseConfigured && targetPost.id) {
        await supabase
          .from("posts")
          .update({
            status: "published",
            updated_at: new Date().toISOString(),
          })
          .eq("id", targetPost.id);
      }
      setPostNotice({
        type: "success",
        text: `Đã phê duyệt và xuất bản bài viết "${targetPost.title}" lên website thành công!`,
        slug: targetPost.slug,
      });
    } catch (err) {
      console.error("Publish direct error:", err);
    }
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
    if (typeof window !== "undefined") {
      setAvailableProfiles(getStoredEventProfiles());
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab");
      if (
        tabParam === "viet_bai" ||
        tabParam === "viet-bai" ||
        tabParam === "editor" ||
        tabParam === "scanner"
      ) {
        setActiveNavSection("viet_bai");
      } else if (
        tabParam === "duyet_bai" ||
        tabParam === "duyet-bai" ||
        tabParam === "posts"
      ) {
        setActiveNavSection("duyet_bai");
        setStatusFilter("draft");
        setActiveAdminTab("posts");
      } else if (
        tabParam === "bo_nao" ||
        tabParam === "bo-nao" ||
        tabParam === "events"
      ) {
        setActiveNavSection("bo_nao");
        setActiveAdminTab("events");
      } else if (
        tabParam === "doi_thu" ||
        tabParam === "doi-thu" ||
        tabParam === "competitors"
      ) {
        setActiveNavSection("doi_thu");
        setActiveAdminTab("competitors");
      } else if (
        tabParam === "ke_hoach" ||
        tabParam === "ke-hoach" ||
        tabParam === "content_gap" ||
        tabParam === "cron"
      ) {
        setActiveNavSection("ke_hoach");
        setActiveAdminTab("content_gap");
      } else if (tabParam === "logs" || tabParam === "activity_logs") {
        setActiveNavSection("logs");
        setActiveAdminTab("activity_logs");
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

  // Main Radar Action: Call /api/radar (Hỗ trợ gọi trực tiếp từ Tab Kế hoạch hoặc qua Form)
  const executeScanAndGenerate = async (
    overrideUrl?: string,
    overrideKeyword?: string
  ) => {
    const url = (overrideUrl || competitorUrl || "").trim();
    const keyword = (overrideKeyword || targetKeyword || "").trim();
    if (!url) return;

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
          competitorUrl: url,
          targetKeyword: keyword,
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
      if (data.savedPostId) {
        setEditingPostId(data.savedPostId);
      }
      // ƯU TIÊN MỞ THẲNG TAB "article" (SOẠN THẢO BÀI VIẾT) ĐỂ USER THẤY BÀI ĐÃ TẠO XONG
      setActiveResultTab("article");
      setArticlePreviewMode("edit");
      setActiveNavSection("viet_bai");

      // Reload posts table if server saved it
      if (data.isSupabaseSaved) {
        fetchPosts();
      }

      // Cuộn mượt mà đến khu vực soạn thảo AI Studio
      setTimeout(() => {
        const editorEl = document.getElementById("radar-results-editor");
        if (editorEl) editorEl.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } catch (err: any) {
      console.error("Radar error:", err);
      setErrorMsg(err.message || "Đã xảy ra lỗi khi quét bài viết đối thủ.");
    } finally {
      setIsAnalyzing(false);
      setProcessStep(0);
    }
  };

  const handleScanAndGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    await executeScanAndGenerate();
  };

  // HÀM MÁY TỰ ĐỘNG SOÁT LỖI & CHẤM ĐIỂM QA THEO 20 TIÊU CHÍ
  const runAutomatedQaReview = async (postToReview?: DatabasePost | null) => {
    const target = postToReview || reviewingPost;
    if (!target || !target.content) return;

    setIsQaRunning(true);
    try {
      const res = await fetch("/api/radar/qa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: target.content,
          title: target.title,
          keyword: target.focus_keyword || "",
        }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setQaReport(json.data);
        // Tự động đồng bộ tick các mục đạt chuẩn vào checklist
        setReviewingChecklist({
          dataChecked: json.data.summary.missingDataCount === 0,
          keywordChecked: json.data.checks.some(
            (c: any) => c.id === "Q1_SEO" && c.status === "pass"
          ),
          brandBrainChecked: json.data.checks.some(
            (c: any) => c.id === "Q12_BRAND" && c.status === "pass"
          ),
          formatChecked: json.data.checks.some(
            (c: any) => c.id === "Q15_FAQ" && c.status === "pass"
          ),
        });
      }
    } catch (err) {
      console.error("Automated QA Review error:", err);
    } finally {
      setIsQaRunning(false);
    }
  };

  // HÀM TỰ ĐỘNG SỬA TỪ CẤM V8, V9, V10
  const handleAutoFixForbiddenWords = () => {
    if (!reviewingPost) return;
    let fixedContent = reviewingPost.content;
    const replacements: Record<string, string> = {
      "đẳng cấp": "chất lượng cao",
      "hàng đầu": "chuyên sâu",
      "số 1": "uy tín",
      "top 1": "đáng tin cậy",
      "uy tín nhất": "uy tín",
      "chuyên nghiệp nhất": "chuyên nghiệp",
      "đột phá": "hiệu quả",
      "bùng nổ": "sôi nổi",
      "thăng hoa": "ấn tượng",
      "đỉnh cao": "bài bản",
      "hoàn hảo": "chu đáo",
      "tuyệt vời": "tốt đẹp",
      "siêu": "rất",
      "khủng": "quy mô lớn",
      "trong kỷ nguyên số": "Hiện nay",
      "trong thời đại ngày nay": "Hiện nay",
      "trong bối cảnh": "Hiện nay",
      "không thể phủ nhận": "Rõ ràng",
      "100%": "tối đa",
      "rẻ nhất": "hợp lý",
    };
    for (const [bad, good] of Object.entries(replacements)) {
      const reg = new RegExp(`\\b${bad}\\b`, "gi");
      fixedContent = fixedContent.replace(reg, good);
    }
    const updated = { ...reviewingPost, content: fixedContent };
    setReviewingPost(updated);
    handleDirectUpdateContent(updated);
    // Chạy lại kiểm định để thấy điểm số tăng vọt ngay
    runAutomatedQaReview(updated);
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
        let saveQuery;
        const isValidUuid =
          editingPostId &&
          !String(editingPostId).startsWith("post-") &&
          !String(editingPostId).startsWith("case-study-");

        if (isValidUuid) {
          saveQuery = supabase
            .from("posts")
            .update(payload)
            .eq("id", editingPostId);
        } else {
          saveQuery = supabase
            .from("posts")
            .upsert([payload], { onConflict: "slug" });
        }

        const { error } = await saveQuery;
        if (error) throw error;

        setSaveStatus(
          status === "published"
            ? "Đã xuất bản bài viết thành công lên trang Tin tức!"
            : status === "scheduled"
            ? `Đã lên lịch xuất bản bài viết thành công: ${scheduledTime}!`
            : "Đã lưu bản nháp vào bảng 'posts' thành công!"
        );

        if (status === "published") {
          setPostNotice({
            type: "success",
            text: `Đã xuất bản bài viết "${editablePost.title.slice(0, 45)}..." lên website thành công!`,
            slug: editablePost.slug,
          });
        }

        setEditingPostId(null);
        fetchPosts();
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
        let updateQuery;
        const isValidUuid =
          post.id &&
          !String(post.id).startsWith("post-") &&
          !String(post.id).startsWith("case-study-");

        if (isValidUuid) {
          updateQuery = supabase
            .from("posts")
            .update({ status: nextStatus })
            .eq("id", post.id);
        } else if (post.slug) {
          updateQuery = supabase
            .from("posts")
            .update({ status: nextStatus })
            .eq("slug", post.slug);
        } else {
          throw new Error("Không xác định được ID hoặc slug của bài viết.");
        }

        const { error } = await updateQuery;

        if (!error) {
          await fetchPosts();
          setPostNotice({
            type: "success",
            text:
              nextStatus === "published"
                ? `Đã duyệt và xuất bản bài viết "${post.title.slice(0, 45)}..." lên website thành công!`
                : `Đã thu hồi bài viết "${post.title.slice(0, 45)}..." về trạng thái nháp!`,
            slug: post.slug,
          });
          return;
        } else {
          console.error("Lỗi cập nhật trạng thái bài viết:", error);
          setPostNotice({
            type: "error",
            text: `Không thể cập nhật trạng thái: ${error.message}`,
            slug: null,
          });
        }
      } catch (e: any) {
        console.warn("Toggle status error:", e);
        setPostNotice({
          type: "error",
          text: `Lỗi kết nối cơ sở dữ liệu: ${e?.message || e}`,
          slug: null,
        });
      }
    }

    setPostsList(
      postsList.map((p) =>
        p.id === post.id ? { ...p, status: nextStatus } : p
      )
    );
    setPostNotice({
      type: "success",
      text:
        nextStatus === "published"
          ? `Đã duyệt đăng bài viết (chế độ demo/offline)!`
          : `Đã chuyển về bản nháp!`,
      slug: post.slug,
    });
  };

  // THAO TÁC XÓA BẢN NHÁP / BÀI VIẾT ĐƠN LẺ
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
    setSelectedPostIds((prev) => prev.filter((id) => id !== post.id));
    setSaveStatus(`Đã xóa bài viết "${post.title.slice(0, 30)}..." thành công!`);
  };

  // THAO TÁC XÓA HÀNG LOẠT (BULK DELETE)
  const handleBulkDeletePosts = async () => {
    const count = selectedPostIds.length;
    if (count === 0) return;

    const isConfirm = window.confirm(
      `⚠️ CẢNH BÁO: Bạn có chắc chắn muốn XÓA VĨNH VIỄN ${count} bài viết đã chọn không?\n\nThao tác này sẽ dọn sạch kho dữ liệu và không thể hoàn tác!`
    );
    if (!isConfirm) return;

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from("posts").delete().in("id", selectedPostIds);
        if (error) {
          console.warn("Lỗi xóa hàng loạt từ Supabase:", error);
        }
      } catch (err) {
        console.error("Bulk delete error:", err);
      }
    }

    setPostsList((prev) => prev.filter((p) => !selectedPostIds.includes(p.id)));
    setSelectedPostIds([]);
    setPostNotice({
      type: "success",
      text: `Đã xóa thành công ${count} bài viết khỏi kho dữ liệu!`,
    });
  };

  // THAO TÁC XUẤT BẢN HÀNG LOẠT (BULK PUBLISH)
  const handleBulkPublishPosts = async () => {
    const count = selectedPostIds.length;
    if (count === 0) return;

    const isConfirm = window.confirm(
      `Bạn có muốn XUẤT BẢN NHANH ${count} bài viết đã chọn lên website ngay bây giờ?`
    );
    if (!isConfirm) return;

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from("posts")
          .update({ status: "published" })
          .in("id", selectedPostIds);
        if (error) {
          console.warn("Lỗi xuất bản hàng loạt từ Supabase:", error);
        }
      } catch (err) {
        console.error("Bulk publish error:", err);
      }
    }

    setPostsList((prev) =>
      prev.map((p) => (selectedPostIds.includes(p.id) ? { ...p, status: "published" } : p))
    );
    setSelectedPostIds([]);
    setPostNotice({
      type: "success",
      text: `Đã xuất bản thành công ${count} bài viết lên website!`,
    });
  };

  return (
    <div className="min-h-screen bg-slate-100/90 text-slate-900 font-sans flex flex-col lg:flex-row">
      {/* THANH CÔNG CỤ DỌC BÊN TRÁI (LEFT SIDEBAR DOCK) */}
      <RadarSidebar
        activeSection={activeNavSection}
        onSelectSection={(section) => {
          setActiveNavSection(section);
          if (section === "duyet_bai" || section === "posts") {
            setActiveAdminTab("posts");
          } else if (section === "bo_nao" || section === "events") {
            setActiveAdminTab("events");
          } else if (section === "doi_thu" || section === "competitors") {
            setActiveAdminTab("competitors");
          } else if (
            section === "ke_hoach" ||
            section === "content_gap" ||
            section === "cron"
          ) {
            setActiveAdminTab("content_gap");
          } else if (section === "logs") {
            setActiveAdminTab("activity_logs");
          }
        }}
        currentPostStatusFilter={statusFilter}
        onSelectPostStatusFilter={(status) => {
          setActiveNavSection("duyet_bai");
          setActiveAdminTab("posts");
          setStatusFilter(status);
        }}
        counts={{
          posts: postsList.length,
          drafts: draftCount,
          published: publishedCount,
          competitors: trackedCompetitors.length,
          gaps: contentGaps.length,
          events: eventProfilesCount,
          logs: radarLogs.length,
        }}
        hasActiveEditor={Boolean(editablePost || analysisResult)}
        activeEditorTitle={editablePost?.title}
        isScanning={isScanningDomain || isBatchRunning || isAnalyzing}
        isSupabaseConfigured={isSupabaseConfigured}
        onRefreshAll={() => {
          fetchPosts();
          refreshRadarStats();
          if (typeof window !== "undefined") {
            setEventProfilesCount(getStoredEventProfiles().length);
          }
        }}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* KHÔNG GIAN LÀM VIỆC CHÍNH (MAIN WORKSPACE) */}
      <main className="flex-1 min-w-0 bg-slate-100/80 min-h-screen p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
        {/* HEADER TRÊN CÙNG CỦA WORKSPACE */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-200 gap-4">
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2.5 rounded-xl bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 shrink-0 cursor-pointer shadow-xs"
              title="Mở thanh công cụ"
            >
              <Menu className="w-5 h-5 text-amber-600" />
            </button>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {(activeNavSection === "viet_bai" ||
                    activeNavSection === "scanner" ||
                    activeNavSection === "editor") &&
                    "1. Viết Bài & Sáng Tạo Nội Dung AI"}
                  {(activeNavSection === "duyet_bai" ||
                    activeNavSection === "posts") &&
                    "2. Kho Bài Viết & Duyệt Bài (QA)"}
                  {(activeNavSection === "bo_nao" ||
                    activeNavSection === "events") &&
                    "3. Bộ Não Thương Hiệu (Brand Brain)"}
                  {(activeNavSection === "doi_thu" ||
                    activeNavSection === "competitors") &&
                    "4. Quản Lý Danh Sách Đối Thủ"}
                  {(activeNavSection === "ke_hoach" ||
                    activeNavSection === "content_gap" ||
                    activeNavSection === "cron") &&
                    "5. Kế Hoạch Nội Dung & Khoảng Trống SEO"}
                  {activeNavSection === "logs" && "Nhật Ký Hoạt Động Ca Quét AI"}
                  {activeNavSection === "top_google" && "0. Top Google: Từ Khóa, Đối Thủ Đang Top & Cào Bài"}
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#D4AF37] text-[#0A1E5E]">
                  AI v2.0
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {(activeNavSection === "viet_bai" ||
                  activeNavSection === "scanner" ||
                  activeNavSection === "editor") &&
                  "Chỉ tập trung vào tạo bài viết: Nhập từ khóa, quét đối thủ, bóc tách cấu trúc và AI Studio tạo nháp."}
                {(activeNavSection === "duyet_bai" ||
                  activeNavSection === "posts") &&
                  "Nơi người duyệt đọc, kiểm tra các vị trí [CẦN SỐ LIỆU], tick checklist QA rồi mới xuất bản lên web."}
                {(activeNavSection === "bo_nao" ||
                  activeNavSection === "events") &&
                  "Kho dữ liệu độc quyền của công ty: Hồ sơ dự án thật, danh mục thiết bị sẵn kho, quy tắc giọng văn."}
                {(activeNavSection === "doi_thu" ||
                  activeNavSection === "competitors") &&
                  "Máy tự tìm hoặc người thêm đối thủ, quét sitemap và tự động cào bài viết mới."}
                {(activeNavSection === "ke_hoach" ||
                  activeNavSection === "content_gap" ||
                  activeNavSection === "cron") &&
                  "Ma trận khoảng trống nội dung từ ca quét 02:30 sáng, gom cụm đề bài và lên lịch viết bài."}
                {activeNavSection === "logs" &&
                  "Lịch sử chi tiết toàn bộ các lượt cào bài, phân tích và lưu trữ bài viết."}
                {activeNavSection === "top_google" &&
                  "Bước đầu của dây chuyền: biết ai đang đứng top Google cho từng từ khóa và họ viết gì."}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2.5 text-xs self-end sm:self-auto shrink-0">
            <button
              type="button"
              onClick={() => {
                fetchPosts();
                refreshRadarStats();
                if (typeof window !== "undefined") {
                  setEventProfilesCount(getStoredEventProfiles().length);
                }
              }}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold flex items-center space-x-1.5 transition-colors border border-slate-300 shadow-xs cursor-pointer"
              title="Làm mới dữ liệu"
            >
              <RefreshCw className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline">Làm mới</span>
            </button>

            <Link
              href="/tin-tuc"
              target="_blank"
              className="px-3.5 py-1.5 rounded-xl bg-[#D4AF37] hover:bg-amber-400 text-[#0A1E5E] font-bold flex items-center space-x-1 transition-all shadow-xs"
            >
              <span>Xem Blog</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* MODAL HẸN LỊCH ĐĂNG BÀI TOÀN CỤC */}
        {showScheduleModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
              <div className="flex items-center space-x-2 text-slate-900">
                <Calendar className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-base">Hẹn lịch đăng bài tự động</h3>
              </div>

              <p className="text-xs text-slate-600">
                Chọn ngày và giờ bạn muốn bài viết này tự động được xuất bản lên chuyên mục Tin tức & Cẩm nang:
              </p>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Thời gian xuất bản dự kiến:
                </label>
                <input
                  type="datetime-local"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  disabled={!scheduledTime}
                  onClick={() => handleSaveToSupabase("scheduled")}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-amber-500 text-[#0A1E5E] text-xs font-bold hover:brightness-105 disabled:opacity-50 cursor-pointer shadow-sm"
                >
                  Xác nhận hẹn lịch
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MỤC 1: VIẾT BÀI (DÒNG CHẢY LIỀN MẠCH) */}
        {(activeNavSection === "viet_bai" ||
          activeNavSection === "scanner" ||
          activeNavSection === "editor") && (
          <div className="space-y-6">
            {!(editablePost || analysisResult) ? (
              /* KHI CHƯA MỞ BÀI: HIỆN THẲNG FORM NHẬP TỪ KHÓA / CÀO SITEMAP ĐỂ VIẾT BÀI */
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm relative">
                  <div className="space-y-6">
                    {/* HEADER WORKSPACE & MODE SWITCHER */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#D4AF37] to-amber-600 p-0.5 shrink-0 flex items-center justify-center shadow-xs">
                          <div className="w-full h-full bg-[#0A1E5E] rounded-[9px] flex items-center justify-center">
                            <Search className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-wide">
                    {scanMode === "domain"
                      ? "Dò Tìm & Bóc Tách Bài Viết Từ Website Đối Thủ"
                      : "Bóc Tách & Tái Tạo 1 Bài Viết Cụ Thể"}
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    {scanMode === "domain"
                      ? "Tự động phân giải XML Sitemap để bóc tách danh sách bài viết dịch vụ & blog mới nhất"
                      : "Cào sâu cấu trúc H1-H3 qua Jina, phát hiện khoảng trống nội dung và tái tạo bài chuẩn SEO"}
                  </p>
                </div>
              </div>

              {/* Mode Switcher Buttons */}
              <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 self-start sm:self-auto shrink-0">
                <button
                  type="button"
                  onClick={() => setScanMode("domain")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                    scanMode === "domain"
                      ? "bg-gradient-to-r from-[#D4AF37] to-amber-500 text-[#0A1E5E] shadow-sm font-black"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Quét Domain / Sitemap</span>
                  <span className="px-1.5 py-0.5 text-[9px] uppercase tracking-wider rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold">
                    Khuyên dùng
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setScanMode("single")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                    scanMode === "single"
                      ? "bg-gradient-to-r from-[#D4AF37] to-amber-500 text-[#0A1E5E] shadow-sm font-black"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Bóc tách 1 Link bài viết</span>
                </button>
              </div>
            </div>

            {/* =====================================================================
                CHẾ ĐỘ QUÉT THEO DOMAIN / SITEMAP
            ===================================================================== */}
            {scanMode === "domain" && (
              <div className="space-y-6">
                {/* Domain Input Form */}
                <form onSubmit={handleScanDomain} className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <label className="block text-xs font-semibold text-slate-700">
                        Nhập tên miền đối thủ hoặc bấm chọn nhanh từ danh bạ 9 đối thủ mẫu <span className="text-amber-600">*</span>
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
                          className="text-[11px] font-semibold text-amber-600 hover:underline flex items-center space-x-1 cursor-pointer"
                        >
                          <span>⭐ Lưu domain này vào danh bạ riêng</span>
                        </button>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center">
                      <div className="relative flex-1">
                        <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                        <input
                          type="text"
                          placeholder="VD: viet-power.vn hoặc https://viet-power.vn"
                          value={domainInput}
                          onChange={(e) => setDomainInput(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition"
                        />
                      </div>

                      {/* NÚT DROPDOWN GỌN: CHỌN ĐỐI THỦ MẪU */}
                      <CompetitorDropdown
                        currentDomain={domainInput}
                        onSelectCompetitor={handleSelectCompetitorPreset}
                        isScanning={isScanningDomain}
                      />

                      <button
                        type="submit"
                        disabled={isScanningDomain || !domainInput.trim()}
                        className="px-6 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-[#D4AF37] via-amber-400 to-[#D4AF37] text-[#0A1E5E] shadow-sm hover:scale-[1.02] transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer shrink-0"
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

                    {/* DÒNG GỢI Ý QUÉT NHANH DẠNG PILL (GỌN GÀNG, KHÔNG RỐI) */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
                      <span className="text-[11px] text-slate-500 font-medium flex items-center mr-1">
                        <Zap className="w-3 h-3 text-amber-600 mr-1" /> Gợi ý nhanh:
                      </span>
                      {DEFAULT_COMPETITOR_PRESETS.slice(0, 4).map((comp) => (
                        <button
                          key={comp.id}
                          type="button"
                          onClick={() => handleSelectCompetitorPreset(comp, true)}
                          title={`Bấm để quét sitemap ${comp.name}`}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-amber-50 text-slate-700 hover:text-amber-900 border border-slate-200 hover:border-amber-300 text-[11px] font-medium transition cursor-pointer flex items-center space-x-1"
                        >
                          <span>{comp.name}</span>
                          <span className="text-[9px] text-slate-500 font-mono">({comp.domain.replace(/^https?:\/\//, "")})</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </form>

                {/* Batch Progress Bar khi đang chạy Radar hàng loạt */}
                {isBatchRunning && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/80 border border-amber-300 space-y-3 animate-in fade-in shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div className="flex items-center space-x-2 font-bold text-amber-800">
                        <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
                        <span>Đang chạy Radar tự động: Bài {batchProgress.current} / {batchProgress.total}</span>
                      </div>
                      <div className="text-[11px] text-slate-600 truncate max-w-md">
                        Đang xử lý: <span className="font-semibold text-slate-900">{batchProgress.currentTitle}</span>
                      </div>
                    </div>

                    {/* Progress Track */}
                    <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden relative">
                      <div
                        className="h-full bg-gradient-to-r from-[#D4AF37] to-emerald-500 transition-all duration-500 rounded-full"
                        style={{
                          width: `${Math.round((batchProgress.current / (batchProgress.total || 1)) * 100)}%`,
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>Tiến độ: {Math.round((batchProgress.current / (batchProgress.total || 1)) * 100)}%</span>
                      <div className="flex items-center space-x-3">
                        <span className="text-emerald-700 font-medium">✓ Thành công: {batchProgress.successCount}</span>
                        {batchProgress.errorCount > 0 && (
                          <span className="text-rose-600 font-medium">✕ Lỗi: {batchProgress.errorCount}</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* IDLE STATE: KHI CHƯA THỰC HIỆN QUÉT SITEMAP (BẢNG ĐIỀU HÀNH THỰC TẾ) */}
                {!scannedResult && !isScanningDomain && (
                  <div className="pt-4 border-t border-slate-200 space-y-4 animate-in fade-in duration-300">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center space-x-2 text-xs font-bold text-slate-900">
                        <Activity className="w-4 h-4 text-amber-600" />
                        <span>Tổng quan dữ liệu Radar SEO đang vận hành</span>
                      </div>
                      <div className="flex items-center space-x-3 text-[11px] text-slate-500">
                        <span>🎯 <strong>9</strong> đối thủ mục tiêu</span>
                        <span>•</span>
                        <span>📑 <strong>{postsList.length}</strong> bài viết trong kho</span>
                        <span>•</span>
                        <span className="text-emerald-600 font-medium">● Sẵn sàng dò sitemap</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                      {/* CỘT TRÁI (7 COLS): BÀI VIẾT GẦN ĐÂY TRONG KHO */}
                      <div className="lg:col-span-7 p-4 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                            <FileText className="w-3.5 h-3.5 text-amber-600" />
                            <span>Bài viết gần đây trong Kho SEO</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => setActiveNavSection("posts")}
                            className="text-[11px] text-amber-700 hover:underline flex items-center space-x-1 cursor-pointer font-bold"
                          >
                            <span>Xem tất cả ({postsList.length})</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="space-y-2">
                          {postsList.slice(0, 3).map((post) => (
                            <div
                              key={post.id}
                              className="p-2.5 rounded-xl bg-white hover:bg-slate-100/90 border border-slate-200 transition flex items-center justify-between gap-3 group shadow-2xs"
                            >
                              <div className="min-w-0 flex-1">
                                <h4 className="text-xs font-bold text-slate-900 group-hover:text-amber-800 truncate transition-colors">
                                  {post.title}
                                </h4>
                                <div className="flex items-center space-x-2 text-[10px] text-slate-500 mt-1">
                                  <span className={`px-1.5 py-0.2 rounded font-semibold ${
                                    post.status === "published"
                                      ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                      : "bg-amber-100 text-amber-800 border border-amber-200"
                                  }`}>
                                    {post.status === "published" ? "Đã xuất bản" : "Bản nháp"}
                                  </span>
                                  {post.focus_keyword && (
                                    <span className="truncate">Từ khóa: <strong className="text-slate-700">{post.focus_keyword}</strong></span>
                                  )}
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleStartEditPost(post)}
                                className="px-2.5 py-1.5 rounded-lg bg-[#D4AF37]/20 hover:bg-[#D4AF37] text-[#0A1E5E] text-xs font-bold transition flex items-center space-x-1 shrink-0 cursor-pointer shadow-2xs"
                              >
                                <Edit3 className="w-3 h-3" />
                                <span>Mở sửa</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* CỘT PHẢI (5 COLS): TOP ĐỐI THỦ MỤC TIÊU */}
                      <div className="lg:col-span-5 p-4 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                            <Globe className="w-3.5 h-3.5 text-amber-600" />
                            <span>Top đối thủ mục tiêu</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => setActiveNavSection("competitors")}
                            className="text-[11px] text-amber-700 hover:underline flex items-center space-x-1 cursor-pointer font-bold"
                          >
                            <span>Danh bạ 9 đối thủ</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="space-y-2">
                          {DEFAULT_COMPETITOR_PRESETS.slice(0, 3).map((comp) => (
                            <div
                              key={comp.id}
                              className="p-2.5 rounded-xl bg-white hover:bg-slate-100/90 border border-slate-200 transition flex items-center justify-between gap-2 shadow-2xs"
                            >
                              <div className="min-w-0 flex-1">
                                <span className="text-xs font-bold text-slate-900 block truncate">
                                  {comp.name}
                                </span>
                                <span className="text-[10px] text-slate-500 font-mono block truncate">
                                  {comp.domain.replace(/^https?:\/\//, "")}
                                </span>
                              </div>

                              <button
                                type="button"
                                onClick={() => {
                                  if (scanMode !== "domain") setScanMode("domain");
                                  handleSelectCompetitorPreset(comp, true);
                                }}
                                className="px-2 py-1 rounded-lg bg-[#D4AF37]/20 hover:bg-[#D4AF37] text-[#0A1E5E] text-[11px] font-bold border border-[#D4AF37]/40 transition flex items-center space-x-1 shrink-0 cursor-pointer shadow-2xs"
                              >
                                <Zap className="w-3 h-3 fill-current" />
                                <span>Quét</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* KẾT QUẢ QUÉT SITEMAP & DANH SÁCH BÀI VIẾT */}
                {scannedResult && (
                  <div className="space-y-4 pt-2 border-t border-slate-200 animate-in fade-in">
                    {/* =========================================================
                        BATCH ACTION BAR: THANH CÔNG CỤ CHẠY HÀNG LOẠT TRÊN CÙNG
                    ========================================================= */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs space-y-4">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                            <h3 className="text-sm font-bold text-slate-900 tracking-wide">
                              Tìm thấy {scannedResult.totalFound} bài viết chi tiết từ {scannedResult.domain}
                            </h3>
                          </div>
                          <p className="text-xs text-slate-500">
                            {scannedResult.sitemapFound
                              ? `Nguồn: ${scannedResult.sitemapFound}`
                              : "Đã lọc qua Recursive Sitemap & Category Crawler"} •{" "}
                            <span className="text-emerald-700 font-bold">{scannedResult.unscrapedCount} bài mới</span> chưa cào •{" "}
                            Đã chọn <span className="text-amber-700 font-extrabold text-sm">{selectedUrls.length}</span> / {scannedResult.totalFound} bài
                          </p>
                        </div>

                        {/* NÚT LỚN NỔI BẬT: CHẠY RADAR HÀNG LOẠT */}
                        <div className="flex flex-wrap items-center gap-2.5">
                          <button
                            type="button"
                            disabled={isBatchRunning || selectedUrls.length === 0}
                            onClick={handleRunBatchRadar}
                            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] via-amber-400 to-[#D4AF37] hover:brightness-105 text-[#0A1E5E] font-black text-xs shadow-md shadow-amber-500/20 flex items-center justify-center space-x-2.5 disabled:opacity-40 cursor-pointer transition-all transform hover:scale-[1.02] active:scale-[0.98]"
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
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200 text-xs">
                        {/* Checkbox Chọn tất cả */}
                        <div className="flex items-center space-x-3">
                          <label className="flex items-center space-x-2 cursor-pointer font-semibold text-slate-700 hover:text-slate-900 select-none">
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
                              className="w-4 h-4 rounded text-amber-600 bg-white border-slate-300 focus:ring-amber-500 cursor-pointer"
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
                            className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 text-[11px] border border-slate-200 transition cursor-pointer"
                          >
                            Chỉ chọn bài chưa cào ({scannedResult.unscrapedCount})
                          </button>
                        </div>

                        {/* Bộ lọc hiển thị (Tất cả vs Chỉ bài chưa cào) */}
                        <div className="flex items-center space-x-1.5">
                          <span className="text-slate-500 font-medium flex items-center mr-1">
                            <ListFilter className="w-3.5 h-3.5 mr-1 text-slate-400" /> Xem:
                          </span>
                          <button
                            type="button"
                            onClick={() => setDomainFilter("all")}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                              domainFilter === "all"
                                ? "bg-amber-500 text-slate-900 font-bold shadow-xs"
                                : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
                            }`}
                          >
                            Tất cả ({scannedResult.totalFound})
                          </button>
                          <button
                            type="button"
                            onClick={() => setDomainFilter("unscraped")}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                              domainFilter === "unscraped"
                                ? "bg-emerald-600 text-white font-bold shadow-xs"
                                : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
                            }`}
                          >
                            Chưa cào ({scannedResult.unscrapedCount})
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* DANH SÁCH BÀI VIẾT VỚI TRẠNG THÁI TIẾN TRÌNH THỜI GIAN THỰC */}
                    <div className="max-h-[460px] overflow-y-auto space-y-2 pr-1 rounded-2xl border border-slate-200 p-2.5 bg-slate-50/60">
                      {scannedResult.urls
                        .filter((item) => domainFilter === "all" || !item.isScraped)
                        .map((item, idx) => {
                          const isSelected = selectedUrls.includes(item.url);
                          return (
                            <div
                              key={item.url}
                              className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                                item.status === "scraping"
                                  ? "bg-sky-50 border-sky-300 ring-1 ring-sky-300"
                                  : item.status === "generating"
                                  ? "bg-amber-50 border-amber-300 ring-1 ring-amber-300"
                                  : item.status === "waiting"
                                  ? "bg-slate-100 border-slate-200 opacity-80"
                                  : item.status === "success"
                                  ? "bg-emerald-50 border-emerald-300"
                                  : isSelected
                                  ? "bg-amber-50/60 border-amber-300"
                                  : "bg-white border-slate-200 hover:bg-slate-50"
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
                                  className="mt-1 w-4 h-4 rounded text-amber-600 bg-white border-slate-300 focus:ring-amber-500 cursor-pointer"
                                />
                                <div className="min-w-0 flex-1 space-y-0.5">
                                  <label
                                    htmlFor={`checkbox-${idx}`}
                                    className="text-xs font-semibold text-slate-900 block truncate cursor-pointer hover:text-amber-700 transition"
                                    title={item.title}
                                  >
                                    {item.title}
                                  </label>
                                  <a
                                    href={item.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[11px] text-slate-500 hover:text-slate-700 truncate flex items-center space-x-1"
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
                                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center space-x-1.5">
                                    <Clock className="w-3 h-3 text-amber-600" />
                                    <span>Chờ xử lý...</span>
                                  </span>
                                ) : item.status === "scraping" ? (
                                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-sky-50 text-sky-800 border border-sky-200 flex items-center space-x-1.5 animate-pulse">
                                    <Loader2 className="w-3 h-3 animate-spin text-sky-600" />
                                    <span>Đang cào & phân tích</span>
                                  </span>
                                ) : item.status === "generating" ? (
                                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center space-x-1.5 animate-pulse">
                                    <Sparkles className="w-3 h-3 animate-spin text-amber-600" />
                                    <span>Đang sinh bài (AI)</span>
                                  </span>
                                ) : item.status === "success" ? (
                                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center space-x-1.5 shadow-2xs">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                    <span>Hoàn thành (Đã lưu nháp)</span>
                                  </span>
                                ) : item.status === "error" ? (
                                  <span
                                    className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-rose-800 border border-rose-200 flex items-center space-x-1.5"
                                    title={item.error}
                                  >
                                    <AlertCircle className="w-3 h-3 text-rose-600" />
                                    <span>Lỗi xử lý</span>
                                  </span>
                                ) : item.isScraped ? (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                                    Đã cào trước đó
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
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
                                    className="px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-[11px] font-bold border border-emerald-200 transition cursor-pointer flex items-center space-x-1"
                                    title="Xem bản nháp đã lưu trong Database"
                                  >
                                    <span>Xem nháp</span>
                                    <Eye className="w-3 h-3" />
                                  </button>
                                ) : item.status === "scraping" || item.status === "generating" ? (
                                  <span className="text-[11px] text-amber-700 italic px-2 py-1">
                                    Đang xử lý ngầm...
                                  </span>
                                ) : (
                                  <button
                                    type="button"
                                    disabled={isBatchRunning || isAnalyzing}
                                    onClick={() => handleRunSingleInPlace(item.url, item.title)}
                                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 border border-slate-200 text-[11px] font-medium transition cursor-pointer flex items-center space-x-1"
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
                CHẾ ĐỘ BÓC TÁCH 1 BÀI VIẾT ĐƠN LẺ TỪ URL
            ===================================================================== */}
            {scanMode === "single" && (
              <div className="space-y-6">
                <form onSubmit={handleScanAndGenerate} className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    {/* URL Input */}
                    <div className="lg:col-span-7">
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        URL bài viết đối thủ cạnh tranh (URL mẫu) <span className="text-amber-600">*</span>
                      </label>
                      <div className="relative">
                        <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                        <input
                          type="url"
                          placeholder="https://doithu.com/bai-viet-to-chuc-su-kien"
                          value={competitorUrl}
                          onChange={(e) => setCompetitorUrl(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition"
                        />
                      </div>
                    </div>

                    {/* Target Keyword */}
                    <div className="lg:col-span-5">
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Từ khóa mục tiêu (Focus keyword)
                      </label>
                      <input
                        type="text"
                        placeholder="VD: tổ chức lễ khánh thành nhà máy"
                        value={targetKeyword}
                        onChange={(e) => setTargetKeyword(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition"
                      />
                    </div>
                  </div>

                  {/* DÒNG GỢI Ý MẪU THỬ NGHIỆM */}
                  <div className="flex flex-wrap items-center gap-1.5 text-xs">
                    <span className="text-[11px] text-slate-500 font-medium flex items-center mr-1">
                      <Sparkles className="w-3 h-3 text-amber-600 mr-1" /> Thử nghiệm mẫu:
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setCompetitorUrl("https://viet-power.vn/to-chuc-teambuilding-bai-bien");
                        setTargetKeyword("tổ chức teambuilding bãi biển");
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-amber-50 text-slate-700 hover:text-amber-900 border border-slate-200 hover:border-amber-300 text-[11px] font-medium transition cursor-pointer"
                    >
                      🏃 Teambuilding bãi biển (Viet Power)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCompetitorUrl("https://sukienachau.com/to-chuc-le-khai-truong");
                        setTargetKeyword("tổ chức lễ khai trương trọn gói");
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-amber-50 text-slate-700 hover:text-amber-900 border border-slate-200 hover:border-amber-300 text-[11px] font-medium transition cursor-pointer"
                    >
                      🎪 Lễ khai trương trọn gói (Á Châu)
                    </button>
                  </div>

                  {/* Submit CTA */}
                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={isAnalyzing || !competitorUrl.trim()}
                      className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-[#D4AF37] via-amber-400 to-[#D4AF37] text-[#0A1E5E] shadow-sm hover:scale-[1.02] transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
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

                {/* Dashboard vận hành khi chưa bấm phân tích */}
                {!isAnalyzing && (
                  <div className="pt-4 border-t border-slate-200 space-y-4 animate-in fade-in duration-300">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center space-x-2 text-xs font-bold text-slate-900">
                        <Activity className="w-4 h-4 text-amber-600" />
                        <span>Tổng quan dữ liệu Radar SEO đang vận hành</span>
                      </div>
                      <div className="flex items-center space-x-3 text-[11px] text-slate-500">
                        <span>🎯 <strong>9</strong> đối thủ mục tiêu</span>
                        <span>•</span>
                        <span>📑 <strong>{postsList.length}</strong> bài viết trong kho</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                      {/* CỘT TRÁI (7 COLS): BÀI VIẾT GẦN ĐÂY */}
                      <div className="lg:col-span-7 p-4 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                            <FileText className="w-3.5 h-3.5 text-amber-600" />
                            <span>Bài viết gần đây trong Kho SEO</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => setActiveNavSection("posts")}
                            className="text-[11px] text-amber-700 hover:underline flex items-center space-x-1 cursor-pointer font-bold"
                          >
                            <span>Xem tất cả ({postsList.length})</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="space-y-2">
                          {postsList.slice(0, 3).map((post) => (
                            <div
                              key={post.id}
                              className="p-2.5 rounded-xl bg-white hover:bg-slate-100/90 border border-slate-200 transition flex items-center justify-between gap-3 group shadow-2xs"
                            >
                              <div className="min-w-0 flex-1">
                                <h4 className="text-xs font-bold text-slate-900 group-hover:text-amber-800 truncate transition-colors">
                                  {post.title}
                                </h4>
                                <div className="flex items-center space-x-2 text-[10px] text-slate-500 mt-1">
                                  <span className={`px-1.5 py-0.2 rounded font-semibold ${
                                    post.status === "published"
                                      ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                      : "bg-amber-100 text-amber-800 border border-amber-200"
                                  }`}>
                                    {post.status === "published" ? "Đã xuất bản" : "Bản nháp"}
                                  </span>
                                  {post.focus_keyword && (
                                    <span className="truncate">Từ khóa: <strong className="text-slate-700">{post.focus_keyword}</strong></span>
                                  )}
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleStartEditPost(post)}
                                className="px-2.5 py-1.5 rounded-lg bg-[#D4AF37]/20 hover:bg-[#D4AF37] text-[#0A1E5E] text-xs font-bold transition flex items-center space-x-1 shrink-0 cursor-pointer shadow-2xs"
                              >
                                <Edit3 className="w-3 h-3" />
                                <span>Mở sửa</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* CỘT PHẢI (5 COLS): TOP ĐỐI THỦ MỤC TIÊU */}
                      <div className="lg:col-span-5 p-4 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                            <Globe className="w-3.5 h-3.5 text-amber-600" />
                            <span>Top đối thủ mục tiêu</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => setActiveNavSection("competitors")}
                            className="text-[11px] text-amber-700 hover:underline flex items-center space-x-1 cursor-pointer font-bold"
                          >
                            <span>Danh bạ 9 đối thủ</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="space-y-2">
                          {DEFAULT_COMPETITOR_PRESETS.slice(0, 3).map((comp) => (
                            <div
                              key={comp.id}
                              className="p-2.5 rounded-xl bg-white hover:bg-slate-100/90 border border-slate-200 transition flex items-center justify-between gap-2 shadow-2xs"
                            >
                              <div className="min-w-0 flex-1">
                                <span className="text-xs font-bold text-slate-900 block truncate">
                                  {comp.name}
                                </span>
                                <span className="text-[10px] text-slate-500 font-mono block truncate">
                                  {comp.domain.replace(/^https?:\/\//, "")}
                                </span>
                              </div>

                              <button
                                type="button"
                                onClick={() => {
                                  setScanMode("domain");
                                  handleSelectCompetitorPreset(comp, true);
                                }}
                                className="px-2 py-1 rounded-lg bg-[#D4AF37]/20 hover:bg-[#D4AF37] text-[#0A1E5E] text-[11px] font-bold border border-[#D4AF37]/40 transition flex items-center space-x-1 shrink-0 cursor-pointer shadow-2xs"
                              >
                                <Zap className="w-3 h-3 fill-current" />
                                <span>Quét</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Visual Step Progress Indicator chuẩn Skill System Content v2.4.5 (13 Bước Workflow Tự Động) */}
            {isAnalyzing && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 animate-in fade-in duration-300 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-amber-800 flex items-center">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin mr-2 text-amber-600" />
                    Skill System Content v2.4.5 — 13 Bước Workflow Tự Động:
                  </div>
                  <span className="text-[10px] text-emerald-700 font-mono bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200 font-bold">
                    Bước {processStep}/6: Đang thực thi
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
                  <div
                    className={`p-2 rounded-xl border flex items-center space-x-1.5 transition-all ${
                      processStep > 1
                        ? "bg-emerald-50 border-emerald-300 text-emerald-800 font-medium"
                        : processStep === 1
                        ? "bg-amber-100 border-amber-400 text-amber-900 font-bold shadow-2xs"
                        : "bg-white border-slate-200 text-slate-400"
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-black/10 flex items-center justify-center text-[10px] font-bold shrink-0">
                      1
                    </span>
                    <span className="truncate text-[11px]">Intent & SERP</span>
                  </div>

                  <div
                    className={`p-2 rounded-xl border flex items-center space-x-1.5 transition-all ${
                      processStep > 2
                        ? "bg-emerald-50 border-emerald-300 text-emerald-800 font-medium"
                        : processStep === 2
                        ? "bg-amber-100 border-amber-400 text-amber-900 font-bold shadow-2xs"
                        : "bg-white border-slate-200 text-slate-400"
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-black/10 flex items-center justify-center text-[10px] font-bold shrink-0">
                      2
                    </span>
                    <span className="truncate text-[11px]">Gap Analysis</span>
                  </div>

                  <div
                    className={`p-2 rounded-xl border flex items-center space-x-1.5 transition-all ${
                      processStep > 3
                        ? "bg-emerald-50 border-emerald-300 text-emerald-800 font-medium"
                        : processStep === 3
                        ? "bg-amber-100 border-amber-400 text-amber-900 font-bold shadow-2xs ring-1 ring-amber-400"
                        : "bg-white border-slate-200 text-slate-400"
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-black/10 flex items-center justify-center text-[10px] font-bold shrink-0">
                      3
                    </span>
                    <span className="truncate text-[11px] font-medium text-amber-800">Outline Planning</span>
                  </div>

                  <div
                    className={`p-2 rounded-xl border flex items-center space-x-1.5 transition-all ${
                      processStep > 4
                        ? "bg-emerald-50 border-emerald-300 text-emerald-800 font-medium"
                        : processStep === 4
                        ? "bg-amber-100 border-amber-400 text-amber-900 font-bold shadow-2xs"
                        : "bg-white border-slate-200 text-slate-400"
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-black/10 flex items-center justify-center text-[10px] font-bold shrink-0">
                      4
                    </span>
                    <span className="truncate text-[11px]">Specificity Deep</span>
                  </div>

                  <div
                    className={`p-2 rounded-xl border flex items-center space-x-1.5 transition-all ${
                      processStep > 5
                        ? "bg-emerald-50 border-emerald-300 text-emerald-800 font-medium"
                        : processStep === 5
                        ? "bg-amber-100 border-amber-400 text-amber-900 font-bold shadow-2xs"
                        : "bg-white border-slate-200 text-slate-400"
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-black/10 flex items-center justify-center text-[10px] font-bold shrink-0">
                      5
                    </span>
                    <span className="truncate text-[11px]">Extractability & AI</span>
                  </div>

                  <div
                    className={`p-2 rounded-xl border flex items-center space-x-1.5 transition-all ${
                      processStep === 6
                        ? "bg-emerald-100 border-emerald-400 text-emerald-900 font-bold shadow-2xs"
                        : "bg-white border-slate-200 text-slate-400"
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-black/10 flex items-center justify-center text-[10px] font-bold shrink-0">
                      6
                    </span>
                    <span className="truncate text-[11px]">QA & Final Output</span>
                  </div>
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center shadow-xs">
                <AlertCircle className="w-4 h-4 mr-2 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>
        </div>
              </div>
            ) : (
              /* KHI CÓ BÀI VIẾT ĐANG MỞ HOẶC VỪA TẠO XONG: HIỂN THỊ TRỰC TIẾP TRÌNH SOẠN THẢO */
              <div className="space-y-6">
                {/* Thanh trạng thái bài viết đang mở kèm nút "+ Viết bài mới khác" */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-amber-50/80 border border-amber-300 text-xs gap-3 shadow-xs animate-in fade-in">
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                    <div className="min-w-0">
                      <p className="font-bold text-amber-950 truncate text-xs">
                        Đang soạn bài: <strong className="font-black text-slate-900">{editablePost?.title || "Bản thảo AI"}</strong>
                      </p>
                      <p className="text-[11px] text-amber-800">
                        {editingPostId ? "Đang cập nhật bài viết từ Database" : "Bản thảo AI vừa phân tích & tạo ra"}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setEditablePost(null);
                      setAnalysisResult(null);
                      setEditingPostId(null);
                      setSaveStatus(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold border border-slate-300 transition-all flex items-center space-x-1.5 shrink-0 cursor-pointer shadow-xs self-start sm:self-auto"
                  >
                    <Plus className="w-3.5 h-3.5 text-amber-600" />
                    <span>+ Viết bài mới khác</span>
                  </button>
                </div>

                <div id="radar-results-editor" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            {editingPostId && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-800 text-xs gap-2 animate-in fade-in">
                <span className="font-semibold flex items-center">
                  <Edit3 className="w-4 h-4 mr-2 text-amber-600" />
                  Đang ở chế độ chỉnh sửa bài viết đã có trong Database
                </span>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-3 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 font-medium border border-slate-200 transition-all w-fit cursor-pointer shadow-2xs"
                >
                  ✕ Hủy chỉnh sửa
                </button>
              </div>
            )}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
              {/* Tab Selector: Analysis Tab is clear & primary */}
              <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200">
                <button
                  type="button"
                  onClick={() => setActiveResultTab("analysis")}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
                    activeResultTab === "analysis"
                      ? "bg-amber-500 text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>1. Báo cáo phân tích đối thủ và lỗ hổng</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveResultTab("article")}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
                    activeResultTab === "article"
                      ? "bg-amber-500 text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
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
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 font-bold flex items-center space-x-1.5 transition-all cursor-pointer shadow-2xs"
                  title="Lưu bản nháp"
                >
                  <Save className="w-3.5 h-3.5 text-amber-600" />
                  <span>Lưu nháp</span>
                </button>

                {/* Nút Hẹn Lịch Đăng Bài */}
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold flex items-center space-x-1.5 transition-all cursor-pointer shadow-2xs"
                  title="Hẹn giờ đăng bài tự động"
                >
                  <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Hẹn lịch đăng</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSaveToSupabase("published")}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-amber-500 hover:brightness-105 text-[#0A1E5E] font-black flex items-center space-x-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-[#0A1E5E]" />
                  <span>Xuất bản ngay</span>
                </button>
              </div>
            </div>

            {saveStatus && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center shadow-xs">
                <CheckCircle2 className="w-4 h-4 mr-2 shrink-0 text-emerald-600" />
                <span>{saveStatus}</span>
              </div>
            )}

            {/* TAB 1: BÁO CÁO PHÂN TÍCH ĐỐI THỦ CHUYÊN SÂU */}
            {activeResultTab === "analysis" && analysisResult && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
                  {/* Cột 1: Bối cảnh bài đối thủ */}
                  <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <h3 className="font-bold text-slate-900 text-sm flex items-center">
                        <Layers className="w-4 h-4 mr-2 text-amber-600" />
                        Bối cảnh và cấu trúc đối thủ
                      </h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                        Điểm SEO: {analysisResult.seoScore || 65}/100
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-500 block text-[11px]">Tiêu đề H1 của đối thủ:</span>
                      <p className="font-bold text-slate-900 text-xs mt-1 bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                        {analysisResult.h1 || "Không xác định"}
                      </p>
                    </div>

                    <div>
                      <span className="text-slate-500 block text-[11px] mb-1.5">
                        Dàn ý các phân đoạn chính (H2, H3):
                      </span>
                      <ul className="space-y-1.5 text-slate-700 max-h-56 overflow-y-auto pr-1">
                        {analysisResult.headings?.map((h: string, hIdx: number) => (
                          <li key={hIdx} className="flex items-start bg-white p-2 rounded-lg border border-slate-200 shadow-2xs">
                            <span className="text-amber-600 font-bold mr-2 shrink-0">#</span>
                            <span className="leading-snug">{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-slate-500">
                      <span>Dung lượng bài đối thủ: ~<strong className="text-slate-800">{analysisResult.wordCountEstimate || 500}</strong> từ</span>
                    </div>
                  </div>

                  {/* Cột 2: Ma trận Lỗ hổng vs Vũ khí Trường Hải */}
                  <div className="lg:col-span-7 p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <h3 className="font-bold text-slate-900 text-sm flex items-center">
                        <ShieldAlert className="w-4 h-4 mr-2 text-amber-600" />
                        Ma trận đối soát: Lỗ hổng đối thủ vs vũ khí Trường Hải
                      </h3>
                      <span className="text-[10px] text-slate-500 font-semibold">
                        {analysisResult.weaknesses?.length || 0} điểm phát hiện
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 leading-relaxed font-normal">
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
                              className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-2.5 hover:border-slate-300 transition-colors shadow-2xs"
                            >
                              <div className="flex items-start space-x-2.5">
                                <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 font-bold text-[10px] shrink-0 border border-rose-200">
                                  Lỗ hổng đối thủ
                                </span>
                                <p className="text-slate-700 text-xs leading-relaxed">
                                  {competitorWeakness}
                                </p>
                              </div>

                              <div className="flex items-start space-x-2.5 pt-2 border-t border-slate-100">
                                <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 font-bold text-[10px] shrink-0 border border-amber-200">
                                  Vũ khí Trường Hải
                                </span>
                                <p className="text-slate-900 text-xs font-semibold leading-relaxed">
                                  {truongHaiAdvantage}
                                </p>
                              </div>
                            </div>
                          );
                        }

                        return (
                          <div
                            key={wIdx}
                            className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs leading-relaxed"
                          >
                            {w.replace(/⚠️/g, "").replace(/🎯/g, "")}
                          </div>
                        );
                      })}
                    </div>

                    <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center gap-2">
                      <span className="text-slate-500 text-[11px]">Từ khóa liên quan:</span>
                      {analysisResult.targetKeywords?.map((kw: string, kIdx: number) => (
                        <span
                          key={kIdx}
                          className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 text-[10px] font-mono shadow-2xs"
                        >
                          #{kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Hộp chuyển hướng hành động sang viết bài */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 via-white to-amber-50 border border-amber-300 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
                  <div className="space-y-1 text-center sm:text-left">
                    <h4 className="font-bold text-slate-900 text-sm flex items-center justify-center sm:justify-start space-x-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Đã hoàn tất phân tích đối soát lỗ hổng đối thủ!</span>
                    </h4>
                    <p className="text-xs text-slate-600">
                      Bài viết mới chuẩn SEO đã được tạo sẵn với đầy đủ các vũ khí và cam kết của Trường Hải Event.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveResultTab("article")}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-amber-500 hover:brightness-105 text-[#0A1E5E] font-black text-xs flex items-center space-x-2 shadow-sm shrink-0 cursor-pointer"
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
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Tiêu đề bài viết SEO
                    </label>
                    <input
                      type="text"
                      value={editablePost.title || ""}
                      onChange={(e) =>
                        setEditablePost({ ...editablePost, title: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-[#D4AF37]"
                    />
                  </div>

                  <div className="lg:col-span-4">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
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
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-[#D4AF37]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                  <div className="lg:col-span-6">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Đường dẫn tĩnh (Slug URL)
                    </label>
                    <input
                      type="text"
                      value={editablePost.slug || ""}
                      onChange={(e) =>
                        setEditablePost({ ...editablePost, slug: e.target.value })
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 text-xs font-mono outline-none focus:bg-white focus:ring-2 focus:ring-[#D4AF37]"
                    />
                  </div>

                  <div className="lg:col-span-6">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
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
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-[#D4AF37]"
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
                  onAutoOptimize={(fixes) => {
                    setEditablePost((prev: any) => {
                      if (!prev) return prev;
                      return {
                        ...prev,
                        title: fixes.title ?? prev.title,
                        content: fixes.content ?? prev.content,
                        meta_description: fixes.metaDescription ?? prev.meta_description,
                      };
                    });
                  }}
                />

                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 mb-3 border-b border-slate-200 gap-2">
                    <div className="flex items-center space-x-2">
                      <label className="text-xs font-bold text-slate-900">
                        Nội dung bài viết chuẩn SEO
                      </label>
                      <span className="text-[11px] text-slate-500">
                        ({editablePost.content?.length || 0} ký tự)
                      </span>
                    </div>

                    {/* Bộ chuyển đổi: Xem trước trực quan vs Soạn thảo mã nguồn */}
                    <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs">
                      <button
                        type="button"
                        onClick={() => setArticlePreviewMode("preview")}
                        className={`px-3 py-1.5 rounded-lg font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                          articlePreviewMode === "preview"
                            ? "bg-amber-500 text-slate-900 shadow-xs"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Xem trước giao diện thực tế</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setArticlePreviewMode("edit")}
                        className={`px-3 py-1.5 rounded-lg font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                          articlePreviewMode === "edit"
                            ? "bg-amber-500 text-slate-900 shadow-xs"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Chỉnh sửa mã nguồn</span>
                      </button>
                    </div>
                  </div>

                  {articlePreviewMode === "preview" ? (
                    <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 text-slate-800 shadow-xs border border-slate-200 max-h-[600px] overflow-y-auto">
                      <div className="pb-4 mb-6 border-b border-slate-200 flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                          Bản xem trước như hiển thị trên trang tin tức
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
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
                      className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-mono leading-relaxed outline-none focus:bg-white focus:ring-2 focus:ring-[#D4AF37]"
                      placeholder="Nội dung bài viết..."
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )}

        {/* MỤC 2: DUYỆT BÀI & KIỂM SOÁT CHẤT LƯỢNG (QA) */}
        {(activeNavSection === "duyet_bai" || activeNavSection === "posts") && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#0A1E5E] text-[#D4AF37] flex items-center justify-center shrink-0 shadow-xs">
                  <CheckSquare className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Kho bài viết & Duyệt chất lượng (QA)
                  </h2>
                  <p className="text-xs text-slate-500">
                    Quản lý kho bài đăng, rà soát [CẦN SỐ LIỆU] và kiểm định chất lượng trước khi Đăng lên website.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={fetchPosts}
                className="inline-flex items-center text-xs text-amber-700 hover:underline self-end sm:self-auto cursor-pointer font-semibold"
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1" />
                Làm mới danh sách ({postsList.length})
              </button>
            </div>

            {/* Banner Hướng Dẫn Quy Trình QA */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 to-amber-100/50 border border-amber-300 text-xs flex flex-wrap items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
                <span className="text-amber-950 font-bold">
                  Quy trình duyệt: 1. Đọc nội dung ➔ 2. Điền số thật tại các thẻ [CẦN SỐ LIỆU] ➔ 3. Tick 4 mục QA ➔ 4. Xuất bản
                </span>
              </div>
              {draftCount > 0 && (
                <span className="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-black text-[11px] shadow-2xs animate-pulse">
                  {draftCount} bài nháp chờ duyệt
                </span>
              )}
            </div>

            <div className="space-y-4">
              {/* Notice Banner khi Duyệt / Xuất bản bài viết */}
              {postNotice && (
                <div
                  className={`p-3.5 rounded-2xl text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border shadow-xs transition-all ${
                    postNotice.type === "success"
                      ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                      : postNotice.type === "error"
                      ? "bg-rose-50 border-rose-200 text-rose-800"
                      : "bg-blue-50 border-blue-200 text-blue-800"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span className="font-medium">{postNotice.text}</span>
                  </div>
                  <div className="flex items-center space-x-2 self-end sm:self-auto">
                    {postNotice.slug && (
                      <Link
                        href={`/tin-tuc/${postNotice.slug}`}
                        target="_blank"
                        className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-amber-400 text-[#0A1E5E] font-black text-xs inline-flex items-center space-x-1.5 shadow-xs hover:brightness-105 transition shrink-0"
                      >
                        <span>Xem bài viết trên web</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={() => setPostNotice(null)}
                      className="text-slate-500 hover:text-slate-800 text-xs px-2 py-1 cursor-pointer"
                      title="Đóng thông báo"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}

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
                    className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent placeholder:text-slate-400 transition"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs p-1 cursor-pointer"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Filter Pills */}
                <div className="flex items-center space-x-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setStatusFilter("draft")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 cursor-pointer ${
                      statusFilter === "draft"
                        ? "bg-[#0A1E5E] text-[#D4AF37] shadow-xs font-bold"
                        : "text-amber-900 hover:bg-amber-100/50"
                    }`}
                  >
                    <span>Bài chờ duyệt ({draftCount})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStatusFilter("published")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1 cursor-pointer ${
                      statusFilter === "published"
                        ? "bg-emerald-600 text-white shadow-xs font-bold"
                        : "text-emerald-700 hover:bg-emerald-50"
                    }`}
                  >
                    <span>Bài đã xuất bản ({publishedCount})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStatusFilter("all")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      statusFilter === "all"
                        ? "bg-slate-800 text-white shadow-xs font-bold"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Tất cả bài viết ({postsList.length})
                  </button>
                </div>
              </div>

              {/* Bulk Action Bar khi có bài viết được tích chọn */}
              {selectedPostIds.length > 0 && (
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 to-amber-100/90 border-2 border-amber-400 shadow-md">
                  <div className="flex items-center space-x-2.5">
                    <span className="flex items-center justify-center min-w-6 h-6 px-1.5 rounded-full bg-amber-500 text-slate-950 font-black text-xs shadow-xs">
                      {selectedPostIds.length}
                    </span>
                    <span className="text-xs font-bold text-amber-950">
                      Đã chọn <span className="underline font-black">{selectedPostIds.length}</span> / {filteredPosts.length} bài viết
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedPostIds([])}
                      className="text-xs text-slate-600 hover:text-slate-900 underline ml-2 cursor-pointer font-medium"
                    >
                      Bỏ chọn tất cả
                    </button>
                  </div>

                  <div className="flex items-center space-x-2 self-end sm:self-auto">
                    {/* Xuất bản hàng loạt */}
                    <button
                      type="button"
                      onClick={handleBulkPublishPosts}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center space-x-1.5 shadow-sm transition-all cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Xuất bản ({selectedPostIds.length})</span>
                    </button>

                    {/* Xóa hàng loạt */}
                    <button
                      type="button"
                      onClick={handleBulkDeletePosts}
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs inline-flex items-center space-x-1.5 shadow-sm transition-all cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Xóa {selectedPostIds.length} bài đã chọn</span>
                    </button>
                  </div>
                </div>
              )}

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 uppercase text-[10px] text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={isAllVisibleSelected}
                      ref={(el) => {
                        if (el) el.indeterminate = isSomeVisibleSelected;
                      }}
                      onChange={handleSelectAllVisible}
                      className="w-4 h-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500 cursor-pointer accent-amber-600"
                      title="Chọn / Bỏ chọn tất cả bài viết trên danh sách hiện tại"
                    />
                  </th>
                  <th className="py-3 px-4">Tiêu đề bài viết & Cảnh báo</th>
                  <th className="py-3 px-4">Từ khóa chính</th>
                  <th className="py-3 px-4">Trạng thái</th>
                  <th className="py-3 px-4">Thời gian tạo</th>
                  <th className="py-3 px-4 text-right">Thao tác duyệt QA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredPosts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <FileText className="w-8 h-8 text-slate-400" />
                        <p className="text-xs">
                          {searchQuery
                            ? `Không tìm thấy bài viết nào khớp với từ khóa "${searchQuery}"`
                            : "Không có bài viết nào trong danh mục này"}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredPosts.map((post) => {
                    const neededMatches = post.content?.match(/\[CẦN (?:SỐ LIỆU|KIỂM CHỨNG)[^\]]*\]/gi) || [];
                    const neededCount = neededMatches.length;
                    const isSelected = selectedPostIds.includes(post.id);

                    return (
                    <tr
                      key={post.id}
                      className={`transition-colors ${
                        isSelected
                          ? "bg-amber-50/80 hover:bg-amber-100/60 border-l-4 border-l-amber-500"
                          : "hover:bg-slate-50/80"
                      }`}
                    >
                      <td className="py-3.5 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelectPost(post.id)}
                          className="w-4 h-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500 cursor-pointer accent-amber-600"
                          title={`Chọn bài: ${post.title}`}
                        />
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900 max-w-xs">
                        <div className="truncate font-bold text-slate-900">{post.title}</div>
                        {neededCount > 0 ? (
                          <div className="mt-1 flex items-center">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                              <AlertTriangle className="w-3 h-3 mr-1 text-amber-700" />
                              Có {neededCount} vị trí [CẦN SỐ LIỆU]
                            </span>
                          </div>
                        ) : (
                          <div className="mt-1 flex items-center">
                            <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200">
                              <CheckCircle2 className="w-2.5 h-2.5 mr-1 text-emerald-600" />
                              Đầy đủ số liệu
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700">
                        <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[11px] font-medium">
                          {post.focus_keyword || "N/A"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {post.status === "published" ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                            Đã xuất bản
                          </span>
                        ) : post.status === "scheduled" ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-800 border border-indigo-200">
                            <Calendar className="w-3 h-3 mr-1 text-indigo-600" />
                            Lên lịch
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            <Clock className="w-3 h-3 mr-1 text-amber-600" />
                            Chờ duyệt
                          </span>
                        )}
                      </td>
                      {/* HIỂN THỊ RÕ GIỜ : PHÚT : GIÂY VÀ NGÀY/THÁNG/NĂM */}
                      <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap font-mono text-[11px]">
                        <span className="flex items-center text-slate-600">
                          <Clock className="w-3 h-3 text-amber-600 mr-1.5 shrink-0" />
                          {formatFullDateTime(post.created_at)}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                        {/* NÚT SOÁT QA & ĐIỀN SỐ THẬT */}
                        <button
                          type="button"
                          onClick={() => {
                            setReviewingPost(post);
                            setQaReport(null);
                            setReviewingChecklist({
                              dataChecked: false,
                              keywordChecked: false,
                              brandBrainChecked: false,
                              formatChecked: false,
                            });
                            // Tự động chạy máy soát lỗi QA ngay khi bấm mở
                            runAutomatedQaReview(post);
                          }}
                          className="px-2.5 py-1.5 rounded-xl text-[11px] font-bold bg-gradient-to-r from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-200 text-amber-950 border border-amber-300 inline-flex items-center space-x-1 transition-all cursor-pointer shadow-2xs"
                          title="Soát lỗi [CẦN SỐ LIỆU] & Duyệt QA"
                        >
                          <CheckSquare className="w-3.5 h-3.5 text-amber-700" />
                          <span>Soát QA</span>
                        </button>

                        {/* Nút Duyệt đăng nhanh */}
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(post)}
                          className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer shadow-2xs ${
                            post.status === "published"
                              ? "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                              : "bg-gradient-to-r from-[#D4AF37] to-amber-500 hover:brightness-105 text-[#0A1E5E]"
                          }`}
                        >
                          {post.status === "published" ? "Thu hồi nháp" : "Đăng ngay"}
                        </button>

                        {/* Nút Sửa bài viết trong AI Studio */}
                        <button
                          type="button"
                          onClick={() => {
                            handleStartEditPost(post);
                            setActiveNavSection("viet_bai");
                          }}
                          className="px-2 py-1.5 rounded-xl bg-slate-100 hover:bg-amber-50 text-slate-700 hover:text-amber-800 border border-slate-200 hover:border-amber-200 inline-flex items-center transition-all cursor-pointer"
                          title="Mở trong AI Studio để sửa sâu"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        {/* Nút Xem bài viết */}
                        <Link
                          href={`/tin-tuc/${post.slug}`}
                          target="_blank"
                          className="px-2 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 inline-flex items-center"
                          title="Xem bài viết trên web"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>

                        {/* NÚT XÓA BẢN NHÁP / BÀI VIẾT */}
                        <button
                          type="button"
                          onClick={() => handleDeletePost(post)}
                          className="px-2 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 inline-flex items-center transition-colors cursor-pointer"
                          title="Xóa bài viết này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                    );
                  }))}
              </tbody>
            </table>
          </div>
            </div>
          </div>
        )}

        {/* MODAL SOÁT LỖI [CẦN SỐ LIỆU] & KIỂM ĐỊNH QA */}
        {reviewingPost && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            <div className="bg-white border border-slate-200 rounded-3xl max-w-4xl w-full max-h-[92vh] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
              {/* Modal Header */}
              <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#D4AF37] text-[#0A1E5E]">
                      QA & KIỂM ĐỊNH BÀI VIẾT
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      Từ khóa: <strong>{reviewingPost.focus_keyword || "Chưa gán"}</strong>
                    </span>
                  </div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                    {reviewingPost.title}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setReviewingPost(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 text-xs">
                {/* HỆ THỐNG MÁY TỰ ĐỘNG SOÁT LỖI & CHẤM ĐIỂM QA 20 TIÊU CHÍ */}
                <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-[#0A1E5E] to-slate-900 text-white shadow-md space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shrink-0 shadow-sm">
                        <Bot className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-black text-white">
                            Máy Tự Động Soát Lỗi & Chấm Điểm QA
                          </h4>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/20 text-amber-300">
                            20 Tiêu Chuẩn E-E-A-T
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 mt-0.5">
                          Tự động rà soát từ cấm, đối chiếu Bộ não thương hiệu và kiểm tra cấu trúc SEO thay cho người duyệt.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={isQaRunning}
                      onClick={() => runAutomatedQaReview()}
                      className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-all shadow-sm flex items-center space-x-1.5 cursor-pointer disabled:opacity-50 shrink-0"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isQaRunning ? "animate-spin" : ""}`} />
                      <span>{isQaRunning ? "Đang soát bài..." : "Soát lại ngay"}</span>
                    </button>
                  </div>

                  {/* KẾT QUẢ SOÁT TỰ ĐỘNG NẾU CÓ BÁO CÁO */}
                  {qaReport && (
                    <div className="pt-2 space-y-3">
                      {/* Thẻ Điểm Số & Đánh Giá */}
                      <div className="p-4 rounded-2xl bg-white/10 border border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center space-x-3.5">
                          <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-black shrink-0 border-2 ${
                            qaReport.score >= 80
                              ? "bg-emerald-500/20 border-emerald-400 text-emerald-300"
                              : qaReport.score >= 60
                              ? "bg-amber-500/20 border-amber-400 text-amber-300"
                              : "bg-rose-500/20 border-rose-400 text-rose-300"
                          }`}>
                            <span className="text-xl leading-none">{qaReport.score}</span>
                            <span className="text-[9px] uppercase tracking-wider mt-0.5">/100</span>
                          </div>
                          <div>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black inline-block ${
                              qaReport.isOverallPass
                                ? "bg-emerald-400 text-slate-950"
                                : "bg-amber-400 text-slate-950"
                            }`}>
                              {qaReport.isOverallPass ? "✅ ĐẠT CHUẨN XUẤT BẢN" : "⚠️ CẦN SỬA LỖI TRƯỚC KHI ĐĂNG"}
                            </span>
                            <p className="text-xs text-slate-200 mt-1 font-medium">
                              Đã kiểm tra: <strong className="text-white">{qaReport.summary.passedChecks} tiêu chí Đạt</strong> •{" "}
                              <strong className={qaReport.summary.failedChecks > 0 ? "text-rose-300" : "text-slate-300"}>
                                {qaReport.summary.failedChecks} tiêu chí Lỗi
                              </strong>
                            </p>
                          </div>
                        </div>

                        {/* Nút Sửa Tự Động Từ Cấm Nếu Phát Hiện */}
                        {qaReport.summary.forbiddenWordCount > 0 && (
                          <button
                            type="button"
                            onClick={handleAutoFixForbiddenWords}
                            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:brightness-110 text-white font-black text-xs flex items-center space-x-1.5 shadow-sm cursor-pointer self-start sm:self-auto shrink-0"
                          >
                            <Wand2 className="w-3.5 h-3.5" />
                            <span>Máy tự động sửa {qaReport.summary.forbiddenWordCount} từ cấm</span>
                          </button>
                        )}
                      </div>

                      {/* Chi tiết các lỗi phát hiện (nếu có) */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                        {qaReport.checks.map((chk: any) => (
                          <div
                            key={chk.id}
                            className={`p-2.5 rounded-xl border flex items-start space-x-2 ${
                              chk.status === "pass"
                                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-200"
                                : chk.status === "warn"
                                ? "bg-amber-500/10 border-amber-500/20 text-amber-200"
                                : "bg-rose-500/20 border-rose-500/40 text-rose-200"
                            }`}
                          >
                            {chk.status === "pass" ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            ) : chk.status === "warn" ? (
                              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                            ) : (
                              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                            )}
                            <div className="space-y-0.5 flex-1 min-w-0">
                              <div className="font-bold flex items-center justify-between">
                                <span className="truncate">{chk.name}</span>
                                {chk.status !== "pass" && (
                                  <span className="text-[10px] font-mono font-normal opacity-80">
                                    {chk.scoreImpact} điểm
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] opacity-90 leading-snug">
                                {chk.message}
                              </p>
                              {chk.matches && chk.matches.length > 0 && (
                                <p className="text-[10px] font-mono text-amber-300 truncate">
                                  Phát hiện: {chk.matches.join(", ")}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* HỘP 1: RÀ SOÁT CÁC CHỖ [CẦN SỐ LIỆU] */}
                <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-300 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-amber-700" />
                      <h4 className="font-bold text-amber-950 text-xs">
                        Rà soát các thẻ [CẦN SỐ LIỆU] & Thông số thực tế
                      </h4>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-amber-900 bg-amber-200/60 px-2 py-0.5 rounded">
                      {(reviewingPost.content?.match(/\[CẦN (?:SỐ LIỆU|KIỂM CHỨNG)[^\]]*\]/gi) || []).length} vị trí
                    </span>
                  </div>

                  {(() => {
                    const matches = reviewingPost.content?.match(/\[CẦN (?:SỐ LIỆU|KIỂM CHỨNG)[^\]]*\]/gi) || [];
                    if (matches.length === 0) {
                      return (
                        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 flex items-center space-x-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Bài viết không còn thẻ [CẦN SỐ LIỆU] nào. Thông số thực tế đã hoàn chỉnh!</span>
                        </div>
                      );
                    }
                    return (
                      <div className="space-y-2">
                        <p className="text-[11px] text-amber-800">
                          AI đã đánh dấu các vị trí cần thông số người thật duyệt. Bạn có thể bấm "Điền số thật" để thay thế ngay hoặc mở AI Studio để sửa sâu:
                        </p>
                        <div className="space-y-1.5 max-h-36 overflow-y-auto">
                          {matches.map((m, idx) => (
                            <div key={idx} className="p-2 rounded-lg bg-white border border-amber-200 flex items-center justify-between gap-2">
                              <span className="font-mono text-[11px] font-bold text-amber-900 bg-amber-100 px-1.5 py-0.5 rounded truncate">
                                {m}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  const replacement = window.prompt(`Nhập số liệu thực tế thay thế cho "${m}":`, "");
                                  if (replacement !== null && replacement.trim()) {
                                    const newContent = reviewingPost.content.replace(m, replacement.trim());
                                    const updated = { ...reviewingPost, content: newContent };
                                    setReviewingPost(updated);
                                    handleDirectUpdateContent(updated);
                                  }
                                }}
                                className="px-2.5 py-1 rounded bg-[#0A1E5E] text-[#D4AF37] font-bold text-[10px] hover:bg-slate-800 cursor-pointer shrink-0"
                              >
                                Điền số thật
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* HỘP 2: CHECKLIST QA TRƯỚC KHI ĐĂNG */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center space-x-2 text-slate-900 font-bold text-xs">
                    <CheckCheck className="w-4 h-4 text-emerald-600" />
                    <span>Checklist kiểm định QA của người duyệt bài:</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <label className="flex items-start space-x-2 p-2.5 rounded-xl bg-white border border-slate-200 cursor-pointer hover:bg-slate-50 transition">
                      <input
                        type="checkbox"
                        checked={reviewingChecklist.dataChecked}
                        onChange={(e) => setReviewingChecklist({ ...reviewingChecklist, dataChecked: e.target.checked })}
                        className="mt-0.5 accent-amber-600 rounded"
                      />
                      <span className="leading-snug">
                        <strong>1. Số liệu thực tế:</strong> Đã rà soát & thay thế các thẻ [CẦN SỐ LIỆU] bằng thông số thật.
                      </span>
                    </label>

                    <label className="flex items-start space-x-2 p-2.5 rounded-xl bg-white border border-slate-200 cursor-pointer hover:bg-slate-50 transition">
                      <input
                        type="checkbox"
                        checked={reviewingChecklist.keywordChecked}
                        onChange={(e) => setReviewingChecklist({ ...reviewingChecklist, keywordChecked: e.target.checked })}
                        className="mt-0.5 accent-amber-600 rounded"
                      />
                      <span className="leading-snug">
                        <strong>2. Từ khóa & Cấu trúc SEO:</strong> Từ khóa chính nằm trong Tiêu đề, H1, H2 và xuất hiện tự nhiên.
                      </span>
                    </label>

                    <label className="flex items-start space-x-2 p-2.5 rounded-xl bg-white border border-slate-200 cursor-pointer hover:bg-slate-50 transition">
                      <input
                        type="checkbox"
                        checked={reviewingChecklist.brandBrainChecked}
                        onChange={(e) => setReviewingChecklist({ ...reviewingChecklist, brandBrainChecked: e.target.checked })}
                        className="mt-0.5 accent-amber-600 rounded"
                      />
                      <span className="leading-snug">
                        <strong>3. Bộ não thương hiệu:</strong> Đã trích dẫn dự án hoặc thiết bị thật sẵn kho của Trường Hải Event.
                      </span>
                    </label>

                    <label className="flex items-start space-x-2 p-2.5 rounded-xl bg-white border border-slate-200 cursor-pointer hover:bg-slate-50 transition">
                      <input
                        type="checkbox"
                        checked={reviewingChecklist.formatChecked}
                        onChange={(e) => setReviewingChecklist({ ...reviewingChecklist, formatChecked: e.target.checked })}
                        className="mt-0.5 accent-amber-600 rounded"
                      />
                      <span className="leading-snug">
                        <strong>4. FAQ & Lời kêu gọi:</strong> Đầy đủ 3 câu hỏi thường gặp và hotline liên hệ 096.386.1313.
                      </span>
                    </label>
                  </div>
                </div>

                {/* HỘP 3: XEM TRƯỚC TOÀN VĂN BÀI VIẾT */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-xs flex items-center space-x-1.5">
                      <Eye className="w-3.5 h-3.5 text-amber-600" />
                      <span>Xem trước bài viết thực tế</span>
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Độ dài: {reviewingPost.content?.length || 0} ký tự
                    </span>
                  </div>
                  <div className="p-4 sm:p-6 rounded-2xl bg-white border border-slate-200 max-h-96 overflow-y-auto shadow-inner">
                    <ArticleContentRenderer content={reviewingPost.content || ""} />
                  </div>
                </div>
              </div>

              {/* Modal Actions Footer */}
              <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    handleStartEditPost(reviewingPost);
                    setReviewingPost(null);
                    setActiveNavSection("viet_bai");
                  }}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-amber-50 text-amber-900 border border-slate-300 font-bold text-xs flex items-center space-x-1.5 cursor-pointer shadow-xs"
                >
                  <Edit3 className="w-3.5 h-3.5 text-amber-600" />
                  <span>Sửa sâu trong AI Studio</span>
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setReviewingPost(null)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                  >
                    Đóng
                  </button>

                  <button
                    type="button"
                    onClick={async () => {
                      await handlePublishDirect(reviewingPost);
                      setReviewingPost(null);
                    }}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-amber-500 hover:brightness-105 text-[#0A1E5E] font-black text-xs flex items-center space-x-1.5 shadow-md cursor-pointer transition-all hover:scale-105"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>🚀 Phê Duyệt & Xuất Bản Lên Web Ngay</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MỤC 0: TOP GOOGLE (Radar đợt 1: từ khóa → top Google → cào bài) */}
        {activeNavSection === "top_google" && <SerpRadarPanel />}

        {/* MỤC 4: QUẢN LÝ ĐỐI THỦ (COMPETITORS) */}
        {(activeNavSection === "doi_thu" || activeNavSection === "competitors") && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <CompetitorsManager
              onSelectCompetitorForScan={(domain, name) => {
                setDomainInput(domain);
                setScanMode("domain");
                setEditablePost(null);
                setAnalysisResult(null);
                setActiveNavSection("viet_bai");
                window.scrollTo({ top: 350, behavior: "smooth" });
              }}
              onRefreshStats={refreshRadarStats}
            />
          </div>
        )}

        {/* MỤC 5: KHOẢNG TRỐNG SEO & LẬP LỊCH QUÉT NGẦM (CONTENT GAP & CRON) */}
        {(activeNavSection === "ke_hoach" ||
          activeNavSection === "content_gap" ||
          activeNavSection === "cron") && (
          <div className="space-y-6">
            {/* 4 THẺ CHỈ SỐ TỔNG QUAN HỆ THỐNG */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Số lượng đối thủ đang theo dõi */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
                  <Globe className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Đối thủ đang theo dõi</p>
                  <div className="flex items-baseline space-x-1.5">
                    <h3 className="text-2xl font-black text-slate-900">
                      {trackedCompetitors.filter((c) => c.isActive).length}
                    </h3>
                    <span className="text-[11px] text-slate-500">/{trackedCompetitors.length} tổng</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Tổng số trang/bài viết đã quét của đối thủ */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                  <Radar className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Tổng bài đối thủ đã quét</p>
                  <h3 className="text-2xl font-black text-emerald-700">
                    {trackedCompetitors.reduce((acc, c) => acc + (c.scannedPagesCount || 0), 0)} bài
                  </h3>
                </div>
              </div>

              {/* Card 3: Khoảng trống SEO (Content Gap) phát hiện được */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
                  <Compass className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Khoảng trống SEO (Gaps)</p>
                  <h3 className="text-2xl font-black text-amber-700">
                    {contentGaps.filter((g) => g.ourSiteStatus === "missing").length} chủ đề
                  </h3>
                </div>
              </div>

              {/* Card 4: Cảnh báo các bài viết/nội dung chưa đạt tiêu chuẩn cần xem lại */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Cảnh báo cần xem lại</p>
                  <div className="flex items-baseline space-x-1.5">
                    <h3 className="text-2xl font-black text-amber-700">
                      {contentGaps.filter((g) => g.ourSiteStatus === "missing" && g.priority === "high").length}
                    </h3>
                    <span className="text-[11px] text-amber-700 font-semibold">Ưu tiên cao</span>
                  </div>
                </div>
              </div>
            </div>

            {/* MÀN HÌNH TÍCH HỢP: LẬP LỊCH QUÉT 02:30 SÁNG & BẢN ĐỒ KHOẢNG TRỐNG SEO */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              <ContentGapDashboard
                onGenerateDraftFromGap={(gap) => {
                  setCompetitorUrl(gap.competitorUrl);
                  setTargetKeyword(gap.targetKeyword);
                  setScanMode("single");
                  setEditablePost(null);
                  setAnalysisResult(null);
                  setActiveNavSection("viet_bai");
                  window.scrollTo({ top: 350, behavior: "smooth" });
                  // Tự động kích hoạt AI Studio bóc tách và viết bài ngay lập tức!
                  executeScanAndGenerate(gap.competitorUrl, gap.targetKeyword);
                }}
                onRefreshData={refreshRadarStats}
                onNavigateSection={setActiveNavSection}
              />
            </div>
          </div>
        )}

        {/* MỤC 3: BỘ NÃO THƯƠNG HIỆU (EVENTS & BRAND BRAIN) */}
        {(activeNavSection === "bo_nao" || activeNavSection === "events") && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-8">
            <BrandBrainViewer />
            <div className="pt-8 border-t border-slate-200">
              <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-amber-600" />
                Hồ sơ chi tiết các Case Study sự kiện (Kho ảnh & Báo giá bóc tách)
              </h3>
              <EventProfileArchive
                onOpenInRadarEditor={(post) => {
                  setEditablePost(post);
                  setActiveResultTab("article");
                  setArticlePreviewMode("edit");
                  setActiveNavSection("viet_bai");
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
            </div>
          </div>
        )}

        {/* NHẬT KÝ CA QUÉT (LOGS) */}
        {activeNavSection === "logs" && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <RadarActivityLogs onRefreshData={refreshRadarStats} />
          </div>
        )}
      </main>
    </div>
  );
}
