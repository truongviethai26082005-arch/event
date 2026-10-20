"use client";

/**
 * =========================================================================
 * KHU VỰC DÀNH CHO THÀNH VIÊN 4: CÔNG NGHỆ LÕI RADAR SEO ADMIN
 * Lưu ý: Thành viên 4 chỉ được phép chỉnh sửa các file bên trong:
 * - src/app/admin-radar/
 * - src/app/api/radar/
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
  HelpCircle,
  TrendingUp,
} from "lucide-react";

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
  const [activeResultTab, setActiveResultTab] = useState<"analysis" | "article">("article");
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);

  // Posts table state
  const [postsList, setPostsList] = useState<DatabasePost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");

  const filteredPosts = postsList.filter((post) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      post.title.toLowerCase().includes(query) ||
      (post.focus_keyword && post.focus_keyword.toLowerCase().includes(query)) ||
      post.slug.toLowerCase().includes(query);

    const matchesStatus =
      statusFilter === "all" || post.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const publishedCount = postsList.filter((p) => p.status === "published").length;
  const draftCount = postsList.filter((p) => p.status === "draft").length;

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
    const mappedMocks: DatabasePost[] = MOCK_BLOG_POSTS.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      content: p.content,
      meta_description: p.meta_description,
      focus_keyword: p.focus_keyword,
      status: p.status as "draft" | "published",
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
      setActiveResultTab("article");

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

  // Start editing existing post
  const handleStartEditPost = (post: DatabasePost) => {
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

  // Manual save or update to Supabase
  const handleSaveToSupabase = async (status: "draft" | "published") => {
    if (!editablePost) return;
    setSaveStatus(editingPostId ? "Đang cập nhật bài viết vào Supabase..." : "Đang lưu bài viết vào Supabase...");

    try {
      if (isSupabaseConfigured) {
        const payload: Partial<DatabasePost> = {
          title: editablePost.title,
          slug: editablePost.slug,
          content: editablePost.content,
          meta_description: editablePost.meta_description,
          focus_keyword: editablePost.focus_keyword,
          status: status,
        };

        if (editingPostId) {
          // UPDATE EXISTING POST
          const { error } = await supabase
            .from("posts")
            .update(payload)
            .eq("id", editingPostId);

          if (error) throw error;
          setSaveStatus(
            status === "published"
              ? "Đã cập nhật & xuất bản bài viết thành công!"
              : "Đã cập nhật bài viết (trạng thái bản nháp) thành công!"
          );
          setEditingPostId(null);
          fetchPosts();
        } else {
          // INSERT NEW POST
          payload.competitor_source_url = competitorUrl;
          const { error } = await supabase.from("posts").insert([payload]);

          if (error) throw error;
          setSaveStatus(
            status === "published"
              ? "Đã xuất bản bài viết thành công lên trang Tin tức!"
              : "Đã lưu bản nháp vào bảng 'posts' thành công!"
          );
          fetchPosts();
        }
      } else {
        // Mock save/update
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
          const newMockPost: DatabasePost = {
            id: `post-${Date.now()}`,
            title: editablePost.title,
            slug: editablePost.slug,
            content: editablePost.content,
            meta_description: editablePost.meta_description,
            focus_keyword: editablePost.focus_keyword,
            competitor_source_url: competitorUrl,
            status: status,
            created_at: new Date().toISOString(),
          };
          setPostsList([newMockPost, ...postsList]);
          setSaveStatus(
            status === "published"
              ? "Đã xuất bản (chế độ demo - chưa kết nối Supabase)!"
              : "Đã lưu bản nháp (chế độ demo - chưa kết nối Supabase)!"
          );
        }
      }
    } catch (err: any) {
      console.error("Save error:", err);
      setSaveStatus(`Lỗi khi lưu: ${err.message || String(err)}`);
    }
  };

  // Toggle publish status in posts table
  const handleToggleStatus = async (post: DatabasePost) => {
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

    // Local toggle fallback
    setPostsList(
      postsList.map((p) =>
        p.id === post.id ? { ...p, status: nextStatus } : p
      )
    );
  };

  // Xóa bài viết khỏi Supabase & cập nhật lại danh sách
  const handleDeletePost = async (post: DatabasePost) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa bài viết:\n"${post.title}"?`)) {
      return;
    }

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from("posts")
          .delete()
          .eq("id", post.id);

        if (!error) {
          fetchPosts();
          return;
        }
      } catch (e) {
        console.warn("Lỗi khi xóa bài viết Supabase:", e);
      }
    }

    // Cập nhật lại danh sách nếu ở chế độ demo
    setPostsList(postsList.filter((p) => p.id !== post.id));
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-10">
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
                Công cụ quét đối thủ qua Jina Reader & Tái tạo bài viết chuẩn SEO bằng Gemini AI cho {COMPANY_INFO.brandName}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 flex items-center space-x-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  isSupabaseConfigured ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
                }`}
              />
              <span className="text-slate-300">
                {isSupabaseConfigured ? "Supabase: Đã kết nối" : "Supabase: Chế độ Demo"}
              </span>
            </div>

            <Link
              href="/tin-tuc"
              target="_blank"
              className="px-3.5 py-1.5 rounded-xl bg-[#0A1E5E] text-[#D4AF37] border border-[#D4AF37]/30 hover:bg-[#D4AF37] hover:text-[#0A1E5E] transition-all font-semibold flex items-center"
            >
              <span>Xem Blog Thực tế</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
            </Link>
          </div>
        </div>

        {/* =====================================================================
            RADAR CONTROL PANEL (SCANNER FORM)
        ===================================================================== */}
        <div className="bg-[#06123B] rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h2 className="text-lg font-bold text-white flex items-center">
                <Search className="w-5 h-5 mr-2 text-[#D4AF37]" />
                Nhập Thông Tin Quét Đối Thủ
              </h2>

              {/* Sample quick buttons */}
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-slate-400 hidden sm:inline">Mẫu thử nghiệm:</span>
                <button
                  type="button"
                  onClick={() =>
                    fillSample(
                      "https://hoabinh-group.com/to-chuc-su-kien-khai-truong",
                      "tổ chức khai trương trọn gói",
                      "Nhấn mạnh vào năng lực từng khai trương chuỗi LocknLock và showroom gạch men lớn, có đội lân sư rồng trực tiếp."
                    )
                  }
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[#D4AF37] border border-[#D4AF37]/30 text-[11px]"
                >
                  Mẫu Khai Trương
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
                    URL Bài viết đối thủ cạnh tranh <span className="text-[#D4AF37]">*</span>
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
                    Từ khóa mục tiêu (Focus Keyword)
                  </label>
                  <input
                    type="text"
                    placeholder="VD: tổ chức gala dinner tại hà nội"
                    value={targetKeyword}
                    onChange={(e) => setTargetKeyword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition"
                  />
                </div>
              </div>

              {/* Custom Prompt Instructions */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Yêu cầu bổ sung cho AI (Tùy chọn: góc nhìn độc bản, chương trình khuyến mãi...)
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
                  <span>Quy trình tự động: Cào qua Jina ➔ Phân tích H1-H3 ➔ Tái tạo chuẩn SEO</span>
                </div>

                <button
                  type="submit"
                  disabled={isAnalyzing || !competitorUrl}
                  className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-[#D4AF37] via-[#f5e08b] to-[#D4AF37] text-[#0A1E5E] shadow-lg shadow-[#D4AF37]/20 hover:scale-105 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Đang Xử Lý Radar AI...</span>
                    </>
                  ) : (
                    <>
                      <Radar className="w-4 h-4 text-[#0A1E5E]" />
                      <span>Quét & Viết Bài Chuẩn SEO Ngay</span>
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
                    <span>Phân tích H1-H3 & Lỗ hổng</span>
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
                    <span>Viết bài chuẩn SEO Trường Hải</span>
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
            RESULTS WORKSPACE (ANALYSIS & NEW ARTICLE EDITOR)
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
              {/* Tab Selector */}
              <div className="inline-flex p-1 rounded-xl bg-white/5 border border-white/10">
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
                  <span>Bài Viết Mới Chuẩn SEO (Trường Hải)</span>
                </button>

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
                  <span>Phân Tích Cấu Trúc Đối Thủ</span>
                </button>
              </div>

              {/* Action buttons */}
              <div className="flex items-center space-x-2 text-xs">
                <button
                  type="button"
                  onClick={() => handleSaveToSupabase("draft")}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 border border-white/20 font-bold flex items-center space-x-1.5 transition-all"
                >
                  <Save className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{editingPostId ? "Lưu Cập Nhật (Nháp)" : "Lưu Bản Nháp (Supabase)"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSaveToSupabase("published")}
                  className="px-4 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#edd47a] text-[#0A1E5E] font-black flex items-center space-x-1.5 shadow-md transition-all"
                >
                  <Send className="w-3.5 h-3.5 text-[#0A1E5E]" />
                  <span>{editingPostId ? "Cập Nhật & Xuất Bản" : "Xuất Bản Ngay"}</span>
                </button>
              </div>
            </div>

            {saveStatus && (
              <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-2 shrink-0 text-emerald-400" />
                <span>{saveStatus}</span>
              </div>
            )}

            {/* TAB 1: ARTICLE EDITOR */}
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
                      Từ khóa chính (Focus Keyword)
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
                      Meta Description (Tóm tắt chuẩn SEO)
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
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-300">
                      Nội dung bài viết (Markdown / H1, H2, H3, Hotline 0844 198 333)
                    </label>
                    <span className="text-[11px] text-slate-400">
                      Độ dài: {editablePost.content?.length || 0} ký tự
                    </span>
                  </div>
                  <textarea
                    rows={16}
                    value={editablePost.content || ""}
                    onChange={(e) =>
                      setEditablePost({ ...editablePost, content: e.target.value })
                    }
                    className="w-full p-4 rounded-2xl bg-white/5 border border-white/15 text-slate-200 text-xs font-mono leading-relaxed outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  />
                </div>
              </div>
            )}

            {/* TAB 2: COMPETITOR ANALYSIS */}
            {activeResultTab === "analysis" && analysisResult && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                {/* Structure info */}
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                  <h3 className="font-bold text-white text-sm pb-2 border-b border-white/10 flex items-center">
                    <Layers className="w-4 h-4 mr-2 text-[#D4AF37]" />
                    Cấu Trúc Tiêu Đề Bài Đối Thủ
                  </h3>

                  <div>
                    <span className="text-slate-400 block text-[11px]">H1 của đối thủ:</span>
                    <p className="font-semibold text-white mt-0.5">
                      {analysisResult.h1 || "Không xác định"}
                    </p>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px] mb-1">
                      Các phân đoạn chính (H2, H3):
                    </span>
                    <ul className="space-y-1.5 text-slate-300">
                      {analysisResult.headings?.map((h: string, hIdx: number) => (
                        <li key={hIdx} className="flex items-start">
                          <span className="text-[#D4AF37] mr-1.5">•</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-slate-400">
                    <span>Ước lượng từ: ~{analysisResult.wordCountEstimate || 500} từ</span>
                    <span className="text-[#D4AF37] font-bold">
                      Điểm SEO đối thủ: {analysisResult.seoScore || 65}/100
                    </span>
                  </div>
                </div>

                {/* Weaknesses & Strategy */}
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                  <h3 className="font-bold text-white text-sm pb-2 border-b border-white/10 flex items-center text-amber-300">
                    <AlertCircle className="w-4 h-4 mr-2 text-amber-400" />
                    Lỗ Hổng & Điểm Yếu Cần Vượt Qua
                  </h3>

                  <ul className="space-y-2">
                    {analysisResult.weaknesses?.map((w: string, wIdx: number) => (
                      <li
                        key={wIdx}
                        className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-slate-200"
                      >
                        {w}
                      </li>
                    ))}
                  </ul>

                  <div className="pt-2">
                    <span className="text-slate-400 block text-[11px] mb-1">
                      Từ khóa đối thủ đang nhắm:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {analysisResult.targetKeywords?.map((kw: string, kIdx: number) => (
                        <span
                          key={kIdx}
                          className="px-2 py-0.5 rounded bg-white/10 text-slate-300 text-[10px]"
                        >
                          #{kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =====================================================================
            POSTS MANAGEMENT TABLE (DANH SÁCH BÀI VIẾT SUPABASE & DUYỆT ĐĂNG)
        ===================================================================== */}
        <div className="bg-[#06123B] rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-2">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center">
                <FileText className="w-5 h-5 mr-2 text-[#D4AF37]" />
                Quản Lý Bài Viết SEO (Bảng 'posts')
              </h2>
              <p className="text-xs text-slate-400">
                Theo dõi các bài viết được Radar AI tạo ra và duyệt chuyển từ trạng thái 'draft' sang 'published'
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

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-white/5 uppercase text-[10px] text-slate-400">
                <tr>
                  <th className="py-3 px-4">Tiêu đề bài viết</th>
                  <th className="py-3 px-4">Từ khóa chính</th>
                  <th className="py-3 px-4">Trạng thái</th>
                  <th className="py-3 px-4">Ngày tạo</th>
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
                    <td className="py-3 px-4 font-semibold text-white max-w-xs truncate">
                      {post.title}
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      <span className="px-2 py-0.5 rounded bg-white/10 text-[11px]">
                        {post.focus_keyword || "N/A"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {post.status === "published" ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                          <Clock className="w-3 h-3 mr-1" />
                          Draft (Nháp)
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {post.created_at
                        ? new Date(post.created_at).toLocaleDateString("vi-VN")
                        : "Hôm nay"}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
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

                      <button
                        type="button"
                        onClick={() => handleStartEditPost(post)}
                        className="px-2 py-1 rounded bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 border border-amber-500/30 inline-flex items-center transition-all"
                        title="Chỉnh sửa bài viết"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>

                      <Link
                        href={`/tin-tuc/${post.slug}`}
                        target="_blank"
                        className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-slate-300 inline-flex items-center ml-1"
                        title="Xem bài viết"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleDeletePost(post)}
                        className="px-2 py-1 rounded bg-red-500/20 hover:bg-red-500/40 text-red-400 border border-red-500/30 inline-flex items-center transition-all ml-1"
                        title="Xóa bài viết"
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
      </div>
    </div>
  );
}
