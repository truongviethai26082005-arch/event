"use client";

import { useActionState } from "react";
import { LockKeyhole, LoaderCircle, Mail } from "lucide-react";
import { signIn } from "@/app/login/actions";

export default function LoginForm({ enabled }: { enabled: boolean }) {
  const [errorMessage, action, pending] = useActionState(signIn, null);

  return (
    <form action={action} className="space-y-5">
      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Email quản trị
        </label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="username"
            required
            className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0A1E5E] focus:ring-2 focus:ring-blue-100"
            placeholder="admin@truonghai.vn"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Mật khẩu
        </label>
        <div className="relative">
          <LockKeyhole className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0A1E5E] focus:ring-2 focus:ring-blue-100"
            placeholder="Nhập mật khẩu"
          />
        </div>
      </div>

      {errorMessage && (
        <p
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
        >
          {errorMessage}
        </p>
      )}

      {!enabled && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Đăng nhập chưa khả dụng vì cấu hình Supabase hoặc email Admin còn thiếu.
        </p>
      )}

      <button
        type="submit"
        disabled={!enabled || pending}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0A1E5E] px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-950/15 transition hover:bg-[#142d75] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? (
          <>
            <LoaderCircle className="h-4 w-4 animate-spin" />
            Đang xác thực...
          </>
        ) : (
          <>
            <LockKeyhole className="h-4 w-4" />
            Đăng nhập
          </>
        )}
      </button>
    </form>
  );
}
