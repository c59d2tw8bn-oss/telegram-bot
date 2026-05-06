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
    const args = ctx.startPayload;

    // Nếu user quay lại từ link (có payload) → cho luôn link nhóm
    if (args) {
      const links = GROUP_LINKS.map((link) => `👉 ${link}`).join("\n");
      return ctx.reply("🎉 Đây là link nhóm của bạn:\n\n" + links);
    }

    // Lần đầu vào → chỉ hiện nút tham gia
    await ctx.reply(
      "👋 Chào mừng bạn!\n\nBạn bấm nút bên dưới để tham gia, sau đó quay lại bot để nhận link nhé!",
      Markup.inlineKeyboard([
        [Markup.button.url("➡️ Tham gia ngay", JOIN_LINK)]
      ])
    );
  } catch (e) {
    console.log(e);
  }
});

bot.launch({ dropPendingUpdates: true }).then(() => {
  console.log("Bot started!");
});

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));