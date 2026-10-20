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
} from "lucide-react";
import ArticleContentRenderer from "@/components/ArticleContentRenderer";

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

  // Posts table state
  const [postsList, setPostsList] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);

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
          setPostsList(data);
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
  }, []);

  // Quick fill samples
  const fillSample = (url: string, keyword: string, promptText: string) => {
    setCompetitorUrl(url);
    setTargetKeyword(keyword);
    setCustomPrompt(promptText);
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
      // Giả lập trực quan từng bước cho người dùng
      const stepTimer1 = setTimeout(() => setProcessStep(2), 1200);
      const stepTimer2 = setTimeout(() => setProcessStep(3), 2800);

      const res = await fetch("/api/radar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          competitorUrl: competitorUrl.trim(),
          targetKeyword: targetKeyword.trim(),
          customPrompt: customPrompt.trim(),
        }),
      });

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);

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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <Search className="w-5 h-5 text-[#D4AF37]" />
                <h2 className="text-base font-bold text-white">
                  Nhập thông tin quét đối thủ
                </h2>
              </div>

              {/* Sample Buttons */}
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-slate-400 text-[11px]">Mẫu thử nghiệm:</span>
                <button
                  type="button"
                  onClick={() =>
                    fillSample(
                      "https://hoabinhevents.com/chi-phi-to-chuc-le-khanh-thanh-nha-may-la-bao-nhieu",
                      "báo giá tổ chức lễ khánh thành nhà máy",
                      "Nhấn mạnh vào năng lực từng khánh thành Nhà máy EIFFEL Damsan và kho thiết bị Line Array nhập khẩu trực tiếp."
                    )
                  }
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[#D4AF37] border border-[#D4AF37]/30 text-[11px]"
                >
                  Mẫu khai trương
                </button>
                <button
                  type="button"
                  onClick={() =>
                    fillSample(
                      "https://vietnamevents.com/to-chuc-year-end-party",
                      "tổ chức year end party công ty",
                      "Tập trung vào concept Gala Dinner bùng nổ, âm thanh Line Array không hú rít, hotline 0844 198 333."
                    )
                  }
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-amber-300 border border-white/10 text-[11px]"
                >
                  Mẫu Year End Party
                </button>
              </div>
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

              {/* Custom Prompt Instructions */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Yêu cầu bổ sung cho AI (tùy chọn: góc nhìn độc bản, chương trình khuyến mãi...)
                </label>
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

            {/* Visual Step Progress Indicator */}
            {isAnalyzing && (
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3 animate-in fade-in duration-300">
                <div className="text-xs font-semibold text-[#D4AF37] flex items-center">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin mr-2" />
                  Tiến trình Radar SEO:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div
                    className={`p-2.5 rounded-xl border flex items-center space-x-2 ${
                      processStep >= 1
                        ? "bg-[#0A1E5E] border-[#D4AF37] text-white"
                        : "bg-white/5 border-white/5 text-slate-400"
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold">
                      1
                    </span>
                    <span>Cào dữ liệu (Jina Reader)</span>
                  </div>

                  <div
                    className={`p-2.5 rounded-xl border flex items-center space-x-2 ${
                      processStep >= 2
                        ? "bg-[#0A1E5E] border-[#D4AF37] text-white"
                        : "bg-white/5 border-white/5 text-slate-400"
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold">
                      2
                    </span>
                    <span>Bóc tách lỗ hổng và thế mạnh</span>
                  </div>

                  <div
                    className={`p-2.5 rounded-xl border flex items-center space-x-2 ${
                      processStep >= 3
                        ? "bg-[#0A1E5E] border-[#D4AF37] text-white"
                        : "bg-white/5 border-white/5 text-slate-400"
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold">
                      3
                    </span>
                    <span>Khắc chế bằng bài viết Trường Hải</span>
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
          <div className="bg-[#06123B] rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl space-y-6">
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
            POSTS MANAGEMENT TABLE (HIỆN RÕ GIỜ/NGÀY & CÓ THAO TÁC XÓA)
        ===================================================================== */}
        <div className="bg-[#06123B] rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl space-y-4">
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
                {postsList.map((post) => (
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

                      {/* Nút Xem bài viết */}
                      <Link
                        href={`/tin-tuc/${post.slug}`}
                        target="_blank"
                        className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-slate-300 inline-flex items-center"
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
