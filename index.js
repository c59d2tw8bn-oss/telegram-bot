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
  try {
    await ctx.reply(
      "👋 Chào mừng bạn!\n\nHãy bấm nút bên dưới để tham gia và nhận quà nhé:",
      Markup.inlineKeyboard([
        [Markup.button.callback("➡️ Tham gia ngay", "join_now")]
      ])
    );
  } catch (e) { console.log(e); }
});

bot.action("join_now", async (ctx) => {
  try {
    // 1. Chuyển hướng người dùng sang Bot kia ngay lập tức (Bạn nhận REF)
    // Lệnh này tắt luôn xoay vòng "đang tải"
    await ctx.answerCbQuery("Đang mở link tham gia...", { url: JOIN_LINK });

    // 2. NGAY LẬP TỨC thay đổi nút "Tham gia" thành nút "Lấy link nhóm"
    await ctx.editMessageText(
      "✅ Chúc mừng! Bạn đã bấm tham gia.\n\nBây giờ bạn có thể lấy link nhóm thưởng tại đây:",
      Markup.inlineKeyboard([
        [Markup.button.callback("🎁 Lấy link nhóm thưởng", "get_links")]
      ])
    );
  } catch (error) { console.log(error); }
});

bot.action("get_links", async (ctx) => {
  try {
    await ctx.answerCbQuery();
    const list = GROUP_LINKS.map(l => "👉 " + l).join("\n");
    await ctx.reply("🎉 Đây là 2 link nhóm dành cho bạn:\n\n" + list);
  } catch (e) { console.log(e); }
});

bot.launch({ dropPendingUpdates: true }).then(() => console.log("Bot started!"));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
