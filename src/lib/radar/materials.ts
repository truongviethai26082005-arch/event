// CHỈ dùng ở máy chủ.
/**
 * "Tháp" chất liệu thật của Trường Hải cho 1 cụm chủ đề: dự án đã làm, dịch vụ, bảng đơn giá.
 * AI chỉ được dùng các dữ liệu này để lấp khe hở đối thủ (quy tắc V13: không tự bịa số).
 */
import fs from "node:fs";
import path from "node:path";
import type { SupabaseClient } from "@supabase/supabase-js";
import projectsFile from "@/app/api/radar/brand/projects.json";
import servicesFile from "@/app/api/radar/brand/services.json";
import companyFile from "@/app/api/radar/brand/company.json";
import clustersFile from "@/app/api/radar/brand/clusters.json";

interface Project {
  id: string;
  title: string;
  cluster_ids?: string[];
  client?: string | null;
  year?: number | null;
  location?: string | null;
  scope?: string | null;
  scale?: string | null;
  budget?: string | number | null;
  testimonial?: string | null;
  real_photo?: string | null;
}
interface Service {
  id: string;
  name?: string;
  title?: string;
  cluster_ids?: string[];
  page_url?: string;
  [key: string]: unknown;
}
export interface Cluster {
  id: string;
  name: string;
  service_id?: string;
  business_value?: string;
  pillar_topic?: string;
}

export const CLUSTERS = (clustersFile as { clusters: Cluster[] }).clusters;
export const clusterById = (id?: string | null) => CLUSTERS.find((c) => c.id === id);

/** Nhóm trong Bảng đơn giá liên quan tới từng cụm (để lấy đúng hạng mục giá). */
const PRICE_GROUPS_BY_CLUSTER: Record<string, string[] | "all"> = {
  "khai-truong-khanh-thanh": "all",
  "year-end-party-gala": "all",
  "hoi-nghi-hoi-thao": "all",
  teambuilding: ["Nhân sự", "Âm thanh", "Vận chuyển", "Media", "Ẩm thực", "Bàn ghế"],
  "tour-doanh-nghiep": ["Vận chuyển", "Nhân sự", "Media", "Ẩm thực"],
  "thiet-bi-su-kien": ["Âm thanh", "Ánh sáng", "Màn hình", "Sân khấu", "In ấn & Backdrop", "Thảm"],
  "family-day-le-hoi": "all",
  "van-tai-xe": ["Vận chuyển"],
  "du-lich-trai-nghiem": ["Vận chuyển", "Nhân sự", "Media", "Ẩm thực"],
};

function readRule(file: string) {
  try {
    return fs.readFileSync(path.join(process.cwd(), "src/app/api/radar/rules", file), "utf8");
  } catch {
    return "";
  }
}

/** Quy tắc giọng văn (voice.md) và cấu trúc (structure.md). */
export function writingRules() {
  return { voice: readRule("voice.md"), structure: readRule("structure.md") };
}

export interface Materials {
  cluster: Cluster | undefined;
  projects: Project[];
  services: Service[];
  prices: { category: string; name: string; unit: string; unit_price: number }[];
  /** Văn bản ngắn gọn để đưa vào prompt. */
  text: string;
  /** Độ dày tháp: số dự án, số hạng mục giá. */
  tower: { projects: number; prices: number };
}

const vnd = (n: number) => `${Math.round(n).toLocaleString("vi-VN")}đ`;

export async function loadMaterials(client: SupabaseClient, clusterId?: string | null): Promise<Materials> {
  const cluster = clusterById(clusterId);
  const projects = ((projectsFile as { projects: Project[] }).projects || []).filter(
    (p) => !clusterId || (p.cluster_ids || []).includes(clusterId)
  );
  const allServices = ((servicesFile as { services?: Service[] }).services || []) as Service[];
  const services = allServices.filter(
    (s) => !clusterId || s.id === cluster?.service_id || (s.cluster_ids || []).includes(clusterId)
  );

  let prices: Materials["prices"] = [];
  const { data } = await client
    .from("price_items")
    .select("category,name,unit,unit_price")
    .eq("is_active", true)
    .order("category")
    .order("sort_order");
  const groups = (clusterId && PRICE_GROUPS_BY_CLUSTER[clusterId]) || "all";
  prices = ((data ?? []) as Materials["prices"]).filter((p) => groups === "all" || groups.includes(p.category));

  const company = companyFile as Record<string, unknown>;
  const lines = [
    `CÔNG TY: ${String(company.brand_name || company.name || "Trường Hải Event & Travel")} · Hotline ${String(company.hotline || "0844.198.333")}`,
    `DỊCH VỤ LIÊN QUAN: ${services.map((s) => `${s.name || s.title || s.id}${s.page_url ? ` (${s.page_url})` : ""}`).join("; ") || "(không có)"}`,
    "DỰ ÁN THẬT ĐÃ LÀM (chỉ được nhắc các dự án này, không thêm chi tiết ngoài dữ liệu):",
    ...(projects.length
      ? projects.map(
          (p) =>
            `- ${p.title} · khách: ${p.client || "?"} · ${p.year || "?"} · ${p.location || ""} · hạng mục: ${p.scope || "?"}` +
            `${p.scale ? ` · quy mô: ${p.scale}` : ""}${p.real_photo ? ` · ảnh thật: ${p.real_photo}` : ""}`
        )
      : ["- (chưa có dự án cho cụm này)"]),
    "BẢNG ĐƠN GIÁ THAM KHẢO (chưa VAT, chỉ được dùng đúng các mức này):",
    ...(prices.length ? prices.map((p) => `- ${p.category}: ${p.name} — ${vnd(Number(p.unit_price))}/${p.unit}`) : ["- (chưa có bảng giá)"]),
  ];
  return { cluster, projects, services, prices, text: lines.join("\n"), tower: { projects: projects.length, prices: prices.length } };
}
