import type { Metadata } from "next";
import { Suspense } from "react";
import { Clock, FileCheck2, ShieldCheck } from "lucide-react";
import LeadCaptureForm from "@/components/LeadCaptureForm";
import { COMPANY_INFO } from "@/lib/company-data";

export const metadata: Metadata = {
  title: "Nhận Kịch Bản & Báo Giá | Trường Hải Event & Travel",
  description: "Để lại thông tin sự kiện để nhận kịch bản và báo giá chi tiết trong 30 phút.",
  robots: { index: false, follow: false },
};

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Trang form sale gửi cho khách qua Zalo / Messenger.
 * Link có dạng /dich-vu/nhan-bao-gia?ma=<form_token của lead>; khách điền xong
 * thông tin được ghi vào đúng lead đó trong CRM.
 */
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

/** Đọc mã lead trên link (?ma=...) — nằm trong <Suspense> để phần còn lại của trang được dựng sẵn. */
async function TokenForm({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const raw = Array.isArray(params.ma) ? params.ma[0] : params.ma;
  const token = raw && UUID_RE.test(raw) ? raw : null;
  return <LeadCaptureForm token={token} />;
}

function FormSkeleton() {
  return (
    <div className="space-y-3" aria-busy="true" aria-label="Đang tải form">
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} className="h-11 animate-pulse rounded-xl bg-slate-100" />
      ))}
    </div>
  );
}

export default function NhanBaoGiaPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <section className="bg-gradient-to-b from-[#0A1E5E] to-slate-50 px-4 pb-16 pt-28 sm:pt-32">
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-5 text-white">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D4AF37]/50 bg-white/10 px-3 py-1 text-xs font-semibold text-[#D4AF37]">
            <Clock className="h-3.5 w-3.5" /> Phản hồi trong 30 phút
          </span>
          <h1 className="text-3xl font-black leading-tight sm:text-4xl">Nhận Kịch Bản &amp; Báo Giá Chi Tiết</h1>
          <p className="text-sm leading-relaxed text-slate-300">
            Quý khách vui lòng cho chúng tôi biết thông tin sự kiện. Chuyên viên của {COMPANY_INFO.brandName} sẽ
            gửi kịch bản, bảng bóc tách chi phí và phương án tối ưu ngân sách đúng với nhu cầu.
          </p>
          <ul className="space-y-2 text-sm text-slate-200">
            <li className="flex items-center gap-2">
              <FileCheck2 className="h-4 w-4 shrink-0 text-emerald-400" /> Báo giá minh bạch, không phát sinh
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-400" /> Hợp đồng pháp nhân, xuất VAT đầy đủ
            </li>
          </ul>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl sm:p-7">
          <Suspense fallback={<FormSkeleton />}>
            <TokenForm searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
