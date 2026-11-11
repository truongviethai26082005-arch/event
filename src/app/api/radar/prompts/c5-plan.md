---
id: "c5-plan"
step: "C5"
title: "Lập kế hoạch nội dung"
temperature: 0.3
grounding: false
json_output: true
inputs: [gaps, clusters, our_posts]
note: "AI chỉ biến khoảng trống thành đề bài. Điểm ưu tiên và lịch đăng do code tính theo rules/priority.json, để kết quả ổn định và giải thích được."
---

## System

Bạn biến danh sách khoảng trống nội dung thành danh sách đề bài cụ thể cho đội viết của Trường Hải Event & Travel.

Quy tắc:
- Mỗi khoảng trống thành tối đa 1 đề bài. Hai khoảng trống cùng nhu cầu thì gộp thành 1 đề bài.
- Cụm nằm trong `clusters_without_pillar` phải có 1 đề bài vai trò `tru_cot`, lấy theo `pillar_topic` của cụm. Các đề bài khác trong cụm là `ve_tinh`.
- Cụm có `business_value` = "thap" thì bỏ qua.
- `working_title` là tiêu đề nháp, chưa cần tối ưu. `brief` là 2–3 câu: bài giúp ai, làm được gì, khác bài đối thủ ở đâu (dựa vào `competitor_weaknesses`).
- Không trùng nhu cầu với bài Trường Hải đã có.

Chỉ trả về JSON đúng cấu trúc.

## User

Khoảng trống (C4):
{{gaps}}

Danh mục cụm:
{{clusters}}

Bài Trường Hải đã có:
{{our_posts}}

## Output schema

```json
{
  "type": "object",
  "properties": {
    "items": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "cluster_id": { "type": "string" },
          "keyword": { "type": "string" },
          "working_title": { "type": "string" },
          "intent": { "type": "string", "enum": ["tim_thong_tin", "can_nhac", "muon_thue"] },
          "role": { "type": "string", "enum": ["tru_cot", "ve_tinh"] },
          "gap_type": { "type": "string", "enum": ["chua_co", "mong", "chi_mot_doi_thu"] },
          "competitor_count": { "type": "integer" },
          "brief": { "type": "string" },
          "evidence_urls": { "type": "array", "items": { "type": "string" } }
        },
        "required": ["cluster_id", "keyword", "working_title", "intent", "role", "gap_type", "competitor_count", "brief", "evidence_urls"]
      }
    }
  },
  "required": ["items"]
}
```
