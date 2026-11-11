"use client";

import { useEffect } from "react";

/**
 * Component chuyên dụng cho phân hệ admin-radar
 * Dùng để ẩn cụm 4 nút liên hệ nhanh nổi (Facebook, Messenger, Zalo, Hotline)
 * chỉ trong phạm vi phân hệ admin-radar, tự động khôi phục hoàn toàn khi rời khỏi phân hệ,
 * đảm bảo tuân thủ tuyệt đối quy định không đụng chạm đến file của phân hệ khác hay file chung.
 */
export default function FloatingContactHider() {
  useEffect(() => {
    // 1. Ẩn trực tiếp DOM element nếu đã mount
    const hideTarget = () => {
      const widget = document.querySelector('aside[aria-label="Kênh liên hệ nhanh"]');
      if (widget) {
        (widget as HTMLElement).style.setProperty("display", "none", "important");
      }
    };

    hideTarget();

    // 2. Chèn style tag bảo đảm không bị hiện lại do hydration/re-render
    const styleId = "admin-radar-hide-contact-widget";
    let styleTag = document.getElementById(styleId) as HTMLStyleElement | null;
    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = styleId;
      styleTag.textContent = `
        aside[aria-label="Kênh liên hệ nhanh"] {
          display: none !important;
        }
      `;
      document.head.appendChild(styleTag);
    }

    // 3. Khôi phục trạng thái nguyên vẹn khi chuyển khỏi phân hệ admin-radar
    return () => {
      if (styleTag && styleTag.parentNode) {
        styleTag.remove();
      }
      document.querySelectorAll("style").forEach((s) => {
        if (s.textContent?.includes('aside[aria-label="Kênh liên hệ nhanh"]')) {
          s.remove();
        }
      });
      const widget = document.querySelector('aside[aria-label="Kênh liên hệ nhanh"]');
      if (widget) {
        (widget as HTMLElement).style.removeProperty("display");
      }
    };
  }, []);

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `aside[aria-label="Kênh liên hệ nhanh"] { display: none !important; }`,
      }}
    />
  );
}
