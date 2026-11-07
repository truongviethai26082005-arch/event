import fs from "fs";
import path from "path";

const BASE_RADAR_PATH = path.join(process.cwd(), "src/app/api/radar");

// Đọc file JSON an toàn
export function loadRadarJson<T = any>(relativePath: string): T | null {
  try {
    const fullPath = path.join(BASE_RADAR_PATH, relativePath);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, "utf-8");
      return JSON.parse(content) as T;
    }
  } catch (err) {
    console.error(`[BrandLoader] Error loading JSON ${relativePath}:`, err);
  }
  return null;
}

// Đọc file văn bản Markdown an toàn
export function loadRadarText(relativePath: string): string {
  try {
    const fullPath = path.join(BASE_RADAR_PATH, relativePath);
    if (fs.existsSync(fullPath)) {
      return fs.readFileSync(fullPath, "utf-8");
    }
  } catch (err) {
    console.error(`[BrandLoader] Error loading text ${relativePath}:`, err);
  }
  return "";
}

// Helper lấy toàn bộ dữ liệu Bộ não thương hiệu
export function getBrandBrainData() {
  const company = loadRadarJson("brand/company.json");
  const services = loadRadarJson("brand/services.json");
  const projects = loadRadarJson("brand/projects.json");
  const clusters = loadRadarJson("brand/clusters.json");
  const voice = loadRadarText("rules/voice.md");
  const structure = loadRadarText("rules/structure.md");
  const qaChecklist = loadRadarJson("rules/qa-checklist.json");
  const priority = loadRadarJson("rules/priority.json");

  return {
    company,
    services,
    projects,
    clusters,
    voice,
    structure,
    qaChecklist,
    priority,
  };
}

// Interface định nghĩa một Prompt template
export interface RadarPromptTemplate {
  id: string;
  step: string;
  title: string;
  temperature: number;
  grounding: boolean;
  json_output: boolean;
  inputs: string[];
  systemInstruction: string;
  userPromptTemplate: string;
  outputSchema?: any;
}

// Hàm phân tích file prompt .md (tách frontmatter, system, user, schema)
export function parseRadarPrompt(promptFileName: string): RadarPromptTemplate | null {
  const raw = loadRadarText(`prompts/${promptFileName}`);
  if (!raw) return null;

  try {
    // 1. Tách frontmatter (giữa hai dấu ---)
    const frontmatterMatch = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!frontmatterMatch) return null;

    const frontmatterLines = frontmatterMatch[1].split("\n");
    const meta: any = {};
    for (const line of frontmatterLines) {
      const idx = line.indexOf(":");
      if (idx !== -1) {
        const key = line.slice(0, idx).trim();
        let val: any = line.slice(idx + 1).trim();
        if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
        else if (val === "true") val = true;
        else if (val === "false") val = false;
        else if (!isNaN(Number(val))) val = Number(val);
        else if (val.startsWith("[") && val.endsWith("]")) {
          val = val
            .slice(1, -1)
            .split(",")
            .map((s: string) => s.trim().replace(/^["']|["']$/g, ""));
        }
        meta[key] = val;
      }
    }

    const rest = raw.slice(frontmatterMatch[0].length);

    // 2. Tách các section ## System, ## User, ## Output schema
    let systemInstruction = "";
    let userPromptTemplate = "";
    let outputSchema = null;

    const systemMatch = rest.match(/## System\r?\n([\s\S]*?)(?=\r?\n## User|\r?\n## Output schema|$)/i);
    if (systemMatch) {
      systemInstruction = systemMatch[1].trim();
    }

    const userMatch = rest.match(/## User\r?\n([\s\S]*?)(?=\r?\n## Output schema|$)/i);
    if (userMatch) {
      userPromptTemplate = userMatch[1].trim();
    }

    const schemaMatch = rest.match(/## Output schema\r?\n```json\r?\n([\s\S]*?)\r?\n```/i);
    if (schemaMatch) {
      try {
        outputSchema = JSON.parse(schemaMatch[1]);
      } catch {
        // ignore schema parse errors
      }
    }

    return {
      id: meta.id || promptFileName,
      step: meta.step || "",
      title: meta.title || "",
      temperature: meta.temperature ?? 0.3,
      grounding: Boolean(meta.grounding),
      json_output: Boolean(meta.json_output),
      inputs: meta.inputs || [],
      systemInstruction,
      userPromptTemplate,
      outputSchema,
    };
  } catch (err) {
    console.error(`[BrandLoader] Error parsing prompt ${promptFileName}:`, err);
    return null;
  }
}

