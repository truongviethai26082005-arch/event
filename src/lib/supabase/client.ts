"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabasePublicConfig } from "@/lib/supabase/config";

let browserClient: SupabaseClient | undefined;

export function createSupabaseBrowserClient() {
  if (!browserClient) {
    const config = getSupabasePublicConfig();
    if (!config) {
      throw new Error(
        "Thiếu cấu hình Supabase để truy cập dữ liệu quản trị."
      );
    }
    browserClient = createBrowserClient(config.url, config.key);
  }

  return browserClient;
}
