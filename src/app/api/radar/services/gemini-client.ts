import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Danh sách model Gemini sắp xếp theo độ ưu tiên:
 * 1. gemini-2.0-flash: Thế hệ mới nhất, phản hồi trong 2-3s, tối ưu chi phí và không bị lỗi model version.
 * 2. gemini-1.5-flash-latest: Alias chuẩn của Gemini 1.5 Flash.
 * 3. gemini-2.5-flash: Model thế hệ tiếp theo nếu khả dụng.
 * 4. gemini-1.5-flash: Model cũ (fallback nếu endpoint hỗ trợ).
 * 5. gemini-1.5-pro: Dự phòng chất lượng cao cuối cùng.
 */
const CANDIDATE_MODELS = [
  "gemini-2.0-flash",
  "gemini-1.5-flash-latest",
  "gemini-2.5-flash",
  "gemini-1.5-flash",
  "gemini-1.5-pro",
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

  throw lastError || new Error("Tất cả candidate models của Gemini đều không phản hồi.");
}
