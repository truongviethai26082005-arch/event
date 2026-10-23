/**
 * BỘ TỰ ĐỘNG XUẤT SCHEMA.ORG / FAQPAGE (JSON-LD)
 * Đảm bảo Google lập chỉ mục Featured Snippets & AI Overview chính xác
 * Phạm vi: Nội bộ src/app/api/radar/services/schema-builder.ts
 */

import { FaqItem } from "./types";

/**
 * Xây dựng chuỗi JSON-LD Schema.org/FAQPage chuẩn SEO từ danh sách FAQ
 */
export function buildFaqPageSchema(faqList: FaqItem[]): string {
  if (!faqList || faqList.length === 0) return "";

  const validFaqs = faqList.filter((f) => f.question && (f.answer || f.answer_guideline));
  if (validFaqs.length === 0) return "";

  const mainEntity = validFaqs.map((faq) => ({
    "@type": "Question",
    name: faq.question.trim(),
    acceptedAnswer: {
      "@type": "Answer",
      text: (faq.answer || faq.answer_guideline || "").trim(),
    },
  }));

  const schemaObj = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity,
  };

  return `<script type="application/ld+json">\n${JSON.stringify(schemaObj, null, 2)}\n</script>`;
}
