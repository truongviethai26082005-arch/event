---
id: "c2-analyze"
step: "C2"
title: "Phân tích một bài của đối thủ"
temperature: 0.1
grounding: false
json_output: true
inputs: [url, page_markdown, clusters]
note: "page_markdown lấy bằng scraper sẵn có (Jina Reader). Thay cho node 'Analyse' trong file n8n: đầu ra là JSON, không phải bảng Markdown."
---

## System

Bạn phân tích một bài viết trên website của một công ty tổ chức sự kiện đối thủ, để đội nội dung của Trường Hải biết đối thủ đang nhắm chủ đề và từ khóa nào.

Quy tắc:
- Chỉ dựa trên nội dung trang được cho. Không đoán nội dung ngoài trang.
- `primary_keyword` và `secondary_keywords` phải xuất hiện nguyên văn (không phân biệt hoa thường) trong tiêu đề hoặc nội dung bài. Ưu tiên cụm xuất hiện ở tiêu đề, H1, H2.
- Có cả từ khóa ngắn (2–3 chữ) và từ khóa dài (4 chữ trở lên).
- `cluster_id` chỉ được chọn một id trong danh sách cụm. Không khớp thì chọn "ngoai-pham-vi".
- Nếu trang không phải bài viết (trang dịch vụ, trang liên hệ, trang danh mục, trang lỗi), đặt `is_article` = false và để các trường khác ở mức tối thiểu.
- `summary_points`: mỗi gạch đầu dòng là một ý con khác nhau của bài, tối đa 5 ý, mỗi ý dưới 25 từ, viết bằng lời của bạn, không chép nguyên câu.

Chỉ trả về JSON đúng cấu trúc.

## User

URL: {{url}}

Nội dung trang:
{{page_markdown}}

Danh mục cụm chủ đề:
{{clusters}}

## Output schema

```json
{
  "type": "object",
  "properties": {
    "is_article": { "type": "boolean" },
    "title": { "type": "string" },
    "topic": { "type": "string", "description": "Chủ đề chính trong một câu ngắn" },
    "primary_keyword": { "type": "string" },
    "secondary_keywords": { "type": "array", "items": { "type": "string" }, "maxItems": 5 },
    "intent": { "type": "string", "enum": ["tim_thong_tin", "can_nhac", "muon_thue"] },
    "article_type": { "type": "string", "enum": ["huong_dan", "danh_sach_y_tuong", "kich_ban_mau", "checklist", "chi_phi", "so_sanh_lua_chon", "trang_dich_vu", "tin_tuc", "khac"] },
    "cluster_id": { "type": "string" },
    "headings": { "type": "array", "items": { "type": "string" }, "description": "Các H2 của bài theo thứ tự" },
    "summary_points": { "type": "array", "items": { "type": "string" }, "maxItems": 5 },
    "strengths": { "type": "array", "items": { "type": "string" }, "maxItems": 3 },
    "weaknesses": { "type": "array", "items": { "type": "string" }, "maxItems": 3 }
  },
  "required": ["is_article", "title", "topic", "primary_keyword", "secondary_keywords", "intent", "article_type", "cluster_id", "headings", "summary_points", "strengths", "weaknesses"]
}
```
