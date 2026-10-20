# Git Auto Commit & Push Workflow

Mỗi khi hoàn thành một yêu cầu, tính năng mới hoặc chỉnh sửa theo yêu cầu của người dùng:
1. Tự động kiểm tra các tệp tin đã thay đổi bằng `git status`.
2. Kiểm tra để đảm bảo không commit tệp nhạy cảm (như `.env.local` đã nằm trong `.gitignore`).
3. Tự động stage tệp thay đổi và commit với thông điệp rõ ràng theo chuẩn Conventional Commits (`feat:`, `fix:`, `style:`, `refactor:`, `docs:`...).
4. Chỉ push lên nhánh tính năng đang làm việc hiện tại (ví dụ `feature/api-radar`). TUYỆT ĐỐI KHÔNG tự ý switch, merge hay push lên nhánh `main` khi chưa có sự đồng ý rõ ràng của người dùng.
5. Thông báo ngắn gọn mã commit và trạng thái push cho người dùng biết.
