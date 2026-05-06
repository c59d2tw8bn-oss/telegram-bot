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

// BƯỚC 1: Chỉ hiện duy nhất 1 nút Tham Gia
bot.start(async (ctx) => {
  try {
    await ctx.reply(
      "👋 Chào mừng bạn!\n\nVui lòng bấm nút bên dưới để tham gia trước nhé:",
      Markup.inlineKeyboard([
        [Markup.button.callback("➡️ Bước 1: Tham gia ngay", "step1")]
      ])
    );
  } catch (e) { console.log(e) }
});

// BƯỚC 2: Khi bấm nút 1, Bot sẽ tự chuyển hướng và ĐỔI tin nhắn hiện nút 2
bot.action("step1", async (ctx) => {
  try {
    // 1. Mở link Bot kia (Tự động chuyển hướng)
    await ctx.answerCbQuery("Đang chuyển hướng...", { url: JOIN_LINK });

    // 2. Thay đổi tin nhắn cũ, lúc này mới hiện nút "Đã tham gia"
    await ctx.editMessageText(
      "✅ Bạn đang được chuyển đến Bot tham gia...\n\nSau khi bấm 'Start' ở Bot kia xong, hãy quay lại đây bấm nút xác nhận bên dưới nhé!",
      Markup.inlineKeyboard([
        [Markup.button.callback("✅ Bước 2: Đã tham gia", "joined")]
      ])
    );
  } catch (error) { console.log(error) }
});

// BƯỚC 3: Trả kết quả link nhóm
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
