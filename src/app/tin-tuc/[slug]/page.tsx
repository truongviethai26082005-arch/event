import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { COMPANY_INFO, MOCK_BLOG_POSTS } from "@/lib/company-data";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import ArticleContentRenderer from "@/components/ArticleContentRenderer";
import {
  Calendar,
  Phone,
  Sparkles,
  ChevronRight,
  ArrowLeft,
  Share2,
  Tag,
  CheckCircle2,
  Clock,
  ShieldCheck,
} from "lucide-react";

import { ensureAccentedKeyword } from "@/app/api/radar/services/vietnamese-diacritics";
import { toSentenceCase } from "@/app/api/radar/services/content-generator";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return MOCK_BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

async function getPostBySlug(slug: string) {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("slug", slug)
        .single();

      if (!error && data) return data;
    } catch (e) {
      console.warn("Supabase query error:", e);
    }
  }

  // Fallback to mock data
  const found = MOCK_BLOG_POSTS.find((p) => p.slug === slug);
  return found || null;
}

export default async function BlogPostDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const rawTitle = post.title || "";
  const displayTitle = toSentenceCase(ensureAccentedKeyword(rawTitle));
  const rawKeyword = post.focus_keyword || "";
  const displayKeyword = rawKeyword ? ensureAccentedKeyword(rawKeyword) : "Cẩm nang sự kiện";

  const relatedPosts = MOCK_BLOG_POSTS.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-xs text-slate-500 mb-8">
          <Link href="/" className="hover:text-[#0A1E5E] transition-colors">
            Trang chủ
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/tin-tuc" className="hover:text-[#0A1E5E] transition-colors">
            Tin tức & Cẩm nang
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-800 font-medium truncate max-w-xs sm:max-w-md">
            {displayTitle}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Article Content */}
          <article className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm">
            {/* Header / Meta */}
            <header className="space-y-4 pb-8 border-b border-slate-200">
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-[#0A1E5E] font-bold border border-blue-200">
                  <Tag className="w-3 h-3 mr-1 text-[#D4AF37]" />
                  {displayKeyword}
                </span>
                <span className="text-slate-400">•</span>
                <span className="flex items-center text-slate-500">
                  <Calendar className="w-3.5 h-3.5 mr-1" />
                  {post.created_at
                    ? new Date(post.created_at).toLocaleDateString("vi-VN")
                    : "Hôm nay"}
                </span>
                <span className="text-slate-400">•</span>
                <span className="flex items-center text-slate-500">
                  <Clock className="w-3.5 h-3.5 mr-1" />
                  5 phút đọc
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#0A1E5E] leading-tight">
                {displayTitle}
              </h1>
            </header>

            {/* Article Body */}
            <div className="py-8">
              <ArticleContentRenderer content={post.content || ""} />
            </div>

            {/* Author / Company Brand Box */}
            <div className="mt-10 p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-amber-50/50 border border-[#D4AF37]/30 flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white border border-[#D4AF37]/40 flex items-center justify-center shrink-0 shadow-md overflow-hidden">
                <Image
                  src="/images/logo.png"
                  alt="Logo Trường Hải Event & Travel"
                  width={112}
                  height={112}
                  className="w-full h-full object-contain scale-125"
                />
              </div>
              <div className="space-y-1 text-center sm:text-left">
                <h4 className="font-bold text-[#0A1E5E] text-sm">
                  Ban Biên Tập - {COMPANY_INFO.name}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Đơn vị chuyên nghiệp hàng đầu trong lĩnh vực tổ chức sự kiện trọn gói, đại lễ khánh thành, tiệc tất niên YEP và tour du lịch doanh nghiệp tại Hà Nội & Toàn Quốc.
                </p>
                <p className="text-xs text-[#0A1E5E] font-semibold pt-1">
                  Hotline 24/7:{" "}
                  <a href={`tel:${COMPANY_INFO.hotline}`} className="underline text-[#D4AF37] font-bold">
                    {COMPANY_INFO.hotlineDisplay}
                  </a>
                </p>
              </div>
            </div>

            {/* Back link */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
              <Link
                href="/tin-tuc"
                className="inline-flex items-center text-xs font-bold text-[#0A1E5E] hover:text-[#D4AF37] transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                Quay lại danh sách bài viết
              </Link>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-8">
            {/* Quick Contact Card */}
            <div className="bg-[#0A1E5E] text-white p-6 rounded-3xl shadow-lg border border-[#D4AF37]/30 relative overflow-hidden">
              <div className="space-y-4 relative z-10">
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 text-xs text-[#D4AF37] font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Tư Vấn Miễn Phí</span>
                </span>

                <h3 className="text-xl font-black text-white">
                  Bạn Cần Tổ Chức Sự Kiện Tương Tự?
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed font-light">
                  Trường Hải Event & Travel sẵn sàng khảo sát thực tế và lên báo giá chi tiết, kịch bản độc bản chỉ trong 30 phút.
                </p>

                <div className="pt-2 space-y-3">
                  <a
                    href={`tel:${COMPANY_INFO.hotline}`}
                    className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-[#D4AF37] to-amber-400 text-[#0A1E5E] shadow-md flex items-center justify-center space-x-2"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Gọi {COMPANY_INFO.hotlineDisplay}</span>
                  </a>

                  <Link
                    href="/dich-vu#bao-gia"
                    className="w-full py-3 px-4 rounded-xl font-semibold text-xs bg-white/10 hover:bg-white/20 text-white border border-white/20 flex items-center justify-center transition-colors"
                  >
                    Nhận Báo Giá Online
                  </Link>
                </div>
              </div>
            </div>

            {/* Related Posts */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-base text-[#0A1E5E] mb-4 pb-2 border-b border-slate-100">
                Bài Viết Cùng Chủ Đề
              </h3>
              <div className="space-y-4">
                {relatedPosts.map((rel) => (
                  <div key={rel.id} className="group">
                    <span className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-wider block mb-1">
                      {rel.focus_keyword}
                    </span>
                    <h4 className="text-xs font-bold text-slate-800 group-hover:text-[#0A1E5E] transition-colors leading-snug">
                      <Link href={`/tin-tuc/${rel.slug}`}>
                        {rel.title}
                      </Link>
                    </h4>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
