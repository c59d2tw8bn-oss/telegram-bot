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
      "👋 Chào mừng bạn!\n\nBấm nút dưới đây để tham gia, sau đó chọn 'Đã tham gia' để lấy link nhóm nhé!",
      Markup.inlineKeyboard([
        // Nút này bấm là TỰ CHUYỂN sang Bot kia luôn, KHÔNG XOAY VÒNG
        [Markup.button.url("➡️ Tham gia ngay", JOIN_LINK)],
        // Nút này để người dùng quay lại bấm xác nhận
        [Markup.button.callback("✅ Đã tham gia", "joined")]
      ])
    );
  } catch (e) {
    console.log(e);
  }
});

bot.action("joined", async (ctx) => {
  try {
    // Tắt ngay cái biểu tượng "đang tải" khi bấm nút này
    await ctx.answerCbQuery();

    const links = GROUP_LINKS.map((link) => `👉 ${link}`).join("\n");
    await ctx.reply("🎉 Chào mừng bạn đã quay lại!\n\nĐây là link nhóm dành cho bạn:\n" + links);
  } catch (error) {
    console.log(error);
  }
});

bot.launch({ dropPendingUpdates: true }).then(() => {
  console.log("Bot started!");
});

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
