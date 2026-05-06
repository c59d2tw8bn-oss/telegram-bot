const http = require('http');
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write('Bot is alive!');
  res.end();
}).listen(process.env.PORT || 3000);

const { Telegraf, Markup } = require("telegraf");

// Đảm bảo bạn đã cài TOKEN trong phần Environment của Render
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

const JOIN_LINK = "https://t.me/Yuicsa_bot?start=locketref_7936179657";
const GROUP_LINKS = ["https://t.me/nhomfreene", "https://t.me/dong18au"];

bot.start(async (ctx) => {
  await ctx.reply(
    "👋 Chào mừng bạn!\n\nĐể nhận link nhóm, bạn vui lòng bấm nút bên dưới để tham gia trước nhé!",
    {
      parse_mode: "Markdown",
      ...Markup.inlineKeyboard([
        // SỬA TẠI ĐÂY: Dùng nút URL để bấm một phát là nhảy sang bot kia luôn, không bị xoay vòng
        [Markup.button.url("➡️ Tham gia ngay", https://t.me/Yuicsa_bot?start=locketref_7936179657)],
// Xử lý khi người dùng bấm nút "Tham gia ngay"
bot.action("joined", async (ctx) => {
  try {
    // Luôn trả lời Telegram ngay lập tức để tắt biểu tượng "đang tải"
    await ctx.answerCbQuery();

    await ctx.editMessageText(
      "🎉 Cảm ơn bạn đã tham gia!\n\nĐây là link nhóm dành cho bạn:",
      { parse_mode: "Markdown" }
    );
    
    await ctx.reply(GROUP_LINKS.map((link) => `👉 ${link}`).join("\n"));
  } catch (error) {
    console.error("Lỗi nút joined:", error);
  }
});

// Cấu hình để tránh lỗi 409 Conflict khi Render khởi động lại
bot.launch({ dropPendingUpdates: true }).then(() => {
  console.log("Bot started!");
});

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
