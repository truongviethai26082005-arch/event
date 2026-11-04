---
id: "c4-gap"
step: "C4"
title: "Tìm khoảng trống nội dung"
temperature: 0.2
grounding: false
json_output: true
inputs: [cluster_matrix, competitor_topics, our_posts, clusters]
note: "Code tổng hợp trước rồi mới gọi AI: cluster_matrix = số bài mỗi đối thủ trong mỗi cụm; competitor_topics = danh sách {cluster_id, primary_keyword, topic, intent, competitor, url} từ C2 (bỏ is_article = false và ngoai-pham-vi); our_posts = bài đã đăng và bản nháp của Trường Hải. Gọi 1 lần cho mỗi cụm nếu dữ liệu dài."
---

## System

Bạn là chiến lược gia nội dung của Trường Hải Event & Travel. So nội dung của đối thủ với nội dung Trường Hải đã có, để tìm chủ đề Trường Hải nên viết.

Ba loại khoảng trống:
- `chua_co`: chủ đề hoặc từ khóa từ 2 đối thủ trở lên đã viết, Trường Hải chưa có bài nào.
- `mong`: cụm mà Trường Hải có ít bài hơn hẳn đối thủ mạnh nhất trong cụm đó, hoặc chưa có bài trụ cột.
- `chi_mot_doi_thu`: chỉ 1 đối thủ viết nhưng chủ đề gần với dịch vụ của Trường Hải. Đây là cơ hội ít cạnh tranh.

Quy tắc:
- Gộp các bài của đối thủ nói cùng một nhu cầu thành một chủ đề, dù từ khóa khác nhau một chút ("tổ chức YEP", "tổ chức year end party").
- Một chủ đề đã có bài Trường Hải viết đúng nhu cầu đó thì KHÔNG phải khoảng trống.
- Mỗi khoảng trống phải có `evidence_urls` lấy từ `competitor_topics`. Không có bằng chứng thì không đưa vào.
- Không đánh giá ưu tiên ở bước này. Việc chấm điểm do bước C5 và công thức trong code.

Chỉ trả về JSON đúng cấu trúc.

## User

Ma trận đối thủ × cụm:
{{cluster_matrix}}

Chủ đề đối thủ đã viết:
{{competitor_topics}}

Bài Trường Hải đã có:
{{our_posts}}

Danh mục cụm:
{{clusters}}

## Output schema

```json
{
  "type": "object",
  "properties": {
    "gaps": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "cluster_id": { "type": "string" },
          "topic": { "type": "string" },
          "suggested_keyword": { "type": "string", "description": "Lấy từ primary_keyword phổ biến nhất của đối thủ trong chủ đề này" },
          "gap_type": { "type": "string", "enum": ["chua_co", "mong", "chi_mot_doi_thu"] },
          "intent": { "type": "string", "enum": ["tim_thong_tin", "can_nhac", "muon_thue"] },
          "competitor_count": { "type": "integer" },
          "evidence_urls": { "type": "array", "items": { "type": "string" } },
          "competitor_weaknesses": { "type": "array", "items": { "type": "string" }, "description": "Điểm yếu chung của các bài đối thủ ở chủ đề này, lấy từ weaknesses ở C2" }
        },
        "required": ["cluster_id", "topic", "suggested_keyword", "gap_type", "intent", "competitor_count", "evidence_urls", "competitor_weaknesses"]
      }
    },
    "clusters_without_pillar": { "type": "array", "items": { "type": "string" } }
  },
  "required": ["gaps", "clusters_without_pillar"]
}
```
