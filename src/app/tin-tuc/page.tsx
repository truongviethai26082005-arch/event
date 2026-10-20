"use client";

/**
 * =========================================================================
 * KHU VỰC DÀNH CHO THÀNH VIÊN 3: MẢNG TIN TỨC / HIỂN THỊ BLOG SEO
 * Lưu ý: Thành viên 3 chỉ được phép chỉnh sửa các file bên trong src/app/tin-tuc/
 * =========================================================================
 */

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { COMPANY_INFO, MOCK_BLOG_POSTS } from "@/lib/company-data";
import { supabase, isSupabaseConfigured, DatabasePost } from "@/lib/supabase";
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
} from "lucide-react";

export default function BlogListPage() {
  const [posts, setPosts] = useState<any[]>(MOCK_BLOG_POSTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("all");
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

        if (!error && data && data.length > 0) {
          setPosts(data);
        }
      } catch (err) {
        console.warn("Dùng dữ liệu mẫu cho bài viết SEO:", err);
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

    if (selectedTag === "all") return matchesSearch;
    return matchesSearch && post.focus_keyword?.toLowerCase().includes(selectedTag.toLowerCase());
  });

  const featuredPost = filteredPosts[0] || posts[0];
  const regularPosts = filteredPosts.slice(1);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Banner */}
      <div className="bg-[#0A1E5E] text-white py-14 border-b border-[#D4AF37]/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#06123B] via-[#0A1E5E] to-[#122868] opacity-90" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
          <span className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-[#D4AF37] border border-[#D4AF37]/40">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Cẩm Nang & Xu Hướng Sự Kiện - Du Lịch Chuẩn SEO</span>
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white">
            Tin Tức & Cẩm Nang Chuyên Sâu
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-light">
            Chia sẻ kinh nghiệm tổ chức sự kiện, ý tưởng tiệc tất niên độc đáo, cẩm nang tour du lịch và các bài viết phân tích xu hướng mới nhất từ chuyên gia Trường Hải Event & Travel.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search & Filter Bar */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Tìm kiếm bài viết theo tiêu đề, từ khóa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs outline-none focus:ring-2 focus:ring-[#0A1E5E]"
            />
          </div>

          {/* Tag filters */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 md:pb-0 text-xs">
            <button
              onClick={() => setSelectedTag("all")}
              className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-colors ${selectedTag === "all"
                  ? "bg-[#0A1E5E] text-[#D4AF37]"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setSelectedTag("khai trương")}
              className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-colors ${selectedTag === "khai trương"
                  ? "bg-[#0A1E5E] text-[#D4AF37]"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
            >
              Khai trương
            </button>
            <button
              onClick={() => setSelectedTag("year end party")}
              className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-colors ${selectedTag === "year end party"
                  ? "bg-[#0A1E5E] text-[#D4AF37]"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
            >
              Year End Party
            </button>
            <button
              onClick={() => setSelectedTag("team building")}
              className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-colors ${selectedTag === "team building"
                  ? "bg-[#0A1E5E] text-[#D4AF37]"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
            >
              Team Building & Tour
            </button>
          </div>
        </div>

        {/* Featured Post Card */}
        {featuredPost && (
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-md hover:shadow-xl transition-all mb-12 group">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              <div className="lg:col-span-7 h-64 sm:h-80 lg:h-auto relative overflow-hidden bg-slate-900">
                <img
                  src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80"
                  alt={featuredPost.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                />
                <div className="absolute top-4 left-4 px-3 py-1 rounded-md bg-[#0A1E5E] text-[#D4AF37] text-xs font-bold border border-[#D4AF37]/30 flex items-center">
                  <TrendingUp className="w-3.5 h-3.5 mr-1 text-[#D4AF37]" />
                  Bài Viết Tiêu Biểm
                </div>
              </div>

              <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-xs text-slate-500">
                    <span className="flex items-center text-[#0A1E5E] font-semibold bg-blue-50 px-2.5 py-1 rounded-lg">
                      <Tag className="w-3 h-3 mr-1 text-[#D4AF37]" />
                      {featuredPost.focus_keyword || "Sự kiện"}
                    </span>
                    <span>•</span>
                    <span className="flex items-center">
                      <Calendar className="w-3.5 h-3.5 mr-1" />
                      {featuredPost.created_at
                        ? new Date(featuredPost.created_at).toLocaleDateString("vi-VN")
                        : "Hôm nay"}
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-black text-[#0A1E5E] group-hover:text-[#D4AF37] transition-colors leading-snug">
                    <Link href={`/tin-tuc/${featuredPost.slug}`}>
                      {featuredPost.title}
                    </Link>
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-4 leading-relaxed font-light">
                    {featuredPost.meta_description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Trường Hải Event & Travel</span>
                  <Link
                    href={`/tin-tuc/${featuredPost.slug}`}
                    className="inline-flex items-center font-bold text-xs text-[#0A1E5E] group-hover:text-[#D4AF37] transition-colors"
                  >
                    <span>Đọc toàn bộ bài viết</span>
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Regular Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              <div className="h-48 relative overflow-hidden bg-slate-900">
                <img
                  src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80"
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                />
                <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-md bg-[#0A1E5E]/90 text-[#D4AF37] text-[11px] font-bold border border-[#D4AF37]/30">
                  {post.focus_keyword || "Tin Tức"}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {post.created_at
                        ? new Date(post.created_at).toLocaleDateString("vi-VN")
                        : "Mới xuất bản"}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-[#0A1E5E] group-hover:text-[#D4AF37] transition-colors line-clamp-2">
                    <Link href={`/tin-tuc/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {post.meta_description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Bởi Ban Biên Tập</span>
                  <Link
                    href={`/tin-tuc/${post.slug}`}
                    className="inline-flex items-center text-xs font-bold text-[#0A1E5E] group-hover:text-[#D4AF37] transition-colors"
                  >
                    <span>Xem tiếp</span>
                    <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-700">Chưa tìm thấy bài viết phù hợp</h3>
            <p className="text-xs text-slate-500 mt-1">
              Thử tìm kiếm với từ khóa khác hoặc chuyển sang chế độ "Tất cả".
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
