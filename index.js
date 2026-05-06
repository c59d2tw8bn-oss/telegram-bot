const http = require('http');
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write('Bot is alive!');
  res.end();
}).listen(process.env.PORT || 3000);

const { Telegraf, Markup } = require("telegraf");

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// 👉 Link sang bot khác
const JOIN_LINK = "https://t.me/Yuicsa_bot?start=locketref_7936179657";

// 👉 Link quay lại bot của bạn (đã sửa sẵn)
const RETURN_LINK = "https://t.me/loketgoldvip_bot?start=done";

// 👉 Link nhóm
const GROUP_LINKS = [
  "https://t.me/nhomfreene",
  "https://t.me/dong18au"
];

bot.start(async (ctx) => {
  try {
    const payload = ctx.startPayload;

    // ✅ Nếu quay lại → hiện nút lấy link
    if (payload === "done") {
      return ctx.reply(
        "🎉 Xong rồi!\n\nBấm nút dưới để lấy link nhóm:",
        Markup.inlineKeyboard([
          [Markup.button.callback("📥 Lấy link nhóm", "get_link")]
        ])
      );
    }

    // ✅ Lần đầu vào
    await ctx.reply(
      "👋 Chào mừng bạn!\n\n1️⃣ Bấm tham gia\n2️⃣ Xong thì bấm quay lại để nhận link",
      Markup.inlineKeyboard([
        [Markup.button.url("➡️ Tham gia ngay", JOIN_LINK)],
        [Markup.button.url("🔙 Quay lại nhận link", RETURN_LINK)]
      ])
    );
  } catch (e) {
    console.log(e);
  }
});

// ✅ Nút lấy link
bot.action("get_link", async (ctx) => {
  try {
    await ctx.answerCbQuery();

    const links = GROUP_LINKS.map((l) => `👉 ${l}`).join("\n");
    await ctx.reply("🎉 Đây là link nhóm của bạn:\n\n" + links);
  } catch (e) {
    console.log(e);
  }
});

bot.launch({ dropPendingUpdates: true }).then(() => {
  console.log("Bot started!");
});

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));