import { GoogleGenerativeAI, type GenerationConfig } from "@google/generative-ai";

/**
 * Danh sách model Gemini sắp xếp theo độ ưu tiên (đã đo với API key ngày 09/11/2026).
 * - Google đã ngừng gemini-1.5 / 2.0 / 2.5 cho tài khoản này (lỗi 404).
 * - gemini-3.5-flash + suy nghĩ mức thấp: ~4 giây/lần (3.8-flash mất > 60 giây nên không dùng).
 * - gemini-3.1-flash-lite: ~3 giây, dự phòng.
 * - gemini-flash-latest: bí danh Google tự trỏ tới bản flash mới nhất, dự phòng cuối khi model cụ thể bị ngừng.
 */
const CANDIDATE_MODELS = [
  "gemini-3.5-flash",
  "gemini-3.1-flash-lite",
  "gemini-flash-latest",
];

/** Mỗi model chờ tối đa 45 giây rồi chuyển model tiếp theo. */
const REQUEST_TIMEOUT_MS = 45_000;

interface CallGeminiParams {
  apiKey: string;
  prompt: string;
  temperature?: number;
  responseMimeType?: string;
}

/**
 * Gọi Gemini với cơ chế tự động thử lần lượt các model candidate nếu gặp lỗi 404/quá tải
 */
export async function callGeminiWithFallback({
  apiKey,
  prompt,
  temperature = 0.4,
  responseMimeType = "application/json",
}: CallGeminiParams): Promise<string> {
  const genAI = new GoogleGenerativeAI(apiKey);
  let lastError: any = null;

  for (const modelName of CANDIDATE_MODELS) {
    try {
      const model = genAI.getGenerativeModel(
        {
          model: modelName,
          generationConfig: {
            responseMimeType,
            temperature,
            // Gemini 3.x mặc định "suy nghĩ" lâu; mức thấp đủ cho phân tích / soạn nội dung và nhanh hơn nhiều
            thinkingConfig: { thinkingLevel: "low" },
          } as GenerationConfig,
        },
        { timeout: REQUEST_TIMEOUT_MS }
      );

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      if (text && text.trim().length > 0) {
        return text;
      }
    } catch (err: any) {
      lastError = err;
      console.warn(
        `[GeminiClient] Model '${modelName}' không khả dụng (${err?.message?.slice(0, 100)}...). Đang thử model tiếp theo...`
      );
    }
  }

  throw new Error(
    `Không thể gọi Gemini qua tất cả các candidate models: ${lastError?.message || "Lỗi không xác định"}`
  );
}
