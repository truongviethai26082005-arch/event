import type { MetadataRoute } from "next";
import { connection } from "next/server";
import { COMPANY_INFO, MOCK_BLOG_POSTS } from "@/lib/company-data";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connection();

  const baseUrl = COMPANY_INFO.website.replace(/\/+$/, "");
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/ve-chung-toi`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/ho-so-nang-luc`, changeFrequency: "weekly", priority: 0.85 },
    { url: `${baseUrl}/dich-vu`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/tin-tuc`, changeFrequency: "daily", priority: 0.8 },
  ];

  const postsBySlug = new Map(
    MOCK_BLOG_POSTS.map((post) => [
      post.slug,
      { slug: post.slug, lastModified: post.created_at },
    ])
  );

  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from("posts")
      .select("slug, created_at")
      .eq("status", "published");

    if (error) {
      console.error("Không thể tải bài viết đã xuất bản để tạo sitemap:", error);
    } else {
      for (const post of data ?? []) {
        postsBySlug.set(post.slug, {
          slug: post.slug,
          lastModified: post.created_at,
        });
      }
    }
  }

  const postRoutes: MetadataRoute.Sitemap = Array.from(postsBySlug.values()).map(
    (post) => ({
      url: `${baseUrl}/tin-tuc/${encodeURIComponent(post.slug)}`,
      lastModified: post.lastModified ? new Date(post.lastModified) : undefined,
      changeFrequency: "monthly",
      priority: 0.6,
    })
  );

  return [...staticRoutes, ...postRoutes];
}
