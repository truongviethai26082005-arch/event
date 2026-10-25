"use client";

import { useEffect } from "react";

/**
 * HashScrollHandler
 * Tự động lắng nghe thay đổi hash trên URL (khi vào trang hoặc khi bấm link menu nội bộ)
 * và cuộn mượt mà trực tiếp đến phần tử có id tương ứng.
 */
export default function HashScrollHandler() {
  useEffect(() => {
    const scrollToHash = () => {
      if (typeof window === "undefined") return;
      const rawHash = window.location.hash;
      if (!rawHash) return;

      const id = rawHash.replace("#", "");
      if (!id) return;

      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 120);
      }
    };

    // Kiểm tra ngay khi mount
    scrollToHash();

    window.addEventListener("hashchange", scrollToHash);
    return () => window.removeEventListener("hashchange", scrollToHash);
  }, []);

  return null;
}
