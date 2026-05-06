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
      "👋 Chào mừng bạn!\n\nBạn vui lòng bấm nút bên dưới để tham gia, sau đó quay lại đây chọn '✅ Đã tham gia' để nhận link nhóm nhé!",
      Markup.inlineKeyboard([
        // Nút này bấm vào là TỰ CHUYỂN thẳng sang bot Yuicsa, không hiện link rác
        [Markup.button.url("➡️ Tham gia ngay (Bấm để chuyển)", JOIN_LINK)],
        // Nút này để người dùng xác nhận sau khi quay lại
        [Markup.button.callback("✅ Đã tham gia", "joined")]
      ])
    );
  } catch (e) {
    console.log(e);
  }
});

bot.action("joined", async (ctx) => {
  try {
    // Tắt cái xoay vòng ngay lập tức
    await ctx.answerCbQuery();

    const links = GROUP_LINKS.map((link) => `👉 ${link}`).join("\n");
    await ctx.reply("🎉 Cảm ơn bạn đã tham gia!\n\nĐây là link nhóm dành cho bạn:\n" + links);
  } catch (error) {
    console.log(error);
  }
});

bot.launch({ dropPendingUpdates: true }).then(() => {
  console.log("Bot started!");
});

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
