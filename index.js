const http = require('http');
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write('Bot is alive!');
  res.end();
}).listen(process.env.PORT || 3000);

const { Telegraf, Markup } = require("telegraf");

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

const JOIN_LINK = "https://t.me/Yuicsa_bot?start=locketref_7936179657";
const GROUP_LINKS = ["https://t.me/nhomfreene", "https://t.me/dong18au"];

bot.start(async (ctx) => {
  await ctx.reply(
    "👋 Chào mừng bạn!\n\nĐể nhận link nhóm, bạn vui lòng bấm nút bên dưới để tham gia trước nhé!",
    {
      parse_mode: "Markdown",
      ...Markup.inlineKeyboard([
        [Markup.button.callback("➡️ Bước 1: Tham gia ngay", "join")],
      ]),
    }
  );
});

bot.action("join", async (ctx) => {
  try {
    // 1. Tắt ngay cái vòng xoay "đang tải"
    await ctx.answerCbQuery();

    // 2. Thay đổi tin nhắn để hiện link và nút "Đã tham gia" ở Bước 2
    await ctx.editMessageText(
      "👇 **BƯỚC 1:** Bạn bấm vào link dưới đây để tham gia:\n" + JOIN_LINK + 
      "\n\n**BƯỚC 2:** Sau khi tham gia xong, hãy bấm nút xác nhận bên dưới!",
      {
        parse_mode: "Markdown",
        ...Markup.inlineKeyboard([
          [Markup.button.callback("✅ Tôi đã tham gia xong", "joined")],
        ]),
      }
    );
  } catch (error) {
    console.error("Lỗi nút join:", error);
  }
});

bot.action("joined", async (ctx) => {
  try {
    // Tắt ngay cái vòng xoay "đang tải"
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

bot.launch({ dropPendingUpdates: true }).then(() => {
  console.log("Bot started!");
});

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
