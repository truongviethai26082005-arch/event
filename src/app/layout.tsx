import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingContactWidget from "@/components/FloatingContactWidget";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Trường Hải Event & Travel | Sự Kiện Chuyên Nghiệp - Du Lịch Trải Nghiệm",
  description:
    "Công ty TNHH Sự kiện và Du lịch Trường Hải chuyên tổ chức sự kiện trọn gói, khai trương, khánh thành, hội nghị, tiệc tất niên Y.E.P, tour du lịch doanh nghiệp và cho thuê thiết bị âm thanh ánh sáng. Hotline: 0844 198 333.",
  keywords: [
    "tổ chức sự kiện",
    "Trường Hải Event",
    "tổ chức khai trương",
    "tiệc tất niên YEP",
    "tour du lịch doanh nghiệp",
    "thuê âm thanh ánh sáng Hà Nội",
  ],
  authors: [{ name: "Trường Hải Event & Travel" }],
  openGraph: {
    title: "Trường Hải Event & Travel | Sự Kiện Chuyên Nghiệp - Du Lịch Trải Nghiệm",
    description: "Sự kiện chuyên nghiệp – Du lịch trải nghiệm – Kết nối thành công. Hotline: 0844 198 333.",
    type: "website",
    locale: "vi_VN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={openSans.variable}>
      <head>
        <link href="https://fonts.cdnfonts.com/css/careera-script-personal-use" rel="stylesheet" />
      </head>
      <body className={`${openSans.className} min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased selection:bg-[#D4AF37] selection:text-[#0A1E5E]`}>
        <Suspense fallback={<div className="h-20 bg-white w-full border-b border-slate-200" />}>
          <Header />
        </Suspense>
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingContactWidget />
      </body>
    </html>
  );
}
