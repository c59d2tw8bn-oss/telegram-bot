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

// BƯỚC 1: Chỉ 1 nút
bot.start(async (ctx) => {
  try {
    await ctx.reply(
      "👋 Chào mừng bạn!\n\nBấm nút dưới đây để lấy link tham gia:",
      Markup.inlineKeyboard([
        [Markup.button.callback("➡️ Bước 1: Lấy link tham gia", "step1")]
      ])
    );
  } catch (e) { console.log(e); }
});

// BƯỚC 2: Bấm nút 1 xong mới hiện link và nút 2
bot.action("step1", async (ctx) => {
  try {
    // Phải có dòng này để hết xoay vòng
    await ctx.answerCbQuery().catch(() => {}); 

    await ctx.editMessageText(
      "✅ Đã có link! Thực hiện 2 bước:\n\n1️⃣ Bấm vào link: " + JOIN_LINK + "\n\n2️⃣ Sau đó bấm nút xác nhận dưới đây:",
      Markup.inlineKeyboard([
        [Markup.button.callback("✅ Bước 2: Đã tham gia", "step2")]
      ])
    );
  } catch (e) { console.log(e); }
});

// BƯỚC 3: Link nhóm
bot.action("step2", async (ctx) => {
  try {
    await ctx.answerCbQuery().catch(() => {});
    const list = GROUP_LINKS.map(l => "👉 " + l).join("\n");
    await ctx.reply("🎉 Link nhóm của bạn:\n\n" + list);
  } catch (e) { console.log(e); }
});

bot.launch({ dropPendingUpdates: true });
console.log("Bot is running...");

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
