"use client";

/**
 * =========================================================================
 * KHU VỰC DÀNH CHO THÀNH VIÊN 3: MẢNG TIN TỨC / HIỂN THỊ BLOG SEO
 * Cấu trúc mới: 2 cột (Main + Sidebar) theo chuẩn VietPower Blog
 * =========================================================================
 */

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { COMPANY_INFO, MOCK_BLOG_POSTS } from "@/lib/company-data";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import {
  FileText,
  Calendar,
  Clock,
  Search,
  Sparkles,
  ChevronRight,
  Tag,
  ArrowRight,
  TrendingUp,
  BookOpen,
  Phone,
  Layers,
} from "lucide-react";

const CATEGORIES = [
  { label: "Tất Cả", value: "all" },
  { label: "Khai Trương & Khánh Thành", value: "khai trương" },
  { label: "Year End Party & Gala", value: "year end party" },
  { label: "Team Building & Tour", value: "team building" },
  { label: "Hội Nghị & Hội Thảo", value: "hội nghị" },
  { label: "Kinh Nghiệm Tổ Chức", value: "kinh nghiệm" },
];

export default function BlogListPage() {
  const [posts, setPosts] = useState<any[]>(MOCK_BLOG_POSTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadPublishedPosts() {
      if (!isSupabaseConfigured) return;
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("posts")
          .select("*")
          .eq("status", "published")
          .order("created_at", { ascending: false });
        if (!error && data && data.length > 0) setPosts(data);
      } catch (err) {
        console.warn("Dùng dữ liệu mẫu:", err);
      } finally {
        setLoading(false);
      }
    }
    loadPublishedPosts();
  }, []);

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.meta_description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.focus_keyword?.toLowerCase().includes(searchTerm.toLowerCase());
    if (selectedCategory === "all") return matchesSearch;
    return matchesSearch && post.focus_keyword?.toLowerCase().includes(selectedCategory.toLowerCase());
  });

  const featuredPost = filteredPosts[0] || posts[0];
  const regularPosts = filteredPosts.slice(1);
  const recentPosts = posts.slice(0, 5);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Mới xuất bản";
    return new Date(dateStr).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Banner */}
      <div className="bg-[#0A1E5E] text-white py-10 border-b border-[#D4AF37]/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#06123B] via-[#0A1E5E] to-[#122868] opacity-90" />
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <nav className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-4">
            <Link href="/" className="hover:text-[#D4AF37] transition-colors">Trang chủ</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#D4AF37] font-semibold">Tin Tức & Cẩm Nang</span>
          </nav>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[11px] font-bold text-[#D4AF37] border border-[#D4AF37]/40">
                <Sparkles className="w-3 h-3" />
                Cẩm Nang & Xu Hướng Sự Kiện - Du Lịch Chuẩn SEO
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight">
                Tin Tức & Cẩm Nang Chuyên Sâu
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl font-light leading-relaxed">
                Kinh nghiệm tổ chức sự kiện, ý tưởng gala, tour du lịch và xu hướng mới nhất từ chuyên gia Trường Hải Event & Travel.
              </p>
            </div>
            <div className="shrink-0 text-xs text-slate-400">
              <span className="text-[#D4AF37] font-bold text-lg">{filteredPosts.length}</span> bài viết
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap border cursor-pointer ${
                selectedCategory === cat.value
                  ? "bg-[#0A1E5E] text-[#D4AF37] border-[#0A1E5E] shadow-md"
                  : "bg-white text-slate-600 border-slate-200 hover:border-[#0A1E5E] hover:text-[#0A1E5E]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Featured Post */}
        {featuredPost && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-md hover:shadow-xl transition-all mb-10 group">
            <div className="grid grid-cols-1 lg:grid-cols-5">
              <div className="lg:col-span-3 h-60 sm:h-72 lg:h-auto relative overflow-hidden bg-slate-900">
                <img
                  src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80"
                  alt={featuredPost.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <div className="absolute top-4 left-4 px-3 py-1 rounded-md bg-[#D4AF37] text-[#0A1E5E] text-[11px] font-black flex items-center gap-1 shadow">
                  <TrendingUp className="w-3 h-3" />
                  Bài Viết Nổi Bật
                </div>
              </div>
              <div className="lg:col-span-2 p-7 sm:p-8 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 flex-wrap">
                    <span className="flex items-center gap-1 text-[#0A1E5E] font-semibold bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                      <Tag className="w-3 h-3 text-[#D4AF37]" />
                      {featuredPost.focus_keyword || "Sự kiện"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(featuredPost.created_at)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />5 phút đọc
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-black text-[#0A1E5E] group-hover:text-[#D4AF37] transition-colors leading-snug">
                    <Link href={`/tin-tuc/${featuredPost.slug}`}>{featuredPost.title}</Link>
                  </h2>
                  <p className="text-xs text-slate-600 line-clamp-4 leading-relaxed">{featuredPost.meta_description}</p>
                </div>
                <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium">Trường Hải Event & Travel</span>
                  <Link
                    href={`/tin-tuc/${featuredPost.slug}`}
                    className="inline-flex items-center gap-1 font-bold text-xs text-[#0A1E5E] hover:text-[#D4AF37] transition-colors bg-slate-50 hover:bg-amber-50 px-3 py-2 rounded-lg border border-slate-200 hover:border-[#D4AF37]"
                  >
                    Đọc bài viết
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2-Column Layout: Articles + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Articles Grid */}
          <div className="lg:col-span-2">
            {regularPosts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {regularPosts.map((post) => (
                  <article
                    key={post.id}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group"
                  >
                    <div className="h-44 relative overflow-hidden bg-slate-900 shrink-0">
                      <img
                        src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80"
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                      <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-[#0A1E5E]/90 text-[#D4AF37] text-[10px] font-bold">
                        {post.focus_keyword || "Tin Tức"}
                      </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[11px] text-slate-400">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(post.created_at)}</span>
                          <span>·</span>
                          <Clock className="w-3 h-3" />
                          <span>4 phút</span>
                        </div>
                        <h3 className="font-bold text-sm text-[#0A1E5E] group-hover:text-[#D4AF37] transition-colors line-clamp-2 leading-snug">
                          <Link href={`/tin-tuc/${post.slug}`}>{post.title}</Link>
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">{post.meta_description}</p>
                      </div>
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[11px] text-slate-400">Ban Biên Tập</span>
                        <Link
                          href={`/tin-tuc/${post.slug}`}
                          className="inline-flex items-center gap-0.5 text-[11px] font-bold text-[#0A1E5E] hover:text-[#D4AF37] transition-colors"
                        >
                          Xem thêm <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-700">Chưa tìm thấy bài viết</h3>
                <p className="text-xs text-slate-500 mt-1">Thử chọn danh mục khác hoặc xóa bộ lọc.</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-6">

            {/* Search */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <h4 className="text-sm font-black text-[#0A1E5E] mb-3 flex items-center gap-2">
                <Search className="w-4 h-4 text-[#D4AF37]" />
                Tìm Kiếm Bài Viết
              </h4>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Nhập từ khóa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-[#0A1E5E]/30 focus:border-[#0A1E5E] transition"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <h4 className="text-sm font-black text-[#0A1E5E] mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#D4AF37]" />
                Danh Mục Bài Viết
              </h4>
              <ul className="space-y-1">
                {CATEGORIES.map((cat) => (
                  <li key={cat.value}>
                    <button
                      onClick={() => setSelectedCategory(cat.value)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        selectedCategory === cat.value
                          ? "bg-[#0A1E5E] text-[#D4AF37]"
                          : "text-slate-600 hover:bg-slate-50 hover:text-[#0A1E5E]"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <ChevronRight className="w-3 h-3" />
                        {cat.label}
                      </span>
                      <span className="text-[10px] opacity-60">
                        {cat.value === "all"
                          ? posts.length
                          : posts.filter((p) => p.focus_keyword?.toLowerCase().includes(cat.value)).length}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recent Posts */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <h4 className="text-sm font-black text-[#0A1E5E] mb-4 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#D4AF37]" />
                Bài Viết Mới Nhất
              </h4>
              <ul className="space-y-3">
                {recentPosts.map((post, idx) => (
                  <li key={post.id}>
                    <Link href={`/tin-tuc/${post.slug}`} className="flex items-start gap-3 group">
                      <div className="w-16 h-12 rounded-lg overflow-hidden shrink-0 bg-slate-100">
                        <img
                          src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=200&q=80"
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-700 group-hover:text-[#0A1E5E] line-clamp-2 leading-snug transition-colors">
                          {post.title}
                        </p>
                        <span className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                          <Calendar className="w-2.5 h-2.5" />
                          {formatDate(post.created_at)}
                        </span>
                      </div>
                    </Link>
                    {idx < recentPosts.length - 1 && <div className="border-t border-slate-100 mt-3" />}
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Hotline */}
            <div className="bg-gradient-to-br from-[#0A1E5E] to-[#142a6d] rounded-2xl p-5 text-white text-center space-y-3 shadow-lg">
              <div className="w-10 h-10 mx-auto rounded-xl bg-[#D4AF37]/20 flex items-center justify-center">
                <Phone className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <h4 className="font-black text-sm text-white">Cần Tư Vấn Ngay?</h4>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Chuyên gia Trường Hải sẵn sàng hỗ trợ 24/7, kể cả ngày lễ và cuối tuần.
              </p>
              <a
                href={`tel:${COMPANY_INFO.hotline}`}
                className="block w-full py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#b89528] text-[#0A1E5E] font-black text-xs hover:brightness-110 transition shadow-md"
              >
                Gọi: {COMPANY_INFO.hotlineDisplay}
              </a>
            </div>

          </aside>
        </div>
      </div>
    </div>
  );
}
