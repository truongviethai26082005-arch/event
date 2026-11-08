// CHỈ dùng ở máy chủ.
/**
 * Gửi thông báo vào nhóm Telegram của sale.
 * Cần TELEGRAM_BOT_TOKEN (từ @BotFather) và TELEGRAM_CHAT_ID (ID nhóm, thường bắt đầu bằng "-").
 * Thiếu cấu hình -> bỏ qua, không lỗi.
 */
export function isTelegramConfigured() {
  return Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID);
}

/** Thoát ký tự đặc biệt cho parse_mode HTML. */
export function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export async function sendTelegram(html: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return false;
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: html.slice(0, 4000),
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });
    if (!res.ok) console.warn("[Telegram] Gửi thất bại:", res.status, await res.text());
    return res.ok;
  } catch (err) {
    console.warn("[Telegram] Lỗi gửi:", err);
    return false;
  }
}
