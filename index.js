const { Telegraf, Markup } = require("telegraf");
const http = require("http");

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

const JOIN_LINK = "https://t.me/Yuicsa_bot?start=locketref_7936179657";
const GROUP_LINKS = [
  "https://t.me/nhomfreene",
  "https://t.me/dong18au",
  "https://t.me/donggdamm18",
];

const joinedUsers = new Set();

bot.start(async (ctx) => {
  await ctx.reply(
    "👋 Chào mừng bạn!\n\nBấm *Tham gia* để vào bot, sau đó bấm *Đã tham gia* để nhận link nhóm!",
    {
      parse_mode: "Markdown",
      ...Markup.inlineKeyboard([
        [Markup.button.url("➡️ Tham gia", JOIN_LINK)],
        [Markup.button.callback("✅ Đã tham gia", "confirm")],
        [Markup.button.callback("🔗 Lấy link nhóm", "getlink")],
      ]),
    }
  );
});

bot.action("confirm", async (ctx) => {
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
});

bot.action("getlink", async (ctx) => {
  const userId = ctx.from && ctx.from.id;
  if (!userId || !joinedUsers.has(userId)) {
    await ctx.answerCbQuery("⚠️ Bạn cần bấm Tham gia và Đã tham gia trước!", { show_alert: true });
    return;
  }
  await ctx.answerCbQuery();
  await ctx.reply(
    "🎉 Đây là link nhóm dành cho bạn:\n\n" +
      GROUP_LINKS.map((link) => "👉 " + link).join("\n")
  );
});

bot.launch({ dropPendingUpdates: true });
console.log("Bot started!");

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

const PORT = process.env.PORT || 3000;
http.createServer((req, res) => {
  res.writeHead(200);
  res.end("Bot is running!");
}).listen(PORT, () => {
  console.log("Keep-alive server on port " + PORT);
});
