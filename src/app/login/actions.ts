"use server";

import { redirect } from "next/navigation";
import { getSupabasePublicConfig } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function signIn(
  _previousState: string | null,
  formData: FormData
): Promise<string | null> {
  if (!getSupabasePublicConfig()) {
    return "Hệ thống chưa được cấu hình. Vui lòng liên hệ quản trị viên.";
  }

  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  if (!email || !password) {
    return "Vui lòng nhập email và mật khẩu.";
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message === "Invalid login credentials") {
        return "Email hoặc mật khẩu không chính xác. Hãy kiểm tra tài khoản trong đúng dự án Supabase.";
      }
      if (error.message.toLowerCase().includes("email not confirmed")) {
        return "Email tài khoản chưa được xác nhận trong Supabase Auth.";
      }

      console.error("Supabase Auth đăng nhập thất bại:", error.message);
      return "Supabase từ chối đăng nhập. Hãy kiểm tra trạng thái tài khoản và cấu hình Email provider.";
    }

    if (!data.user) {
      return "Supabase không trả về tài khoản sau khi đăng nhập.";
    }
  } catch (error) {
    console.error("Không thể kết nối Supabase Auth:", error);
    return "Không kết nối được Supabase. Hãy kiểm tra URL, khóa API và kết nối mạng.";
  }

  redirect("/admin/dashboard");
}
