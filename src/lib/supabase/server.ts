import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabasePublicConfig } from "@/lib/supabase/config";

export async function createSupabaseServerClient() {
  const config = getSupabasePublicConfig();
  if (!config) {
    throw new Error(
      "Thiếu NEXT_PUBLIC_SUPABASE_URL và khóa publishable/anon của Supabase."
    );
  }

  const cookieStore = await cookies();

  return createServerClient(config.url, config.key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch (error) {
          console.warn(
            "Không thể cập nhật cookie trong ngữ cảnh chỉ đọc; Proxy sẽ đồng bộ phiên.",
            error
          );
        }
      },
    },
  });
}

export async function getAdminSupabaseClient() {
  if (!getSupabasePublicConfig()) {
    return null;
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims?.sub) {
    return null;
  }

  return supabase;
}
