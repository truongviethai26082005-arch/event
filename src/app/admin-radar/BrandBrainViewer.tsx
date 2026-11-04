"use client";

import React, { useState, useEffect } from "react";
import {
  Building2,
  CheckCircle2,
  AlertCircle,
  FileText,
  ShieldCheck,
  Layers,
  Sparkles,
  ExternalLink,
  Save,
  RefreshCw,
  Search,
  BookOpen,
  HelpCircle,
  FolderArchive,
  ChevronRight,
  Sliders,
  Check,
  X,
  Lock,
} from "lucide-react";

interface ClaimToVerify {
  claim: string;
  verified: boolean;
  note: string;
}

interface CompanyData {
  _meta?: any;
  legal_name: string;
  brand_name: string;
  short_name: string;
  director: string;
  tax_id: string;
  address: string;
  service_area: string;
  hotline: string;
  email: string;
  website: string;
  slogan: string;
  working_hours: string;
  business_lines: string[];
  client_groups: { group: string; clients: string[] }[];
  claims_to_verify: ClaimToVerify[];
}

interface ServiceData {
  id: string;
  name: string;
  short_name: string;
  page_url: string;
  cluster_ids: string[];
  description: string;
}

interface ProjectData {
  id: string;
  name: string;
  client: string;
  client_group: string;
  year: number;
  location: string;
  service_ids: string[];
  cluster_ids: string[];
  highlight: string;
  verified_facts?: {
    attendees?: number | null;
    budget_vnd?: number | null;
    equipment_used?: string[];
  };
}

interface ClusterData {
  id: string;
  name: string;
  description: string;
  seed_keywords: string[];
  pillar_slug: string;
}

export default function BrandBrainViewer() {
  const [subTab, setSubTab] = useState<
    "company" | "services" | "projects" | "clusters" | "rules"
  >("company");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [company, setCompany] = useState<CompanyData | null>(null);
  const [services, setServices] = useState<ServiceData[]>([]);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [clusters, setClusters] = useState<ClusterData[]>([]);
  const [rules, setRules] = useState<{
    voice: string;
    structure: string;
    checklist: any;
    priority: any;
  } | null>(null);

  // Fetch all brand data
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/radar/brand");
      const json = await res.json();
      if (json.success && json.data) {
        setCompany(json.data.company);
        setServices(json.data.services?.services || []);
        setProjects(json.data.projects?.projects || []);
        setClusters(json.data.clusters?.clusters || []);
        setRules({
          voice: json.data.voice,
          structure: json.data.structure,
          checklist: json.data.checklist,
          priority: json.data.priority,
        });
      }
    } catch (err) {
      console.error("Failed to load brand data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle toggle verification for claims
  const handleToggleClaim = (index: number) => {
    if (!company) return;
    const updatedClaims = [...company.claims_to_verify];
    updatedClaims[index] = {
      ...updatedClaims[index],
      verified: !updatedClaims[index].verified,
    };
    setCompany({
      ...company,
      claims_to_verify: updatedClaims,
    });
  };

  // Save company claims updates
  const handleSaveCompany = async () => {
    if (!company) return;
    setSaving(true);
    try {
      const res = await fetch("/api/radar/brand", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target: "company", data: company }),
      });
      const json = await res.json();
      if (json.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Failed to save company data:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-4">
        <RefreshCw className="w-8 h-8 text-amber-600 animate-spin" />
        <p className="text-sm font-medium text-slate-500">
          Đang nạp dữ liệu Bộ não thương hiệu (Brand Brain)...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-amber-500/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              Bộ não thương hiệu độc quyền (Trường Hải Event)
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Đã nạp file chuẩn
              </span>
            </h3>
            <p className="text-xs text-slate-600 mt-0.5 max-w-3xl">
              Nguồn dữ liệu thật duy nhất AI được phép trích dẫn. Các khẳng định
              chưa xác minh sẽ bị khóa để ngăn AI bịa đặt số liệu ảo, đảm bảo
              chuẩn E-E-A-T Google.
            </p>
          </div>
        </div>
        <button
          onClick={fetchData}
          className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-1.5 shadow-xs transition-colors shrink-0 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Tải lại dữ liệu
        </button>
      </div>

      {/* Sub navigation tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200 text-sm">
        <button
          onClick={() => setSubTab("company")}
          className={`px-4 py-2.5 font-bold rounded-xl transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            subTab === "company"
              ? "bg-[#0A1E5E] text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Building2 className="w-4 h-4" />
          Hồ sơ công ty & Xác minh số liệu
          {company?.claims_to_verify?.filter((c) => !c.verified).length ? (
            <span className="px-1.5 py-0.2 text-[10px] bg-amber-400 text-slate-950 rounded-full font-black">
              {company.claims_to_verify.filter((c) => !c.verified).length}
            </span>
          ) : null}
        </button>

        <button
          onClick={() => setSubTab("services")}
          className={`px-4 py-2.5 font-bold rounded-xl transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            subTab === "services"
              ? "bg-[#0A1E5E] text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Layers className="w-4 h-4" />
          13 Dịch vụ chuẩn ({services.length})
        </button>

        <button
          onClick={() => setSubTab("projects")}
          className={`px-4 py-2.5 font-bold rounded-xl transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            subTab === "projects"
              ? "bg-[#0A1E5E] text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <FolderArchive className="w-4 h-4" />
          Dự án thật đã làm ({projects.length})
        </button>

        <button
          onClick={() => setSubTab("clusters")}
          className={`px-4 py-2.5 font-bold rounded-xl transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            subTab === "clusters"
              ? "bg-[#0A1E5E] text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Cụm chủ đề SEO ({clusters.length})
        </button>

        <button
          onClick={() => setSubTab("rules")}
          className={`px-4 py-2.5 font-bold rounded-xl transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            subTab === "rules"
              ? "bg-[#0A1E5E] text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Sliders className="w-4 h-4" />
          Quy tắc giọng văn & QA Checklist
        </button>
      </div>

      {/* SUBTAB 1: HỒ SƠ CÔNG TY & XÁC MINH SỐ LIỆU */}
      {subTab === "company" && company && (
        <div className="space-y-6">
          {/* Legal Card */}
          <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-5 space-y-4">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#0A1E5E]" />
              Thông tin pháp nhân & Liên hệ
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <span className="text-slate-400 block mb-0.5">Tên pháp nhân:</span>
                <span className="font-semibold text-slate-800">{company.legal_name}</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <span className="text-slate-400 block mb-0.5">Thương hiệu:</span>
                <span className="font-bold text-amber-700">{company.brand_name}</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <span className="text-slate-400 block mb-0.5">Mã số thuế:</span>
                <span className="font-mono font-bold text-slate-800">{company.tax_id}</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <span className="text-slate-400 block mb-0.5">Giám đốc:</span>
                <span className="font-semibold text-slate-800">{company.director}</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <span className="text-slate-400 block mb-0.5">Hotline:</span>
                <span className="font-bold text-emerald-700">{company.hotline}</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <span className="text-slate-400 block mb-0.5">Email & Website:</span>
                <span className="font-semibold text-slate-800 truncate block">
                  {company.email} | {company.website}
                </span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200 md:col-span-2 lg:col-span-3">
                <span className="text-slate-400 block mb-0.5">Địa chỉ trụ sở:</span>
                <span className="font-semibold text-slate-800">{company.address}</span>
              </div>
            </div>
          </div>

          {/* Claims to verify card */}
          <div className="bg-white border-2 border-amber-300 rounded-2xl p-5 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  Các khẳng định thương hiệu cần xác minh (Claims to Verify)
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Mục nào được bật <b>[Đã xác minh]</b> thì AI mới được phép chèn vào bài viết. Mục tắt sẽ bị khóa hoàn toàn.
                </p>
              </div>
              <button
                onClick={handleSaveCompany}
                disabled={saving}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer shrink-0"
              >
                {saving ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : saveSuccess ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                {saveSuccess ? "Đã lưu vào JSON!" : "Lưu trạng thái xác minh"}
              </button>
            </div>

            <div className="space-y-3 pt-2">
              {company.claims_to_verify?.map((claimItem, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    claimItem.verified
                      ? "bg-emerald-50/70 border-emerald-200"
                      : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-black px-2 py-0.5 rounded-full ${
                          claimItem.verified
                            ? "bg-emerald-200 text-emerald-900"
                            : "bg-slate-200 text-slate-700"
                        }`}
                      >
                        {claimItem.verified ? "ĐÃ XÁC MINH" : "CHỜ XÁC MINH (KHÓA)"}
                      </span>
                      <span className="text-xs font-bold text-slate-800">
                        {claimItem.claim}
                      </span>
                    </div>
                    {claimItem.note && (
                      <p className="text-[11px] text-slate-500 italic pl-1">
                        Ghi chú nội bộ: {claimItem.note}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => handleToggleClaim(idx)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0 flex items-center gap-1.5 ${
                      claimItem.verified
                        ? "bg-emerald-600 text-white hover:bg-emerald-700"
                        : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                    }`}
                  >
                    {claimItem.verified ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Cho phép AI dùng
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5" /> Bật xác minh
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Client Groups */}
          <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-5 space-y-4">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Khách hàng & Đối tác chiến lược (AI được phép nhắc tên)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {company.client_groups?.map((grp, idx) => (
                <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                  <h5 className="text-xs font-black text-[#0A1E5E]">{grp.group}</h5>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {grp.clients.map((c, cIdx) => (
                      <span
                        key={cIdx}
                        className="px-2 py-0.5 text-[11px] bg-slate-100 text-slate-700 rounded-md font-medium"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: 13 DỊCH VỤ CHUẨN */}
      {subTab === "services" && (
        <div className="space-y-4">
          <p className="text-xs text-slate-500">
            Danh mục 13 dịch vụ chính thức kèm link trang đích <code>/dich-vu/*</code>. Khi AI viết bài, nó sẽ tự động chèn liên kết nội bộ (Internal link) về các trang này.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((svc) => (
              <div
                key={svc.id}
                className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-amber-400 hover:shadow-xs transition-all space-y-3"
              >
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-black px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md">
                    {svc.id}
                  </span>
                  <a
                    href={svc.page_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-amber-600 hover:underline flex items-center gap-1 font-semibold"
                  >
                    Xem trang <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{svc.name}</h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {svc.description}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Slug: {svc.page_url}</span>
                  <span className="font-semibold text-slate-600">
                    Cụm: {svc.cluster_ids?.join(", ")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 3: DỰ ÁN THẬT ĐÃ LÀM */}
      {subTab === "projects" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-xs text-slate-500">
              Đây là dữ liệu dự án thực tế độc quyền. AI <b>chỉ được phép nhắc tên các dự án này</b> làm bằng chứng năng lực (Case Studies) trong bài viết.
            </p>
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Tìm dự án, khách hàng..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects
              .filter(
                (p) =>
                  !searchQuery ||
                  p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  p.client.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((proj) => (
                <div
                  key={proj.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-black px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded">
                        Năm {proj.year} • {proj.location}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 mt-1">
                        {proj.name}
                      </h4>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500 shrink-0">
                      ID: {proj.id}
                    </span>
                  </div>

                  <div className="text-xs space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <p>
                      <b className="text-slate-700">Khách hàng:</b> {proj.client} ({proj.client_group})
                    </p>
                    <p>
                      <b className="text-slate-700">Điểm nổi bật:</b> {proj.highlight}
                    </p>
                    {proj.verified_facts?.equipment_used?.length ? (
                      <p>
                        <b className="text-slate-700">Thiết bị:</b>{" "}
                        {proj.verified_facts.equipment_used.join(", ")}
                      </p>
                    ) : null}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* SUBTAB 4: CỤM CHỦ ĐỀ SEO */}
      {subTab === "clusters" && (
        <div className="space-y-4">
          <p className="text-xs text-slate-500">
            Các cụm chủ đề bài viết trụ cột (Pillar) và vệ tinh (Satellite) theo chiến lược Topic Cluster.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {clusters.map((c) => (
              <div
                key={c.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-black text-[#0A1E5E]">{c.name}</h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-100 rounded text-slate-600">
                    {c.id}
                  </span>
                </div>
                <p className="text-xs text-slate-600">{c.description}</p>
                <div className="text-xs space-y-1.5 pt-2 border-t border-slate-100">
                  <span className="font-bold text-slate-700 block">
                    Từ khóa hạt giống (Seed keywords):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {c.seed_keywords?.map((kw, kwIdx) => (
                      <span
                        key={kwIdx}
                        className="px-2 py-1 text-[11px] bg-amber-50 text-amber-900 border border-amber-200/60 rounded-md font-medium"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 5: QUY TẮC & CHECKLIST */}
      {subTab === "rules" && rules && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Rules Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-purple-600" />
              17 Quy tắc giọng văn (Voice Rules V1–V17)
            </h4>
            <div className="max-h-[500px] overflow-y-auto text-xs text-slate-700 space-y-2 pr-2 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <pre className="font-sans whitespace-pre-wrap leading-relaxed">
                {rules.voice}
              </pre>
            </div>
          </div>

          {/* QA Checklist Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              20 Tiêu chí kiểm soát chất lượng (QA Checklist Q1–Q20)
            </h4>
            <div className="max-h-[500px] overflow-y-auto space-y-2 pr-2">
              {rules.checklist?.criteria?.map((item: any) => (
                <div
                  key={item.id}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5 text-xs"
                >
                  <span
                    className={`font-black px-1.5 py-0.5 rounded text-[10px] shrink-0 ${
                      item.checker === "code"
                        ? "bg-blue-100 text-blue-800"
                        : item.checker === "ai"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {item.id} • {item.checker.toUpperCase()}
                  </span>
                  <div>
                    <span className="font-bold text-slate-800">
                      [{item.group}]
                    </span>{" "}
                    <span className="text-slate-600">{item.rule}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

