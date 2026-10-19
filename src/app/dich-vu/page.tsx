"use client";

/**
 * =========================================================================
 * KHU VỰC DÀNH CHO THÀNH VIÊN 2: MẢNG DỊCH VỤ & FORM BÁO GIÁ
 * Lưu ý: Thành viên 2 chỉ được phép chỉnh sửa các file bên trong src/app/dich-vu/
 * =========================================================================
 */

import React, { useState, useEffect } from "react";
import { COMPANY_INFO, SERVICES_DATA, ServiceItem } from "@/lib/company-data";
import { supabase, isSupabaseConfigured, DatabaseLead } from "@/lib/supabase";
import {
  Calendar,
  Compass,
  CheckCircle2,
  Phone,
  Send,
  Sparkles,
  ShieldCheck,
  Clock,
  Award,
  HelpCircle,
  FileCheck,
} from "lucide-react";

export default function ServicesPage() {
  const [activeTab, setActiveTab] = useState<"su-kien" | "du-lich">("su-kien");
  const [services, setServices] = useState<ServiceItem[]>(SERVICES_DATA);
  const [loadingServices, setLoadingServices] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    eventType: "Lễ kỷ niệm, khánh thành, khai trương",
    estimatedGuests: "100 - 300 khách",
    notes: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  // Tải dữ liệu từ Supabase (nếu có bảng services)
  useEffect(() => {
    async function fetchServicesFromSupabase() {
      if (!isSupabaseConfigured) return;
      try {
        setLoadingServices(true);
        const { data, error } = await supabase
          .from("services")
          .select("*")
          .order("created_at", { ascending: true });

        if (!error && data && data.length > 0) {
          // Map to ServiceItem
          const mapped: ServiceItem[] = data.map((item: any) => ({
            id: item.id,
            title: item.title,
            slug: item.slug,
            category: item.category as "su-kien" | "du-lich",
            description: item.description,
            features: item.features || [
              "Trọn gói kịch bản, âm thanh, ánh sáng",
              "Đội ngũ kỹ thuật viên trực chiến",
              "Cam kết chất lượng và an toàn tuyệt đối",
            ],
            image_url: item.image_url || "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80",
          }));
          setServices(mapped);
        }
      } catch (err) {
        console.warn("Dùng dữ liệu fallback cho services:", err);
      } finally {
        setLoadingServices(false);
      }
    }

    fetchServicesFromSupabase();
  }, []);

  const filteredServices = services.filter((s) => s.category === activeTab);

  // Xử lý gửi Form báo giá vào bảng leads trên Supabase
  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitResult({ type: null, message: "" });

    try {
      if (isSupabaseConfigured) {
        const leadRecord: DatabaseLead = {
          full_name: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          event_type: `${formData.eventType} (${formData.estimatedGuests})`,
          notes: formData.notes,
        };

        const { error } = await supabase.from("leads").insert([leadRecord]);

        if (error) {
          throw error;
        }
      } else {
        // Giả lập lưu thành công khi chưa cấu hình Supabase
        console.log("Mock lead submission:", formData);
        await new Promise((r) => setTimeout(r, 600));
      }

      setSubmitResult({
        type: "success",
        message: `Cảm ơn quý khách ${formData.fullName}! Yêu cầu báo giá đã được ghi nhận. Chuyên viên Trường Hải Event sẽ liên hệ qua số ${formData.phone} trong vòng 30 phút.`,
      });

      // Reset form
      setFormData({
        fullName: "",
        phone: "",
        email: "",
        eventType: "Lễ kỷ niệm, khánh thành, khai trương",
        estimatedGuests: "100 - 300 khách",
        notes: "",
      });
    } catch (err: any) {
      console.error("Lỗi khi gửi lead:", err);
      setSubmitResult({
        type: "error",
        message:
          "Hệ thống đang bận. Quý khách vui lòng gọi trực tiếp Hotline 24/7: 0844 198 333 để nhận báo giá nhanh nhất!",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const selectServiceForQuote = (serviceTitle: string) => {
    setFormData((prev) => ({ ...prev, eventType: serviceTitle }));
    const formElement = document.getElementById("bao-gia");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Banner đầu trang */}
      <div className="bg-[#0A1E5E] text-white py-14 border-b border-[#D4AF37]/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#06123B] via-[#0A1E5E] to-[#122868] opacity-90" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
          <span className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-[#D4AF37] border border-[#D4AF37]/40">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Trường Hải Event & Travel • Báo Giá Chuẩn Xác - Tối Ưu Chi Phí</span>
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white">
            Dịch Vụ Sự Kiện & Du Lịch Trọn Gói
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-light">
            Cung cấp giải pháp sự kiện và tour du lịch chuyên nghiệp, thiết bị chính hãng, kịch bản độc bản và quy trình vận hành an toàn tuyệt đối.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Navigation Tabs */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1.5 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <button
              onClick={() => setActiveTab("su-kien")}
              className={`flex items-center px-6 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${
                activeTab === "su-kien"
                  ? "bg-[#0A1E5E] text-[#D4AF37] shadow-md"
                  : "text-slate-600 hover:text-[#0A1E5E]"
              }`}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Mảng Sự Kiện ({services.filter((s) => s.category === "su-kien").length})
            </button>

            <button
              onClick={() => setActiveTab("du-lich")}
              className={`flex items-center px-6 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${
                activeTab === "du-lich"
                  ? "bg-[#0A1E5E] text-[#D4AF37] shadow-md"
                  : "text-slate-600 hover:text-[#0A1E5E]"
              }`}
            >
              <Compass className="w-4 h-4 mr-2" />
              Mảng Du Lịch & Vận Tải ({services.filter((s) => s.category === "du-lich").length})
            </button>
          </div>
        </div>

        {/* Tab Content Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-[#0A1E5E]">
              {activeTab === "su-kien"
                ? "Danh Sách Dịch Vụ Tổ Chức Sự Kiện"
                : "Danh Sách Dịch Vụ Du Lịch & Vận Tải"}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {activeTab === "su-kien"
                ? "Khánh thành, khai trương, hội nghị, tiệc tất niên Y.E.P, sân khấu âm thanh ánh sáng LED"
                : "Tour doanh nghiệp kết hợp Team Building, du lịch thiện nguyện, xe đời mới 7-45 chỗ"}
            </p>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              <div className="h-52 relative overflow-hidden bg-slate-900">
                <img
                  src={service.image_url}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-3 right-3 px-3 py-1 rounded-md bg-[#0A1E5E] text-[#D4AF37] text-xs font-bold border border-[#D4AF37]/30">
                  {service.category === "su-kien" ? "Sự Kiện" : "Du Lịch"}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-bold text-lg text-[#0A1E5E] group-hover:text-[#D4AF37] transition-colors line-clamp-2">
                    {service.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Features list */}
                  {service.features && service.features.length > 0 && (
                    <ul className="mt-4 space-y-1.5 pt-3 border-t border-slate-100 text-xs text-slate-600">
                      {service.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] mr-2 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <button
                    onClick={() => selectServiceForQuote(service.title)}
                    className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-[#0A1E5E] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0A1E5E] transition-all flex items-center justify-center space-x-2 shadow-sm"
                  >
                    <span>Nhận Báo Giá Gói Này</span>
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* =========================================================================
            FORM BÁO GIÁ TRỰC TUYẾN (LƯU VÀO SUPABASE LEADS)
        ========================================================================= */}
        <div id="bao-gia" className="scroll-mt-28">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Left Column: Form info & Contact */}
              <div className="lg:col-span-5 bg-[#0A1E5E] text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

                <div className="space-y-6 relative z-10">
                  <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-[#D4AF37] border border-[#D4AF37]/30">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Phản Hồi Nhanh Trong 30 Phút</span>
                  </span>

                  <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                    Đăng Ký Nhận Tư Vấn & Báo Giá Sự Kiện / Tour
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                    Hãy chia sẻ sơ bộ về kế hoạch của bạn. Đội ngũ đạo diễn và chuyên gia tổ chức của Trường Hải Event & Travel sẽ lên phương án kịch bản độc bản và dự toán chi phí tối ưu nhất.
                  </p>

                  <div className="space-y-4 pt-4 text-xs">
                    <div className="flex items-center space-x-3 p-3 rounded-xl bg-white/5 border border-white/10">
                      <Phone className="w-5 h-5 text-[#D4AF37] shrink-0" />
                      <div>
                        <span className="text-slate-400 block">Hotline tư vấn khẩn cấp:</span>
                        <a
                          href={`tel:${COMPANY_INFO.hotline}`}
                          className="font-bold text-base text-[#D4AF37] hover:underline"
                        >
                          {COMPANY_INFO.hotlineDisplay}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-3 rounded-xl bg-white/5 border border-white/10">
                      <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                      <div>
                        <span className="text-slate-400 block">Bảo mật thông tin:</span>
                        <span className="text-slate-200">
                          Cam kết bảo mật 100% thông tin sự kiện & kinh phí dự án
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-8 mt-8 border-t border-white/10 text-xs text-slate-400 relative z-10">
                  {COMPANY_INFO.name} • MST: {COMPANY_INFO.taxId}
                </div>
              </div>

              {/* Right Column: Lead Form */}
              <div className="lg:col-span-7 p-8 sm:p-10">
                <form onSubmit={handleSubmitLead} className="space-y-5">
                  <h4 className="text-lg font-bold text-[#0A1E5E] pb-2 border-b border-slate-100 flex items-center">
                    <FileCheck className="w-5 h-5 mr-2 text-[#D4AF37]" />
                    Thông Tin Nhu Cầu Của Quý Khách
                  </h4>

                  {submitResult.type && (
                    <div
                      className={`p-4 rounded-xl text-xs font-medium ${
                        submitResult.type === "success"
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          : "bg-rose-50 text-rose-800 border border-rose-200"
                      }`}
                    >
                      {submitResult.message}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Họ và tên của bạn <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Nguyễn Văn A"
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormData({ ...formData, fullName: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0A1E5E] focus:border-transparent outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Số điện thoại / Zalo <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="0912 345 678"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0A1E5E] focus:border-transparent outline-none transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Email liên hệ (nếu có)
                      </label>
                      <input
                        type="email"
                        placeholder="example@company.com"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0A1E5E] focus:border-transparent outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Quy mô khách dự kiến
                      </label>
                      <select
                        value={formData.estimatedGuests}
                        onChange={(e) =>
                          setFormData({ ...formData, estimatedGuests: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0A1E5E] focus:border-transparent outline-none transition bg-white"
                      >
                        <option value="Dưới 50 khách">Dưới 50 khách</option>
                        <option value="50 - 150 khách">50 - 150 khách</option>
                        <option value="150 - 300 khách">150 - 300 khách</option>
                        <option value="300 - 600 khách">300 - 600 khách</option>
                        <option value="Trên 600 khách (Đại lễ lớn)">
                          Trên 600 khách (Đại lễ lớn)
                        </option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Loại hình sự kiện / Dịch vụ quan tâm <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.eventType}
                      onChange={(e) =>
                        setFormData({ ...formData, eventType: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0A1E5E] focus:border-transparent outline-none transition bg-white"
                    >
                      <optgroup label="Mảng Tổ Chức Sự Kiện">
                        <option value="Lễ kỷ niệm, khánh thành, khai trương, khởi công – động thổ">
                          Lễ kỷ niệm, khánh thành, khai trương, khởi công
                        </option>
                        <option value="Tiệc tất niên Year End Party (Y.E.P), Gala Dinner">
                          Tiệc tất niên Year End Party (Y.E.P), Gala Dinner
                        </option>
                        <option value="Sự kiện mở bán Bất động sản, Hội nghị & Hội thảo">
                          Sự kiện mở bán BĐS, Hội nghị, Hội thảo
                        </option>
                        <option value="Sự kiện Trung thu, Tết Thiếu nhi, Họp lớp">
                          Sự kiện Trung thu, Tết Thiếu nhi, Họp lớp
                        </option>
                        <option value="Thuê thiết bị Âm thanh, Ánh sáng, Sân khấu, Màn hình LED">
                          Thuê thiết bị Âm thanh, Ánh sáng, Sân khấu, Màn LED
                        </option>
                      </optgroup>
                      <optgroup label="Mảng Du Lịch & Vận Tải">
                        <option value="Tour Doanh nghiệp kết hợp Team Building">
                          Tour Doanh nghiệp kết hợp Team Building
                        </option>
                        <option value="Thuê xe du lịch 7 - 45 chỗ đời mới">
                          Thuê xe du lịch 7 - 45 chỗ đời mới
                        </option>
                        <option value="Tour du lịch trải nghiệm & Thiện nguyện cộng đồng">
                          Tour du lịch trải nghiệm & Thiện nguyện
                        </option>
                      </optgroup>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Ghi chú thêm về địa điểm, thời gian hoặc yêu cầu đặc biệt
                    </label>
                    <textarea
                      rows={3}
                      placeholder="VD: Dự kiến tổ chức vào giữa tháng 12 tại Hà Nội, cần thuê trọn gói âm thanh ánh sáng và MC..."
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0A1E5E] focus:border-transparent outline-none transition"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-[#D4AF37] via-[#eed06f] to-[#D4AF37] text-[#0A1E5E] shadow-lg hover:scale-[1.01] transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    {submitting ? (
                      <span>Đang gửi thông tin...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-1" />
                        <span>Gửi Yêu Cầu Báo Giá Miễn Phí</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
