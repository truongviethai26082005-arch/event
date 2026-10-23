import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import LoginForm from "@/app/login/login-form";
import { getSupabasePublicConfig } from "@/lib/supabase/config";

export default function LoginPage() {
  const enabled = Boolean(getSupabasePublicConfig());

  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#F4F6FA] px-4 py-12">
      <section className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5">
        <div className="bg-gradient-to-br from-[#07163D] via-[#0A1E5E] to-[#173477] px-7 py-8 text-white sm:px-9">
          <div className="mb-6 flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-lg">
            <Image
              src="/images/logo.png"
              alt="Logo Trường Hải Event & Travel"
              width={128}
              height={128}
              className="h-full w-full scale-125 object-contain"
            />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">
            Trường Hải Event &amp; Travel
          </p>
          <h1 className="mt-2 text-2xl font-black">Đăng nhập quản trị</h1>
          <p className="mt-2 text-sm leading-relaxed text-blue-100/80">
            Sử dụng tài khoản quản trị đã được tạo trong Supabase Auth.
          </p>
        </div>

        <div className="space-y-6 p-7 sm:p-9">
          <div className="flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-xs leading-relaxed text-blue-900">
            <ShieldCheck className="h-4 w-4 shrink-0" />
            Tài khoản đăng nhập được cấp quyền truy cập phân hệ Admin.
          </div>
          <LoginForm enabled={enabled} />
          <div className="border-t border-slate-100 pt-5">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-[#0A1E5E]"
            >
              <ArrowLeft className="h-4 w-4" />
              Quay lại trang chủ
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
