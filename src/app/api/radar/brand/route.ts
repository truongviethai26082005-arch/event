import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const BRAND_DIR = path.join(process.cwd(), "src/app/api/radar/brand");
const RULES_DIR = path.join(process.cwd(), "src/app/api/radar/rules");

// Helper to safely read JSON
function readJsonFile(filePath: string) {
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
  }
  return null;
}

// Helper to safely read Markdown
function readTextFile(filePath: string) {
  try {
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, "utf-8");
    }
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
  }
  return "";
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const target = searchParams.get("target") || "all";

    if (target === "company") {
      const company = readJsonFile(path.join(BRAND_DIR, "company.json"));
      return NextResponse.json({ success: true, data: company });
    }

    if (target === "services") {
      const services = readJsonFile(path.join(BRAND_DIR, "services.json"));
      return NextResponse.json({ success: true, data: services });
    }

    if (target === "projects") {
      const projects = readJsonFile(path.join(BRAND_DIR, "projects.json"));
      return NextResponse.json({ success: true, data: projects });
    }

    if (target === "clusters") {
      const clusters = readJsonFile(path.join(BRAND_DIR, "clusters.json"));
      return NextResponse.json({ success: true, data: clusters });
    }

    if (target === "rules") {
      const voice = readTextFile(path.join(RULES_DIR, "voice.md"));
      const structure = readTextFile(path.join(RULES_DIR, "structure.md"));
      const checklist = readJsonFile(path.join(RULES_DIR, "qa-checklist.json"));
      const priority = readJsonFile(path.join(RULES_DIR, "priority.json"));
      return NextResponse.json({
        success: true,
        data: { voice, structure, checklist, priority },
      });
    }

    // Return all brain data
    const company = readJsonFile(path.join(BRAND_DIR, "company.json"));
    const services = readJsonFile(path.join(BRAND_DIR, "services.json"));
    const projects = readJsonFile(path.join(BRAND_DIR, "projects.json"));
    const clusters = readJsonFile(path.join(BRAND_DIR, "clusters.json"));
    const voice = readTextFile(path.join(RULES_DIR, "voice.md"));
    const structure = readTextFile(path.join(RULES_DIR, "structure.md"));
    const checklist = readJsonFile(path.join(RULES_DIR, "qa-checklist.json"));
    const priority = readJsonFile(path.join(RULES_DIR, "priority.json"));

    return NextResponse.json({
      success: true,
      data: {
        company,
        services,
        projects,
        clusters,
        voice,
        structure,
        checklist,
        priority,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load brand data" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { target, data } = body;

    if (!target || !data) {
      return NextResponse.json(
        { success: false, error: "Missing target or data" },
        { status: 400 }
      );
    }

    let filePath = "";
    if (target === "company") {
      filePath = path.join(BRAND_DIR, "company.json");
    } else if (target === "services") {
      filePath = path.join(BRAND_DIR, "services.json");
    } else if (target === "projects") {
      filePath = path.join(BRAND_DIR, "projects.json");
    } else if (target === "clusters") {
      filePath = path.join(BRAND_DIR, "clusters.json");
    } else {
      return NextResponse.json(
        { success: false, error: "Invalid target" },
        { status: 400 }
      );
    }

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");

    return NextResponse.json({
      success: true,
      message: `Updated ${target} successfully`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update brand data" },
      { status: 500 }
    );
  }
}

