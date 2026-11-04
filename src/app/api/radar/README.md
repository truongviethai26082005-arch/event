# Radar SEO — Bộ nội dung cho bạn code

Bộ file này là toàn bộ phần "nội dung" của Radar SEO: Bộ não thương hiệu, quy tắc, checklist, bộ từ khóa test và prompt của từng bước. Bạn code chỉ cần viết bộ chạy đọc các file này; không gõ prompt hay dữ liệu vào code.

Chép nguyên thư mục `src/app/api/radar/` vào repo (nằm đúng thư mục của thành viên 4).

## Cấu trúc thư mục

```text
src/app/api/radar/
├── brand/                     Bộ não thương hiệu
│   ├── company.json           A1 Hồ sơ công ty (+ các khẳng định chờ xác minh)
│   ├── services.json          A2 Dịch vụ, link trang /dich-vu
│   ├── projects.json          A3 Dự án đã làm (dữ liệu thật duy nhất AI được nhắc tên)
│   └── clusters.json          A4 Danh mục cụm chủ đề
├── rules/
│   ├── voice.md               A5 Quy tắc giọng văn (mã V1–V17)
│   ├── structure.md           A6 Quy tắc heading và cấu trúc (mã S1–S23)
│   ├── qa-checklist.json      A7 Checklist chất lượng (Q1–Q20)
│   └── priority.json          Công thức điểm ưu tiên kế hoạch (C5)
├── tests/
│   └── keywords.json          A8 Bộ 5 từ khóa test
└── prompts/                   Mỗi bước có AI = 1 file
    ├── 02-intent.md           B2
    ├── 03a-serp-research.md   B3 lần 1 (bật Google Search)
    ├── 03b-serp-structure.md  B3 lần 2 (ép JSON)
    ├── 04-outline.md          B4
    ├── 06-draft.md            B6
    ├── 07-specific.md         B7
    ├── 08-humanize.md         B8
    ├── 09-optimize.md         B9
    ├── 10-factcheck.md        B10
    ├── 11-qa.md               B11
    ├── c2-analyze.md          C2
    ├── c4-gap.md              C4
    └── c5-plan.md             C5
```

## Quy ước file prompt

Mỗi file `.md` trong `prompts/` gồm:

1. **Frontmatter** (giữa hai dòng `---`): `id`, `step`, `temperature`, `grounding` (bật Google Search hay không), `json_output` (ép JSON hay không), `inputs` (danh sách biến).
2. **`## System`**: đưa vào `systemInstruction` của Gemini.
3. **`## User`**: nội dung gửi đi, có biến dạng `{{ten_bien}}`. Bộ chạy thay biến bằng dữ liệu; biến là object/mảng thì `JSON.stringify(x, null, 2)`.
4. **`## Output schema`**: khối ```json là JSON Schema của đầu ra. Bộ chạy:
   - đưa vào `responseSchema` khi `json_output: true` (Gemini chỉ hỗ trợ một phần JSON Schema: `type`, `properties`, `required`, `items`, `enum`, `description`; bỏ `minItems`/`maxItems` nếu SDK báo lỗi),
   - kiểm tra lại kết quả bằng thư viện như `ajv` (báo Lead cài) hoặc kiểm tra tay các trường `required`,
   - sai cấu trúc thì gọi lại tối đa 2 lần, vẫn sai thì dừng và đánh dấu bước lỗi.

Biến không có dữ liệu (ví dụ `content_gap` khi viết bài không đi qua Radar, `pillar_post` khi bài là trụ cột) thì truyền chữ `(không có)`, không để trống `{{...}}`.

Biến chạy nhiều bước dùng chung tên: `keyword`, `content_markdown`, `company`, `services`, `projects`, `voice_rules`, `structure_rules`.

## Luồng Cỗ máy viết bài (Phần B)

Không tạo bảng mới. Trình duyệt gọi từng bước một (`POST /api/radar/step`), giữ kết quả các bước, gửi lại cho bước sau. Xong B11 thì lưu bài vào bảng `posts` có sẵn với `status = 'draft'`.

| Bước | Có AI? | Làm gì | Lưu ở đâu |
| --- | --- | --- | --- |
| B1 | Không | Nhận `keyword`, `cluster_id`, `article_role` (`tru_cot`/`ve_tinh`), `pillar_post` (nếu có). Lấy cụm trong `clusters.json`, lấy dịch vụ và dự án có cùng `cluster_ids`. | Trình duyệt |
| B2 | Có | `02-intent` | Trình duyệt |
| B3 | Có, 2 lần | `03a-serp-research` (grounding) → lưu cả văn bản lẫn danh sách nguồn → `03b-serp-structure` | Trình duyệt (+ nguồn) |
| B4 | Có | `04-outline` | Trình duyệt |
| B5 | Không | Ghép `voice.md` + `structure.md` thành `locked_rules`; chỉ giữ dòng S10, S11 hoặc S12 khớp `intent`. Tách danh sách từ cấm V8–V10 cho bước kiểm tra Q6. | Trình duyệt |
| B6 | Có | `06-draft` | Trình duyệt |
| B7 | Có | `07-specific` | Trình duyệt |
| B8 | Có | `08-humanize` | Trình duyệt |
| B9 | Có | `09-optimize`; sau đó code tạo JSON-LD Article + FAQPage từ `title`, `meta_description`, `faq` (dùng lại `services/schema-builder.ts`) | Trình duyệt |
| B10 | Có | `10-factcheck` | Trình duyệt |
| B11 | Có + code | Code chấm các tiêu chí `checker: "code"`; AI chấm `checker: "ai"` bằng `11-qa`; gộp kết quả | Trình duyệt |
| B12 | Không | Màn Duyệt bài: hiện bài, cảnh báo B10, điểm B11, ô tick tiêu chí `checker: "nguoi"`. Nút "Soát và chấm lại" chạy lại B2, B10, B11 trên nội dung đang sửa. Duyệt → đổi `status` sang `'published'`. | Bảng `posts` |

Dữ liệu gửi cho AI ở các bước B6, B7, B10: chỉ gửi dịch vụ và dự án liên quan cụm, không gửi cả file, để prompt ngắn và AI ít nhầm.

**Không đăng thẳng.** Bài có `blocking = true` ở B10 hoặc còn `[[CẦN SỐ LIỆU: ...]]` thì nút Đăng bị khóa.

## Luồng Radar chiến lược (Phần C)

Dữ liệu Radar lưu thành file JSON trong `src/app/api/radar/data/`, nên chỉ chạy khi chạy dự án trên máy.

| Bước | Có AI? | Làm gì |
| --- | --- | --- |
| C1 | Có (dùng lại `03a`, `03b`) + code | **Tìm đối thủ:** với mỗi từ khóa gốc trong `clusters.json`, chạy `03a-serp-research` rồi `03b-serp-structure`, tách tên miền từ URL top, loại tên miền Trường Hải, mạng xã hội, sàn, báo, diễn đàn; đếm số lần xuất hiện và gợi ý cho người chọn. **Lấy URL:** đọc sitemap bằng `services/domain-scanner.ts`; không có sitemap thì nhập CSV. Lưu vào `data/competitors.json`, `data/pages.json` với `analysed = false`. Nút "Quét lại" chỉ thêm URL mới. |
| C2 | Có | Mỗi URL: lấy nội dung bằng `services/scraper.ts`, gọi `c2-analyze`. Kiểm tra `cluster_id` có trong `clusters.json`, không có thì ghi `ngoai-pham-vi`. Đặt `analysed = true`. |
| C3 | Không | Code đếm số bài theo đối thủ × cụm, vẽ ma trận. |
| C4 | Có | Code chuẩn bị `cluster_matrix`, `competitor_topics`, `our_posts` rồi gọi `c4-gap`. |
| C5 | Có + code | `c5-plan` trả đề bài; code tính điểm và lịch theo `rules/priority.json`; lưu vào `data/plan.json`. Nút "Viết bài này" chuyển sang B1 với `keyword`, `cluster_id`, `role`. |

## Model

- Đặt model trong một chỗ (biến môi trường hoặc hằng số), ví dụ `gemini-2.5-flash`. Bỏ các model `gemini-1.5-*` trong `gemini-client.ts`.
- B3 lần 1 cần công cụ Google Search. Kiểm tra tài liệu Gemini API hiện tại: thư viện mới `@google/genai` hỗ trợ đầy đủ; một số phiên bản không cho bật Google Search cùng lúc với `responseSchema`, vì vậy B3 tách làm 2 lần gọi.

## Việc người làm nội dung còn phải làm

- Xác minh các mục trong `company.json → claims_to_verify` với công ty; mục nào đúng thì đặt `verified: true`.
- Hỏi công ty về số khách, ngân sách, nhận xét khách hàng cho từng dự án trong `projects.json` (đang để `null`).
- Kiểm tra `seed_keywords` trong `clusters.json` bằng Google Keyword Planner; thay từ ít người tìm.
- Dựng bảng đối thủ trên Google Sheets (cấu trúc trong tài liệu khung, Phần C).
- Chạy thử từng prompt trong Google AI Studio với 5 từ khóa test trước khi bạn code nối vào; ghi kết quả vào `tests/keywords.json → history`.
- Dữ liệu `src/app/admin-radar/event-profiles-data.ts` (Sun Group, FPT, Viettel, VinFast…) là dữ liệu mẫu, không đưa vào Bộ não khi chưa xác nhận.
