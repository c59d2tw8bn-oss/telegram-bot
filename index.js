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
      "👋 Chào mừng bạn!\n\nĐể nhận link nhóm, bạn vui lòng thực hiện theo các bước bên dưới:",
      Markup.inlineKeyboard([
        [Markup.button.callback("➡️ Bước 1: Lấy link tham gia", "step1")]
      ])
    );
  } catch (e) { console.log(e) }
});

bot.action("step1", async (ctx) => {
  try {
    // Tắt xoay vòng ngay lập tức
    await ctx.answerCbQuery();

    // Thay đổi tin nhắn: Hiện link và hiện nút Bước 2
    await ctx.editMessageText(
      "✅ Đã lấy link thành công!\n\n1️⃣ Bạn bấm vào link này để tham gia: " + JOIN_LINK + "\n\n2️⃣ Sau khi tham gia xong, bấm nút xác nhận dưới đây:",
      Markup.inlineKeyboard([
        [Markup.button.callback("✅ Bước 2: Đã tham gia", "joined")]
      ])
    );
  } catch (error) { console.log(error) }
});

bot.action("joined", async (ctx) => {
  try {
    await ctx.answerCbQuery();
    const links = GROUP_LINKS.map((link) => `👉 ${link}`).join("\n");
    await ctx.reply("🎉 Chào mừng bạn!\n\nĐây là link nhóm dành cho bạn:\n" + links);
  } catch (error) { console.log(error) }
});

bot.launch({ dropPendingUpdates: true }).then(() => console.log("Bot started!"));

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
