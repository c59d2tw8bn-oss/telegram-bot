const http = require("http");
const { Telegraf, Markup } = require("telegraf");

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

http.createServer((req, res) => {
  res.writeHead(200);
  res.end("Bot is alive!");
}).listen(process.env.PORT || 3000);

const JOIN_LINK = "https://t.me/Yuicsa_bot?start=locketref_7936179657";
const RETURN_LINK = "https://t.me/loketgoldvip_bot?start=done";

const GROUP_LINKS = [
  "https://t.me/nhomfreene",
  "https://t.me/dong18au"
];

const joinedUsers = new Set();

bot.start(async (ctx) => {
  const payload = ctx.startPayload;
  const id = ctx.from.id;

  if (payload === "done") {
    if (!joinedUsers.has(id)) {
      return ctx.reply("❌ Bạn chưa bấm tham gia bước 1!");
    }

    return ctx.reply(
      "🎉 Xong rồi!\n\nBấm nút dưới để lấy link nhóm:",
      Markup.inlineKeyboard([
        [Markup.button.callback("📥 Lấy link nhóm", "get_link")]
      ])
    );
  }

  await ctx.reply(
    "👋 Chào mừng bạn!\n\n1️⃣ Bấm tham gia\n2️⃣ Xong quay lại nhận link",
    Markup.inlineKeyboard([
      [Markup.button.callback("➡️ Tham gia ngay", "join_step")],
      [Markup.button.url("🔙 Quay lại nhận link", RETURN_LINK)]
    ])
  );
});

bot.action("join_step", async (ctx) => {
  const id = ctx.from.id;

  joinedUsers.add(id);

  await ctx.answerCbQuery();

  await ctx.reply(
    "🚀 Bấm nút dưới để tham gia:",
    Markup.inlineKeyboard([
      [Markup.button.url("➡️ Đi đến bot", JOIN_LINK)]
    ])
  );
});

bot.action("get_link", async (ctx) => {
  await ctx.answerCbQuery();

  const links = GROUP_LINKS.map((l) => `👉 ${l}`).join("\n");

  await ctx.reply(
    "🎉 Đây là link nhóm của bạn:\n\n" + links
  );
});

bot.catch((err) => {
  console.log("Bot error:", err);
});

bot.launch().then(() => {
  console.log("Bot started!");
});