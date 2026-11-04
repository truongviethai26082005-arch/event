import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Danh sách model Gemini sắp xếp theo độ ưu tiên:
 * 1. gemini-2.5-flash: Model thế hệ mới chuẩn nhất theo hướng dẫn README.md của Radar SEO.
 * 2. gemini-2.0-flash: Phản hồi siêu tốc trong 2-3s.
 * 3. gemini-2.5-pro: Dự phòng chất lượng cao.
 */
const CANDIDATE_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-2.5-pro",
];

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
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          responseMimeType,
          temperature,
        },
      });

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
