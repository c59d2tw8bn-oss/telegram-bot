const { Telegraf, Markup } = require("telegraf");
const http = require("http");

// Đảm bảo bạn đã thêm biến này vào Environment Variables trên Render
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

const JOIN_LINK = "https://t.me/Yuicsa_bot?start=locketref_7936179657";
const GROUP_LINKS = [
  "https://t.me/nhomfreene",
  "https://t.me/dong18au",
  "https://t.me/donggdamm18",
];

const joinedUsers = new Set();

bot.start(async (ctx) => {
  try {
    await ctx.reply(
      "👋 Chào mừng bạn!\n\nBấm *Tham gia* để vào bot, sau đó bấm *Đã tham gia* để nhận link nhóm!",
      {
        parse_mode: "Markdown",
        ...Markup.inlineKeyboard([
          [Markup.button.url("➡️ Tham gia", JOIN_LINK)],
          // Sửa lại: Dùng callback_data là "confirm" để khớp với bot.action("confirm")
          [Markup.button.callback("✅ Đã tham gia", "confirm")],
          [Markup.button.callback("🔗 Lấy link nhóm", "getlink")],
        ]),
      }
    );
  } catch (err) {
    console.error("Error in start command:", err);
  }
});

bot.action("confirm", async (ctx) => {
  try {
    await ctx.answerCbQuery();
    const userId = ctx.from && ctx.from.id;
    if (userId) joinedUsers.add(userId);
    
    await ctx.editMessageText(
      "✅ Đã xác nhận! Giờ bấm *Lấy link nhóm* để nhận link nhé!",
      {
        parse_mode: "Markdown",
        ...Markup.inlineKeyboard([
          [Markup.button.callback("🔗 Lấy link nhóm", "getlink")],
        ]),
      }
    );
  } catch (err) {
    console.error("Error in confirm action:", err);
  }
});

bot.action("getlink", async (ctx) => {
  try {
    const userId = ctx.from && ctx.from.id;
    if (!userId || !joinedUsers.has(userId)) {
      await ctx.answerCbQuery("⚠️ Bạn cần bấm 'Đã tham gia' trước!", { show_alert: true });
      return;
    }
    await ctx.answerCbQuery();
    await ctx.reply(
      "🎉 Đây là link nhóm dành cho bạn:\n\n" +
        GROUP_LINKS.map((link) => "👉 " + link).join("\n")
    );
  } catch (err) {
    console.error("Error in getlink action:", err);
  }
});

// Khởi chạy bot
bot.launch({ dropPendingUpdates: true })
  .then(() => console.log("Bot started!"))
  .catch((err) => console.error("Failed to launch bot:", err));

// Xử lý dừng bot an toàn
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

// Server Keep-alive cho Render
const PORT = process.env.PORT || 3000;
http.createServer((req, res) => {
  res.writeHead(200);
  res.end("Bot is running!");
}).listen(PORT, () => {
  console.log("Keep-alive server on port " + PORT);
});
