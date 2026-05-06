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
      "👋 Chào mừng bạn!\n\nĐể nhận link nhóm, bạn vui lòng bấm nút bên dưới để tham gia trước nhé!",
      Markup.inlineKeyboard([
        [Markup.button.callback("➡️ Tham gia ngay", "join")]
      ])
    );
  } catch (e) { console.log(e) }
});

bot.action("join", async (ctx) => {
  try {
    await ctx.answerCbQuery(); 
    
    // Gửi tin nhắn chứa link ref của bạn
    await ctx.reply(
      "👇 BƯỚC 1: Bấm vào link này để tham gia:\n\n" + JOIN_LINK + "\n\n👇 BƯỚC 2: Sau khi tham gia xong, hãy bấm nút xác nhận bên dưới:",
      Markup.inlineKeyboard([
        [Markup.button.callback("✅ Đã tham gia", "joined")]
      ])
    );
  } catch (error) {
    console.log(error);
  }
});

bot.action("joined", async (ctx) => {
  try {
    await ctx.answerCbQuery();
    const links = GROUP_LINKS.map((link) => `👉 ${link}`).join("\n");
    await ctx.reply("🎉 Cảm ơn bạn đã tham gia!\n\nĐây là link nhóm dành cho bạn:\n" + links);
  } catch (error) {
    console.log(error);
  }
});

bot.launch({ dropPendingUpdates: true }).then(() => console.log("Bot started!"));

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
