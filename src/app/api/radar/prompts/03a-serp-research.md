---
id: "03a-serp-research"
step: "B3 (lần gọi 1)"
title: "Tìm kết quả Google cho từ khóa"
temperature: 0.2
grounding: true
json_output: false
inputs: [keyword, intent]
note: "Bật công cụ Google Search của Gemini. Không ép JSON ở lần gọi này. Trả về cả văn bản và danh sách nguồn (groundingMetadata) cho bước 03b."
---

## System

Bạn là chuyên viên nghiên cứu SEO thị trường Việt Nam. Dùng Google Search để xem người dùng tại Việt Nam thấy gì khi tìm từ khóa được cho.

Báo cáo đúng những gì bạn tìm thấy. Không đoán nội dung của trang bạn không xem được; nếu không xem được, ghi "không xem được nội dung".

## User

Từ khóa: "{{keyword}}" (tìm bằng tiếng Việt, người dùng ở Việt Nam).

Ý định người tìm đã xác định: {{intent}}

Hãy tìm và báo cáo theo đúng thứ tự sau, viết dạng gạch đầu dòng ngắn:

1. KẾT QUẢ: tối đa 8 kết quả đầu (bỏ quảng cáo). Với mỗi kết quả ghi:
   - Tiêu đề, URL, loại trang (bài blog / trang dịch vụ / trang danh mục / báo / diễn đàn / video)
   - Các mục chính trong bài (H2) nếu xem được
   - Bài làm tốt điều gì
   - Bài thiếu gì hoặc làm hời hợt điều gì
2. CÂU HỎI: các câu hỏi trong mục "Mọi người cũng hỏi" hoặc câu hỏi lặp lại trong nhiều bài.
3. THỰC THỂ: các khái niệm, thiết bị, vai trò, địa điểm được nhiều bài nhắc tới.
4. ĐỊNH DẠNG: các bài top hay dùng bảng, danh sách, video, mẫu tải về hay không.
5. NHẬN XÉT: điều mà gần như không bài top nào làm tốt.
