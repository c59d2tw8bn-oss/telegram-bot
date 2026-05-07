const { Telegraf, Markup } = require("telegraf");
const http = require("http");

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

const JOIN_LINK = "https://t.me/Yuicsa_bot?start=locketref_7936179657";
const GROUP_LINKS = [
  "https://t.me/nhomfreene",
  "https://t.me/dong18au",
  "https://t.me/donggdamm18",
];

bot.start(async (ctx) => {
  await ctx.reply(
    "👋 Chào mừng bạn!\n\nBấm **Tham gia** để mở bot 2, sau đó quay lại đây bấm **Đã tham gia** để nhận link nhóm!",
    {
      parse_mode: "Markdown",
      ...Markup.inlineKeyboard([
        [Markup.button.url("➡️ Tham gia", JOIN_LINK)],
        // SỬA TẠI ĐÂY: Dùng callback_data là "check" thay vì URL
        [Markup.button.callback("✅ Đã tham gia", "check")],
      ]),
    }
  );
});

// Xử lý nút "Đã tham gia"
bot.action("check", async (ctx) => {
  // QUAN TRỌNG: Phải có answerCbQuery để tắt biểu tượng "đang tải" trên nút
  await ctx.answerCbQuery("Đang kiểm tra...");

  // Gửi tin nhắn chứa link nhóm ngay sau khi họ xác nhận đã ấn tham gia bot 2
  await ctx.reply(
    "🎉 Cảm ơn bạn đã tham gia! Đây là link các nhóm dành cho bạn:\n\n" +
      GROUP_LINKS.map((link) => "👉 " + link).join("\n"),
    { disable_web_page_preview: true }
  );
});

// Khởi chạy bot
bot.launch({ dropPendingUpdates: true })
  .then(() => console.log("Bot started!"))
  .catch((err) => console.error("Lỗi khởi động:", err));

// Giữ bot sống trên Render (Tránh Status 1)
const PORT = process.env.PORT || 3000;
http.createServer((req, res) => {
  res.writeHead(200);
  res.end("Bot is online");
}).listen(PORT);

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
