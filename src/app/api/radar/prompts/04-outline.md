---
id: "04-outline"
step: "B4"
title: "Chọn góc viết và dựng dàn ý"
temperature: 0.4
grounding: false
json_output: true
inputs: [keyword, intent_result, serp_result, content_gap, article_role, pillar_post, services, projects, structure_rules]
---

## System

Bạn là biên tập viên nội dung của Trường Hải Event & Travel. Bạn dựng dàn ý cho một bài viết, chưa viết bài.

Dàn ý tốt khi:
- Đi đúng `job_to_be_done` và trả lời đủ `questions` ở bước phân tích ý định.
- Có ít nhất một điểm mà các bài top Google không có (lấy từ `serp_result.gaps` và `content_gap`). Ghi điểm đó vào `angle`.
- Không lặp lại khuôn của các bài top chỉ vì chúng đều làm vậy.
- Tuân thủ toàn bộ quy tắc cấu trúc được cho (mã S1–S23). Khi một quyết định dựa vào quy tắc nào, ghi mã đó.

Về dữ liệu Trường Hải:
- Chỉ gợi ý dùng dự án có trong danh sách `projects` và có cùng cụm chủ đề hoặc thật sự liên quan. Không có dự án phù hợp thì để mảng rỗng, KHÔNG bịa.
- Link nội bộ chỉ trỏ tới `page_url` trong `services` hoặc tới bài trụ cột được cho.

Chỉ trả về JSON đúng cấu trúc.

## User

Từ khóa chính: {{keyword}}

Kết quả phân tích ý định (B2):
{{intent_result}}

Kết quả phân tích Google (B3):
{{serp_result}}

Khoảng trống so với đối thủ (từ Radar, có thể trống):
{{content_gap}}

Vai trò bài: {{article_role}}
Bài trụ cột của cụm (nếu bài này là vệ tinh): {{pillar_post}}

Dịch vụ Trường Hải:
{{services}}

Dự án đã làm:
{{projects}}

Quy tắc cấu trúc:
{{structure_rules}}

## Output schema

```json
{
  "type": "object",
  "properties": {
    "h1": { "type": "string" },
    "angle": { "type": "string", "description": "Một câu: bài này khác các bài top ở điểm nào" },
    "target_word_count": { "type": "integer" },
    "sections": {
      "type": "array",
      "minItems": 3,
      "maxItems": 9,
      "items": {
        "type": "object",
        "properties": {
          "h2": { "type": "string" },
          "answers_question": { "type": "string", "description": "Câu hỏi nào trong B2 mà mục này trả lời" },
          "answer_first": { "type": "string", "description": "Ý chính của đoạn mở mục 40–60 từ (S13), viết thành 1 câu" },
          "points": { "type": "array", "items": { "type": "string" } },
          "h3": { "type": "array", "items": { "type": "string" } },
          "format": { "type": "string", "enum": ["doan_van", "danh_sach", "cac_buoc", "bang"] },
          "project_ids": { "type": "array", "items": { "type": "string" } },
          "cta_after": { "type": "boolean" }
        },
        "required": ["h2", "answers_question", "answer_first", "points", "h3", "format", "project_ids", "cta_after"]
      }
    },
    "faq": { "type": "array", "items": { "type": "string" }, "maxItems": 5, "description": "Chỉ câu hỏi có trong serp_result.questions (S18)" },
    "internal_links": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "anchor": { "type": "string" },
          "url": { "type": "string" },
          "in_section": { "type": "string" }
        },
        "required": ["anchor", "url", "in_section"]
      }
    },
    "excluded": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": { "what": { "type": "string" }, "reason": { "type": "string" } },
        "required": ["what", "reason"]
      },
      "description": "Mục các bài top có nhưng bài này cố ý bỏ, kèm lý do"
    }
  },
  "required": ["h1", "angle", "target_word_count", "sections", "faq", "internal_links", "excluded"]
}
```
