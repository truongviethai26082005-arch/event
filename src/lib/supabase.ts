import { createClient } from "@supabase/supabase-js";

/**
 * CẤU HÌNH KẾT NỐI SUPABASE
 * Sử dụng biến môi trường:
 * - NEXT_PUBLIC_SUPABASE_URL
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  "";

// Kiểm tra xem đã cấu hình Supabase hợp lệ hay chưa
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== "https://your-project.supabase.co" &&
  supabaseUrl.startsWith("http")
);

// Fallback dummy client để tránh crash khi chưa có biến môi trường
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient(
      "https://placeholder-project.supabase.co",
      "placeholder-anon-key-to-prevent-startup-crash"
    );

export interface DatabaseService {
  id: string;
  title: string;
  slug: string;
  category: "su-kien" | "du-lich";
  description: string;
  image_url: string;
  created_at: string;
}

export interface DatabaseProject {
  id: string;
  title: string;
  category: string;
  client_name: string;
  description: string;
  image_url: string;
  created_at: string;
}

export interface DatabasePost {
  id: string;
  title: string;
  slug: string;
  content: string;
  meta_description: string;
  focus_keyword: string;
  competitor_source_url?: string;
  status: "draft" | "published";
  created_at: string;
}

export interface DatabaseLead {
  id?: string;
  full_name: string;
  phone: string;
  email?: string;
  event_type: string;
  notes?: string;
  created_at?: string;
}
