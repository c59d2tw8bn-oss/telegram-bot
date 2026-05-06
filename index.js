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

// BƯỚC 1: Hiện 1 nút lấy link
bot.start(async (ctx) => {
  try {
    await ctx.reply(
      "👋 Chào mừng bạn!\n\nĐể nhận link nhóm, vui lòng thực hiện theo các bước bên dưới:",
      Markup.inlineKeyboard([
        [Markup.button.callback("➡️ Bước 1: Lấy link tham gia", "step1")]
      ])
    );
  } catch (e) { console.log(e); }
});

// BƯỚC 2: Bấm nút 1 -> Hiện link và nút 2 (Gửi tin mới để tránh xoay vòng)
bot.action("step1", async (ctx) => {
  try {
    // 1. Tắt ngay lập tức cái đang tải
    await ctx.answerCbQuery().catch(() => {}); 

    // 2. Gửi một tin nhắn mới hoàn toàn (Cách này 100% hết load)
    await ctx.reply(
      "✅ Đã lấy link tham gia!\n\n1️⃣ Bạn tham gia tại đây: " + JOIN_LINK + "\n\n2️⃣ Sau khi tham gia xong, bấm nút dưới đây để nhận link nhóm:",
      Markup.inlineKeyboard([
        [Markup.button.callback("✅ Bước 2: Đã tham gia xong", "step2")]
      ])
    );
  } catch (e) { console.log(e); }
});

// BƯỚC 3: Trả kết quả
bot.action("step2", async (ctx) => {
  try {
    await ctx.answerCbQuery().catch(() => {});
    const list = GROUP_LINKS.map(l => "👉 " + l).join("\n");
    await ctx.reply("🎉 Cảm ơn bạn! Đây là link nhóm dành cho bạn:\n\n" + list);
  } catch (e) { console.log(e); }
});

bot.launch({ dropPendingUpdates: true });

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
