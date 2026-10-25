"use client";

import React, { useState } from "react";
import {
  X,
  Send,
  Building2,
  User,
  Phone,
  Mail,
  FileText,
  MapPin,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Clock,
} from "lucide-react";
import { trackLandingLead } from "@/app/admin-radar/lead-tracker";
import { COMPANY_INFO } from "@/lib/company-data";

interface DossierRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPackageTitle?: string;
}

export default function DossierRequestModal({
  isOpen,
  onClose,
  defaultPackageTitle = "Hồ Sơ Năng Lực B2B Toàn Diện",
}: DossierRequestModalProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    companyName: "",
    deliveryAddress: "",
    packageType: defaultPackageTitle,
    needsHardCopy: true,
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone) return;

    setIsSubmitting(true);

    try {
      trackLandingLead("GG_FORM", {
        fullName: formData.fullName,
        phone: formData.phone,
        eventType: `Yêu cầu gửi Profile: ${formData.packageType} (${formData.needsHardCopy ? "Bản In + PDF" : "Bản PDF"})`,
        notes: `Đơn vị: ${formData.companyName} | Email: ${formData.email} | Đ/C: ${formData.deliveryAddress} | Ghi chú: ${formData.notes}`,
      });

      // Giả lập xử lý nhanh và gửi xác nhận
      await new Promise((resolve) => setTimeout(resolve, 800));
      setIsSuccess(true);
    } catch (err) {
      console.error(err);
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800"
        role="dialog"
        aria-modal="true"
      >
        {/* Header Modal */}
        <div className="bg-gradient-to-r from-[#06123B] via-[#0A1E5E] to-[#142A75] text-white p-6 relative">
          <button
            onClick={handleResetAndClose}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            aria-label="Đóng cửa sổ"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2 text-[#D4AF37] text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Phòng Quan Hệ Doanh Nghiệp & Đấu Thầu</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
            Đăng Ký Nhận Hồ Sơ Năng Lực Trực Tiếp
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Nhận file PDF gốc 300DPI hoặc bản in đóng gáy sang trọng gửi hỏa tốc về văn phòng quý đơn vị.
          </p>
        </div>

        {/* Nội dung Form */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {isSuccess ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-slate-900">
                Gửi Yêu Cầu Thành Công!
              </h4>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Chuyên viên phụ trách hồ sơ thầu của <strong>Trường Hải Event & Travel</strong> đã tiếp nhận thông tin từ đơn vị <strong>{formData.companyName || formData.fullName}</strong>. Chúng tôi sẽ liên hệ trong vòng 15 phút để gửi tài liệu theo yêu cầu.
              </p>
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 text-left max-w-md mx-auto space-y-1.5">
                <div className="flex items-center font-bold">
                  <ShieldCheck className="w-4 h-4 mr-1.5 text-amber-700" />
                  Hotline Hỗ Trợ Đấu Thầu 24/7:
                </div>
                <p>
                  Đại diện: <strong>{COMPANY_INFO.director}</strong> – Giám đốc điều hành
                </p>
                <p>
                  Hotline trực ban: <strong className="text-red-700">{COMPANY_INFO.hotlineDisplay}</strong> (Zalo/Call)
                </p>
              </div>
              <div className="pt-4">
                <button
                  onClick={handleResetAndClose}
                  className="px-6 py-2.5 bg-[#0A1E5E] text-white font-bold rounded-xl hover:bg-[#06123B] transition-colors text-sm shadow-md"
                >
                  Hoàn Tất & Quay Lại
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Họ và tên người nhận <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="VD: Nguyễn Văn An (Trưởng phòng Mua hàng)"
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#0A1E5E] focus:border-transparent outline-none transition text-slate-800 text-xs sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Số điện thoại / Zalo <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="VD: 0912 345 678"
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#0A1E5E] focus:border-transparent outline-none transition text-slate-800 text-xs sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tên cơ quan / Doanh nghiệp <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      placeholder="VD: Tập đoàn FPT / Ngân hàng VPBank"
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#0A1E5E] focus:border-transparent outline-none transition text-slate-800 text-xs sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email nhận bản PDF gốc
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="VD: banquangia@fpt.com.vn"
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#0A1E5E] focus:border-transparent outline-none transition text-slate-800 text-xs sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Địa chỉ nhận bản in cứng (nếu cần chuyển phát hỏa tốc)
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    value={formData.deliveryAddress}
                    onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                    placeholder="VD: Tòa nhà FPT Tower, số 10 Phạm Văn Bạch, Cầu Giấy, Hà Nội"
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#0A1E5E] focus:border-transparent outline-none transition text-slate-800 text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Gói tài liệu cần nhận
                  </label>
                  <select
                    value={formData.packageType}
                    onChange={(e) => setFormData({ ...formData, packageType: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#0A1E5E] outline-none text-xs sm:text-sm bg-white"
                  >
                    <option value="Hồ Sơ Năng Lực B2B Toàn Diện">Hồ Sơ Năng Lực Toàn Diện (48 Trang)</option>
                    <option value="Catalogue Thiết Bị & Rider Kỹ Thuật">Catalogue Thiết Bị & Rider Kỹ Thuật (24 Trang)</option>
                    <option value="Hồ Sơ Năng Lực Du Lịch & Vận Tải">Hồ Sơ Du Lịch & Vận Tải (32 Trang)</option>
                    <option value="Hồ Sơ Năng Lực Bản Song Ngữ Anh - Việt">Bản Song Ngữ Anh - Việt (Chuyên Biệt Bidding)</option>
                  </select>
                </div>

                <div className="flex items-center pt-5 sm:pt-6">
                  <label className="flex items-center space-x-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.needsHardCopy}
                      onChange={(e) => setFormData({ ...formData, needsHardCopy: e.target.checked })}
                      className="w-4 h-4 text-[#0A1E5E] rounded border-slate-300 focus:ring-[#0A1E5E]"
                    />
                    <span className="text-xs sm:text-sm text-slate-700 font-medium">
                      Gửi thêm <strong>Bản In Bìa Cứng</strong> dập kim nhũ vàng (Miễn phí)
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Yêu cầu dự toán hoặc lưu ý đặc thù của sự kiện / dự thầu
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="VD: Cần bảng dự toán khai trương nhà máy 500 khách vào tháng 11, cần bảo mật thông tin hồ sơ..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#0A1E5E] outline-none text-xs sm:text-sm resize-none"
                />
              </div>

              {/* Cam kết bảo mật */}
              <div className="flex items-start space-x-2 p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-600 text-[11px] leading-relaxed">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Cam kết bảo mật B2B:</strong> Thông tin của quý đơn vị được quản lý theo tiêu chuẩn nội bộ, chỉ sử dụng để gửi hồ sơ và tư vấn chuyên viên 1-1, tuyệt đối không tiết lộ cho bên thứ ba.
                </span>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 text-xs sm:text-sm font-medium"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#c29d2b] to-[#a38018] text-slate-950 font-black shadow-lg hover:brightness-105 active:scale-98 transition disabled:opacity-50 text-xs sm:text-sm cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Clock className="w-4 h-4 animate-spin" />
                      <span>Đang Xử Lý...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Gửi Yêu Cầu Nhận Hồ Sơ</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
