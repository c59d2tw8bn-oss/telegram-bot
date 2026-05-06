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
        [Markup.button.callback("➡️ Tham gia ngay", "join")],
      ]),
    }
  );
});

bot.action("join", async (ctx) => {
  try {
    // SỬA TẠI ĐÂY: Thay vì để url trong answerCbQuery (gây xoay vòng), 
    // mình trả lời nhanh để tắt xoay vòng rồi gửi tin nhắn mới kèm link.
    await ctx.answerCbQuery("Đang lấy link tham gia..."); 

    await ctx.editMessageText(
      "👋 Chào mừng bạn!\n\nBấm vào link này để tham gia: " + JOIN_LINK + "\n\nSau khi tham gia xong, bấm nút bên dưới để nhận link nhóm!",
      {
        parse_mode: "Markdown",
        ...Markup.inlineKeyboard([
          [Markup.button.callback("✅ Đã tham gia", "joined")],
        ]),
      }
    );
  } catch (error) {
    console.log(error);
  }
});

bot.action("joined", async (ctx) => {
  try {
    await ctx.answerCbQuery();
    await ctx.editMessageText(
      "🎉 Cảm ơn bạn đã tham gia!\n\nĐây là link nhóm dành cho bạn:",
      { parse_mode: "Markdown" }
    );
    await ctx.reply(GROUP_LINKS.map((link) => `👉 ${link}`).join("\n"));
  } catch (error) {
    console.log(error);
  }
});

bot.launch({ dropPendingUpdates: true });
console.log("Bot started!");

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
