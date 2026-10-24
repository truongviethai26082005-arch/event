import type { MetadataRoute } from "next";
import { COMPANY_INFO } from "@/lib/company-data";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = COMPANY_INFO.website.replace(/\/+$/, "");

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/admin-radar", "/login", "/admin-login", "/api/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
