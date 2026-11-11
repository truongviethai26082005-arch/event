# Radar SEO: quy trình nghiệp vụ, kịch bản test và prompt triển khai

> Cơ chế do chủ dự án chốt (11/2026): **tự động tìm các bài đối thủ đang top Google → cào nội dung →
> so xem họ có gì mình chưa có, từ khóa nào đang top → đề xuất viết mới hoặc viết lại bài chứa các từ
> khóa đó, đồng thời lấp các khe hở mà đối thủ bỏ trống.**
> Mục 1–2 trả lời "ai, để làm gì, được gì"; mục 3 là dây chuyền; mục 6 là kịch bản test; mục 8 là prompt.

---

## 1. Radar SEO để làm gì

**Lấy chính các bài đang đứng top Google làm chuẩn, viết bài tốt hơn họ: đủ mọi thứ họ có, cộng thêm
những thứ họ thiếu. Mục tiêu là vượt lên top, kéo khách đang tìm dịch vụ sự kiện về website, để lại
SĐT và vào phễu CRM.**

```
 Từ khóa ──▶ Top Google ──▶ Cào bài top ──▶ So với mình ──▶ Đề xuất viết ──▶ Viết & đăng ──▶ Theo dõi hạng ──▶ Lead
 (cụm)       (đối thủ)      (nội dung)      thiếu gì?        mới / viết lại    (AI + người)     tụt thì viết lại   (CRM)
                                             khe hở họ?
```

Thước đo cuối cùng: **vị trí trên Google của từ khóa** và **số khách đến từ bài viết**, không phải số bài.

---

## 2. Vai trò: ai làm gì, được gì

| | **Người phụ trách nội dung** (người dùng chính) | **Máy Radar** (tự chạy) | **AI (Gemini)** | **Sale** |
|---|---|---|---|---|
| **Là ai** | 1 nhân viên marketing, không chuyên SEO, 30–60 phút/ngày | Tác vụ chạy đêm | Trợ lý phân tích và viết nháp | Nhân viên kinh doanh |
| **Việc** | Duyệt danh sách từ khóa; mỗi ngày xử lý **"Hôm nay làm gì"**: chọn đề xuất, duyệt nháp, đăng | Lấy top Google, cào bài, so sánh, theo dõi thứ hạng | Bóc từ khóa, mục nội dung, khe hở; viết nháp theo bản đề xuất | Gọi khách đến từ bài |
| **Mục tiêu** | Lên top các từ khóa mang khách mà không phải tự nghiên cứu đối thủ | Không bỏ sót đối thủ mới vào top, bài mới của đối thủ | Bài **đủ** những gì top có và **hơn** ở khe hở | Có khách có nhu cầu thật |
| **Cơ chế** | Máy làm nặng; người chỉ chọn và duyệt | Quét theo lịch, chỉ xử lý phần mới | Không bịa: khe hở lấp bằng chất liệu thật (bảng giá, dự án, báo giá); thiếu thì `[[CẦN SỐ LIỆU]]` | Lead ghi "đến từ bài nào" |
| **Thành công thì được gì** | Thấy: từ khóa X từ vị trí 18 → 4; bài Y mang về 6 khách, chốt 2 hợp đồng | | | Khách đã đọc bài, chốt nhanh hơn |

---

## 3. Dây chuyền 7 bước

```
 [1] TỪ KHÓA ─▶ [2] TOP GOOGLE ─▶ [3] CÀO BÀI ─▶ [4] SO SÁNH ─▶ [5] ĐỀ XUẤT ─▶ [6] VIẾT & ĐĂNG ─▶ [7] THEO DÕI
   cụm, từ khóa   10 kết quả       nội dung        mình thiếu gì    viết mới /       cỗ máy B1–B11     thứ hạng,
   cần theo dõi   đầu, lọc đối thủ từng bài top    từ khóa top      viết lại         + duyệt           lead
                                                   khe hở họ                                           │
                       ▲                                                                               │
                       └──────────────── tụt hạng / đối thủ có bài mới: quay lại bước 2 ◀──────────────┘
```

Mỗi bước ghi: **Để làm gì · Đầu vào · Máy tự làm · Người làm · Đầu ra · Màn hình phải có**.

### Bước 1. Từ khóa: chọn trận địa
- **Để làm gì:** biết mình cạnh tranh ở những từ khóa nào. Mọi bước sau chạy theo danh sách này.
- **Đầu vào:** 11 cụm trong `brand/clusters.json` (khai trương, YEP, team building, hội nghị…) và từ khóa gốc của từng cụm.
- **Máy tự làm:** gợi ý thêm từ khóa từ phần "Mọi người cũng tìm" của Google và từ khóa đối thủ đang top (bước 4).
- **Người làm:** bật hoặc tắt từ khóa theo dõi; đánh dấu từ khóa **mang khách** (ví dụ "tổ chức khai trương trọn gói Hà Nội") ưu tiên hơn từ khóa chỉ để đọc.
- **Đầu ra:** danh sách từ khóa theo dõi, mỗi từ khóa thuộc 1 cụm, có loại ý định (tìm hiểu / so sánh / thuê dịch vụ).
- **Màn hình:** bảng Từ khóa · Cụm · Ý định · Vị trí của mình · Theo dõi (bật/tắt) · Lần quét gần nhất.

### Bước 2. Top Google: ai đang đứng top
- **Để làm gì:** xác định đúng các bài mình phải vượt.
- **Máy tự làm (mỗi đêm):** với mỗi từ khóa, lấy **10 kết quả đầu** trên Google Việt Nam (tiêu đề, URL, vị trí).
  - Lọc bỏ: mạng xã hội, sàn TMĐT, báo lớn, diễn đàn, website của mình.
  - Ghi **vị trí của mình** nếu có.
  - Đánh dấu **đối thủ mới vào top** và **bài mới**.
- **Người làm:** xem; loại thủ công kết quả không liên quan.
- **Đầu ra:** ma trận **Từ khóa × Đối thủ × Vị trí**; danh sách tên miền đối thủ, đếm số từ khóa mỗi bên đang top.
- **Màn hình:** khung **"Máy đang tự làm gì"** (ca gần nhất, số từ khóa đã quét, số URL mới, lỗi, lịch kế tiếp); bảng top 10 cho từng từ khóa.

### Bước 3. Cào bài: lấy nội dung các bài top
- **Để làm gì:** có dữ liệu để so sánh, không đoán.
- **Máy tự làm:** với mỗi URL top **mới hoặc có thay đổi**, đọc nội dung (Jina Reader, đã có) và lưu:
  tiêu đề, meta, H1/H2/H3, số chữ, FAQ, bảng giá có hay không, ảnh, ngày đăng hoặc cập nhật.
- **Người làm:** không cần; chỉ xem lỗi trang không đọc được.
- **Đầu ra:** kho bài đối thủ (`competitor_scanned_pages`).

### Bước 4. So sánh: họ có gì mình chưa có
Đây là **bước lõi**. Máy so **tất cả bài top** của một từ khóa với **bài của mình** (nếu có), ra 3 danh sách:

| Danh sách | Nghĩa | Ví dụ "tổ chức khai trương trọn gói" |
|---|---|---|
| **A. Mục bắt buộc** | Mục nội dung **đa số bài top đều có**. Thiếu thì khó lên top | Quy trình tổ chức, hạng mục cần chuẩn bị, chi phí tham khảo, FAQ |
| **B. Từ khóa top** | Từ khóa chính và phụ bài top dùng ở tiêu đề / H2; từ khóa mình **chưa dùng** | "chi phí khai trương", "lễ khai trương cửa hàng", "múa lân khai trương" |
| **C. Khe hở đối thủ** | Thứ **khách cần nhưng các bài top làm kém hoặc không có** | Không có **giá cụ thể theo quy mô**, không có **dự án thật kèm ảnh**, nội dung cũ (2022), không có checklist tải về |

- **Máy tự làm:** AI đọc các bài top → trả A, B, C. Code đếm tần suất mục và từ khóa trên các bài.
  So với bài mình → đánh dấu mình **đã có / thiếu** từng mục.
- **Đầu ra:** **Phiếu so sánh** cho từng từ khóa.
- **Màn hình:** 3 cột A / B / C; mỗi dòng có dấu ✓ (mình có) hoặc ✗ (mình thiếu); nguồn (bài đối thủ nào).

### Bước 5. Đề xuất: viết mới hay viết lại
- **Để làm gì:** biến phiếu so sánh thành **việc cụ thể**.
- **Máy tự làm:**
  - **Mình chưa có bài** cho từ khóa → đề xuất **Viết mới**.
  - **Có bài nhưng thua** (ngoài top 10, hoặc thiếu nhiều mục A) → đề xuất **Viết lại**.
  - Mỗi đề xuất kèm **bản brief**:
    - tiêu đề gợi ý;
    - từ khóa chính và phụ (từ B);
    - dàn ý = mục bắt buộc (A) + **mục vượt đối thủ** (C);
    - **chất liệu thật** để lấp khe hở (hạng mục từ Bảng đơn giá, dự án đã làm, khoảng giá từ báo giá CRM).
  - Chấm **điểm ưu tiên**: từ khóa mang khách, mình đang ở vị trí 8–30 (gần top), số khe hở mình lấp được bằng chất liệu thật, độ mạnh đối thủ.
- **Người làm:** bấm **Chấp nhận** (chuyển sang viết), **Sửa brief**, hoặc **Bỏ qua**.
- **Màn hình:** danh sách đề xuất xếp theo điểm; nhãn **Viết mới / Viết lại**; mở ra thấy brief đầy đủ.

### Bước 6. Viết và đăng
- **Máy tự làm:** chạy cỗ máy viết B1–B11 (đã có) **với brief của bước 5 làm đầu vào**.
  - Với **Viết lại**: giữ nguyên đường dẫn (slug) bài cũ để không mất thứ hạng đang có.
  - Bài còn `[[CẦN SỐ LIỆU]]` hoặc lỗi kiểm chứng → khóa nút Đăng.
- **Người làm:** đọc, bổ sung số liệu, tick tiêu chí, **Đăng**.
- **Đầu ra:** bài trên `/tin-tuc/[slug]`, có trong sitemap; phiếu so sánh được đánh dấu "đã xử lý".
- **Màn hình:** màn duyệt có **bảng đối chiếu**: mục A, từ khóa B, khe hở C, mỗi dòng ✓ nếu bài đã đáp ứng.

### Bước 7. Theo dõi: lên top chưa, mang về khách chưa
- **Máy tự làm:** ca đêm quét lại top → ghi **vị trí của mình** theo ngày.
  - **Tụt hạng**, hoặc **đối thủ có bài mới vượt lên** → tự tạo đề xuất **Viết lại** (quay về bước 2).
  - Ghi **trang khách đến** vào lead (CRM) → biết bài nào mang khách.
- **Màn hình:** biểu đồ vị trí theo thời gian cho từng từ khóa; bảng Bài · Vị trí · Lead · Đã chốt · Doanh thu.

---

## 4. Màn hình đầu tiên: "Hôm nay làm gì"

| Ưu tiên | Việc | Nút |
|---|---|---|
| 1 | Nháp đã xong, chờ duyệt | Mở duyệt |
| 2 | Từ khóa **tụt hạng** / đối thủ mới vượt lên | Xem phiếu so sánh |
| 3 | Đề xuất **Viết lại** điểm cao (mình đang ở vị trí 8–30) | Chấp nhận |
| 4 | Đề xuất **Viết mới** điểm cao | Chấp nhận |
| 5 | Bài máy viết chưa đạt QA | Xem lỗi |
| 6 | Ca đêm lỗi | Xem nhật ký |

Bên cạnh là dây chuyền 1–7 với **huy hiệu số việc chờ** ở từng bước.

---

## 5. Đối chiếu với code hiện có

| Bước | Hiện có | Cần làm |
|---|---|---|
| 1 Từ khóa | `clusters.json` có từ khóa gốc (chưa kiểm tra lượng tìm) | Bảng từ khóa theo dõi trong DB, bật/tắt, vị trí |
| 2 Top Google | Prompt `03a-serp-research` có sẵn nhưng **chưa nối**; `gemini-client` chưa bật Google Search | **Nguồn dữ liệu top Google** (xem mục 7); ma trận từ khóa × đối thủ; lịch đêm thật (`/api/radar/cron` hiện là khung) |
| 3 Cào bài | ✅ `scraper.ts` (Jina), bảng `competitor_scanned_pages` | Lưu H2/FAQ/ngày cập nhật; chỉ cào bài mới hoặc thay đổi |
| 4 So sánh | `/api/radar` phân tích **1 URL** do người dán | So **nhiều bài top** + **bài mình** → 3 danh sách A/B/C |
| 5 Đề xuất | `content_gap_ideas`, tab Kế hoạch | Nhãn Viết mới / Viết lại; brief; điểm ưu tiên mới |
| 6 Viết & đăng | ✅ Cỗ máy B1–B12, Kho bài, khóa đăng | Nhận brief làm đầu vào; luồng **viết lại giữ slug**; bảng đối chiếu ở màn duyệt |
| 7 Theo dõi | Không có | Lịch sử vị trí; tự tạo đề xuất khi tụt hạng; ghi trang đến vào lead |
| Thứ tự tab | Viết bài · Kho bài · Bộ não · Đối thủ · Kế hoạch | Sắp theo dây chuyền 1–7 + "Hôm nay làm gì" |

---

## 6. Kịch bản test UI và quy trình

✅ = kết quả đúng phải thấy. Test theo vai người phụ trách nội dung, đi đúng thứ tự dây chuyền.
Từ khóa test gợi ý: **"tổ chức khai trương trọn gói hà nội"**.

| # | Bước | Thao tác | ✅ Kết quả đúng |
|---|---|---|---|
| T0.1 | Vào | Mở `/admin-radar` | Thấy "Hôm nay làm gì" + dây chuyền 1–7 có huy hiệu |
| T1.1 | Từ khóa | Thêm từ khóa test, gán cụm Khai trương, bật theo dõi | Xuất hiện trong bảng, trạng thái "chưa quét" |
| T2.1 | Top Google | Bấm **Chạy thử** | Hiện top 10 dự kiến, **không ghi** DB; nhật ký "dry-run" |
| T2.2 | | Bấm **Chạy thật** | Bảng top 10 có vị trí, tên miền; Facebook/Shopee/báo bị lọc; vị trí của mình hiện "ngoài top 10" nếu chưa có |
| T2.3 | | Chạy thật lần 2 | Không nhân đôi; URL mới được đánh dấu "mới" |
| T3.1 | Cào bài | Mở 1 bài top | Thấy tiêu đề, H2, số chữ, có/không bảng giá, ngày cập nhật |
| T3.2 | | URL không đọc được | Ghi lỗi, ca vẫn chạy tiếp các URL khác |
| T4.1 | So sánh | Mở phiếu so sánh của từ khóa | 3 cột A (mục bắt buộc) / B (từ khóa top) / C (khe hở), mỗi dòng ghi nguồn |
| T4.2 | | Chưa có bài mình | Mọi dòng A, B đánh ✗ |
| T4.3 | | Khe hở "không có giá cụ thể" | Có gợi ý chất liệu: hạng mục từ Bảng đơn giá |
| T5.1 | Đề xuất | Mở danh sách đề xuất | Đề xuất **Viết mới** cho từ khóa test, có điểm, brief đầy đủ |
| T5.2 | | Bấm **Chấp nhận** | Chuyển sang cỗ máy viết với brief điền sẵn |
| T6.1 | Viết | Cỗ máy chạy xong | Màn duyệt có bảng đối chiếu A/B/C; dòng chưa đáp ứng tô đỏ |
| T6.2 | | Còn `[[CẦN SỐ LIỆU]]` | Nút Đăng khóa, ghi lý do |
| T6.3 | | Đăng | Bài có ở `/tin-tuc/...` và sitemap; phiếu so sánh "đã xử lý" |
| T6.4 | Viết lại | Từ đề xuất Viết lại → đăng | **Đường dẫn bài cũ giữ nguyên**, nội dung mới |
| T7.1 | Theo dõi | Ca đêm sau | Biểu đồ vị trí có điểm mới cho từ khóa |
| T7.2 | | Giả lập tụt hạng | "Hôm nay làm gì" có việc "Từ khóa tụt hạng"; có đề xuất Viết lại |
| T7.3 | | Ẩn danh: mở bài → bấm Zalo → điền popup | Lead ghi trang đến = bài đó; bảng hiệu quả +1 lead |

---

## 7. Quyết định cần chốt trước khi làm: nguồn dữ liệu top Google

Bước 2 cần lấy **10 kết quả Google thật** cho từng từ khóa, tự động mỗi đêm. Có 3 cách:

| Cách | Độ chính xác | Chi phí | Ghi chú |
|---|---|---|---|
| **Serper.dev / SerpAPI** (khuyên dùng) | Cao: đúng thứ tự Google Việt Nam | Serper khoảng 1 USD / 1.000 lượt tìm; 50 từ khóa × 30 ngày ≈ 1.500 lượt/tháng ≈ 1,5 USD | Đăng ký lấy API key |
| Google Custom Search JSON API | Trung bình: kết quả có thể khác Google thường | Miễn phí 100 lượt/ngày | Cần tạo Programmable Search Engine |
| Gemini + Google Search (đã có key) | Thấp: AI trả nguồn tham khảo, **không phải thứ hạng** | Theo hạn mức Gemini | Không đáng tin để đo vị trí |

---

## 8. Lộ trình và prompt triển khai

| Đợt | Nội dung |
|---|---|
| 1 | Bảng từ khóa theo dõi + bước 2 (top Google, theo nguồn đã chọn) + bước 3 cào bài; nút Chạy thử / Chạy thật |
| 2 | Bước 4 phiếu so sánh A/B/C (nhiều bài top + bài mình) |
| 3 | Bước 5 đề xuất Viết mới / Viết lại + brief; nối vào cỗ máy viết (bước 6), luồng viết lại giữ slug |
| 4 | Giao diện dây chuyền 1–7 + "Hôm nay làm gì" + "Máy đang tự làm gì" |
| 5 | Bước 7: lịch đêm thật, lịch sử vị trí, tự đề xuất khi tụt hạng, trang đến trong lead |

```text
VAI TRÒ: Kỹ sư Next.js 16 (App Router, Cache Components) + Supabase của website Trường Hải Event &
Travel. Đọc AGENTS.md và node_modules/next/dist/docs trước khi viết code.

NGHIỆP VỤ (docs/radar-seo-quy-trinh.md, mục 1–4):
- Người dùng: 1 nhân viên marketing không chuyên SEO, 30–60 phút/ngày.
- Cơ chế: tự tìm bài đối thủ đang top Google cho từng từ khóa → cào nội dung → so với bài của mình:
  A mục bắt buộc, B từ khóa top, C khe hở đối thủ → đề xuất Viết mới / Viết lại kèm brief → cỗ máy
  viết B1–B11 → người duyệt, đăng → theo dõi thứ hạng; tụt hạng thì tự đề xuất viết lại.
- Khe hở lấp bằng chất liệu thật: price_items (Bảng đơn giá), brand/projects.json, lead_quotes.
  AI không bịa; thiếu thì [[CẦN SỐ LIỆU: ...]].
- Thước đo: vị trí từ khóa + số lead đến từ bài.

HIỆN TRẠNG (mục 5): scraper.ts (Jina), competitor_scanned_pages, content_gap_ideas, radar_activity_logs,
cỗ máy B1–B12, prompts/*.md (03a, 03b, c2, c4, c5), gemini-client.ts (gemini-3.5-flash).
Nguồn top Google: <điền lựa chọn ở mục 7>.

NHIỆM VỤ ĐỢT <N>: <dán nội dung đợt>.

YÊU CẦU:
1. Không dữ liệu mẫu viết cứng; trạng thái rỗng có hướng dẫn.
2. Migration trong supabase/migrations/, RLS chỉ authenticated; khóa API chỉ ở biến môi trường máy chủ.
3. Mỗi ca quét ghi radar_activity_logs (dry-run không ghi dữ liệu nghiệp vụ).
4. `npx tsc --noEmit` và `npx next build` phải có MÃ THOÁT 0 trước khi bàn giao.
5. Bàn giao kèm kết quả chạy các kịch bản test tương ứng ở mục 6.
```

---

## 9. Trạng thái triển khai (11/2026) và cách dùng

Toàn bộ dây chuyền 1–7 đã có trong `/admin-radar` → mục **"0. Dây chuyền SEO"** (mở mặc định).

| Bước | Màn hình | Máy tự làm | Code chính |
|---|---|---|---|
| Hôm nay làm gì | Tab đầu tiên | Gom mọi việc cần người, xếp ưu tiên | `admin-radar/pipeline/RadarPipeline.tsx` |
| 1–3 | Tab "Từ khóa · Top Google · Cào bài" | Serper top 10 (toàn quốc Việt Nam), lọc đối thủ, đọc bài (không tạo nội dung giả) | `lib/radar/serper.ts`, `page-reader.ts`, `run.ts` |
| 4 So sánh | Tab "So sánh" | Code đo tín hiệu (số chữ, % có giá / FAQ / dự án, năm cập nhật) + AI ra A/B/C | `lib/radar/compare.ts` |
| 5 Đề xuất | Tab "Đề xuất" | Viết mới / Viết lại + brief + điểm 0–100 có lý do | `lib/radar/compare.ts` (scoreProposal) |
| 6 Viết & đăng | Tab "Viết & đăng" | AI viết theo brief chỉ từ chất liệu thật (dự án, Bảng đơn giá); QA code (từ cấm, [CẦN SỐ LIỆU], dàn ý); viết mới → Kho bài viết; viết lại → áp dụng giữ slug | `lib/radar/writer.ts` |
| 7 Theo dõi | Tab "Theo dõi" | Lịch sử vị trí, phát hiện tụt hạng, bài → khách → hợp đồng → doanh thu | `pipeline/TrackTab.tsx`, `leads.landing_path` |
| Lịch tự chạy | `vercel.json` (02:00 CN) | Quét → cào → so sánh → đề xuất | `api/radar/serp/cron` |

**Migration cần chạy theo thứ tự:** `20261109020000_radar_serp.sql` → `20261109030000_radar_pipeline.sql`.

**Biến môi trường:** `SERPER_API_KEY`, `GEMINI_API_KEY` (bắt buộc); `SERPER_MONTHLY_LIMIT` (mặc định 300);
`CRON_SECRET` + `SUPABASE_SERVICE_ROLE_KEY` (để bật lịch tự chạy trên Vercel); `RADAR_OWN_DOMAINS`
(tên miền của mình ngoài truonghaievent.com, cách nhau dấu phẩy) để nhận diện vị trí của mình.

**Đã kiểm thử với dữ liệu thật** (từ khóa "tổ chức lễ khai trương"): top 10 đúng 9 đối thủ; đọc 8/8 bài;
so sánh 15 giây ra 5 mục bắt buộc, 8 từ khóa top, 3 khe hở có chất liệu; đề xuất Viết lại bài
`/tin-tuc/quy-trinh-to-chuc-le-khai-truong-tron-goi-tu-a-z` (70 điểm); AI viết 2.348 chữ trong 23 giây,
0 cụm từ cấm, mọi dự án và mức giá trích dẫn khớp Bộ não và Bảng đơn giá.

**Giới hạn đã biết:** khoảng 1/5 lần gọi, Google trả top 10 khác thường (nhiều video / báo), chưa rõ nguyên nhân;
màn hình có nút "Tự đối chiếu trên Google". Thứ hạng chỉ đo trong top 10 (Serper `num: 10`).
