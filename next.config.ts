import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  // Radar SEO đọc quy tắc viết (rules/*.md) và Bộ não (brand/*.json) bằng fs lúc chạy:
  // khai báo để Vercel đóng gói kèm các file này vào hàm máy chủ.
  outputFileTracingIncludes: {
    "/*": ["src/app/api/radar/rules/**/*", "src/app/api/radar/brand/**/*.json"],
  },
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
