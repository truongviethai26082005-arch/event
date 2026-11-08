// CHỈ import file này trong Route Handler / code máy chủ.
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Client quyền máy chủ (service role) cho các tác vụ tự động chạy nền:
 * AI phân tích lead ngay khi khách gửi form, gửi thông báo Telegram...
 *
 * Cần biến môi trường SUPABASE_SERVICE_ROLE_KEY (Supabase → Project Settings → API).
 * KHÔNG đặt tiền tố NEXT_PUBLIC_ và không bao giờ dùng ở trình duyệt.
 * Thiếu biến này: trả về null, tác vụ nền được bỏ qua (sale vẫn bấm "Phân tích AI" được).
 */
export function createServiceClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
