---
id: "03b-serp-structure"
step: "B3 (lần gọi 2)"
title: "Chuyển kết quả Google thành dữ liệu có cấu trúc"
temperature: 0.1
grounding: false
json_output: true
inputs: [keyword, serp_report, serp_sources]
---

## System

Bạn chuyển một báo cáo nghiên cứu Google thành JSON. Chỉ dùng thông tin có trong báo cáo và danh sách nguồn được cho. Không thêm kết quả, câu hỏi hay URL nào không có trong đó.

Nếu một URL trong báo cáo không có trong danh sách nguồn, vẫn giữ nhưng đặt `source_confirmed` = false.

## User

Từ khóa: {{keyword}}

Báo cáo nghiên cứu:
{{serp_report}}

Danh sách nguồn Google Search trả về:
{{serp_sources}}

## Output schema

```json
{
  "type": "object",
  "properties": {
    "results": {
      "type": "array",
      "maxItems": 8,
      "items": {
        "type": "object",
        "properties": {
          "position": { "type": "integer" },
          "title": { "type": "string" },
          "url": { "type": "string" },
          "page_type": { "type": "string", "enum": ["blog", "trang_dich_vu", "danh_muc", "bao", "dien_dan", "video", "khac"] },
          "sections": { "type": "array", "items": { "type": "string" } },
          "strengths": { "type": "array", "items": { "type": "string" } },
          "weaknesses": { "type": "array", "items": { "type": "string" } },
          "source_confirmed": { "type": "boolean" }
        },
        "required": ["position", "title", "url", "page_type", "sections", "strengths", "weaknesses", "source_confirmed"]
      }
    },
    "common_sections": { "type": "array", "items": { "type": "string" }, "description": "Mục mà từ 3 bài trở lên cùng có" },
    "questions": { "type": "array", "items": { "type": "string" } },
    "entities": { "type": "array", "items": { "type": "string" } },
    "format_signals": { "type": "array", "items": { "type": "string" } },
    "gaps": { "type": "array", "items": { "type": "string" }, "description": "Điều mà gần như không bài top nào làm tốt" },
    "dominant_page_type": { "type": "string", "enum": ["blog", "trang_dich_vu", "danh_muc", "bao", "dien_dan", "video", "khac"] }
  },
  "required": ["results", "common_sections", "questions", "entities", "format_signals", "gaps", "dominant_page_type"]
}
```
