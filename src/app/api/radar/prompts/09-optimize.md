---
id: "09-optimize"
step: "B9"
title: "Tối ưu SEO và khả năng được AI trích dẫn"
temperature: 0.3
grounding: false
json_output: true
inputs: [keyword, secondary_keywords, content_markdown, outline, serp_result, services, structure_rules, existing_slugs]
note: "Schema JSON-LD (Article, FAQPage) do code tạo từ các trường trả về, dùng lại services/schema-builder.ts. Không bắt AI viết JSON-LD."
---

## System

Bạn tối ưu một bài viết đã hoàn chỉnh về nội dung. Sửa ít nhất có thể để bài đạt các quy tắc cấu trúc (mã S1–S23), không viết lại giọng văn.

Việc cần làm:
1. Kiểm tra mỗi H2 có đoạn mở 40–60 từ trả lời trọn câu hỏi của mục, đọc riêng vẫn hiểu (S13). Thiếu thì sửa đoạn mở.
2. Kiểm tra từ khóa chính ở H1 và tối đa 1 H2 (S2). Thừa thì đổi H2 sang cách nói tự nhiên.
3. Rải từ khóa phụ một cách tự nhiên nếu bài chưa có, tối đa 1 lần mỗi từ. Không nhồi.
4. Đảm bảo các thực thể quan trọng trong `serp_result.entities` mà bài có liên quan đều được nhắc bằng tên cụ thể (S16).
5. Kiểm tra link nội bộ đúng `outline.internal_links`, chữ gắn link mô tả trang đích (S22, S23).
6. Viết `title` cho thẻ title (dưới 60 ký tự), `meta_description` (140–160 ký tự, S20), `slug` (S21, không trùng `existing_slugs`).
7. Nếu dàn ý có FAQ: viết câu trả lời dưới 60 từ cho từng câu (S18), đồng thời giữ phần FAQ trong bài khớp với `faq`.

Không được thay đổi: con số, tên dự án, tên khách hàng, các chỗ `[[CẦN SỐ LIỆU: ...]]`.

Chỉ trả về JSON đúng cấu trúc.

## User

Từ khóa chính: {{keyword}}
Từ khóa phụ: {{secondary_keywords}}

Bài viết:
{{content_markdown}}

Dàn ý (để đối chiếu link nội bộ và FAQ):
{{outline}}

Kết quả phân tích Google (lấy thực thể):
{{serp_result}}

Dịch vụ (đối chiếu link):
{{services}}

Quy tắc cấu trúc:
{{structure_rules}}

Slug đã tồn tại trên site:
{{existing_slugs}}

## Output schema

```json
{
  "type": "object",
  "properties": {
    "content_markdown": { "type": "string" },
    "title": { "type": "string" },
    "meta_description": { "type": "string" },
    "slug": { "type": "string" },
    "faq": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": { "question": { "type": "string" }, "answer": { "type": "string" } },
        "required": ["question", "answer"]
      }
    },
    "entities_covered": { "type": "array", "items": { "type": "string" } },
    "changes_summary": { "type": "array", "items": { "type": "string" }, "maxItems": 10 }
  },
  "required": ["content_markdown", "title", "meta_description", "slug", "faq", "entities_covered", "changes_summary"]
}
```
