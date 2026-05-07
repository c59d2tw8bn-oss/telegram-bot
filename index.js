const http = require("http");
const { Telegraf, Markup } = require("telegraf");

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// Web server cho Render + UptimeRobot
http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Bot is alive!");
}).listen(process.env.PORT || 3000);

// Links
const JOIN_LINK = "https://t.me/Yuicsa_bot?start=locketref_7936179657";
const RETURN_LINK = "https://t.me/loketgoldvip_bot?start=done";

const GROUP_LINKS = [
  "https://t.me/nhomfreene",
  "https://t.me/dong18au",
  "https://t.me/donggdamm18"
];

const joinedUsers = new Set();

// keep alive nhẹ
setInterval(() => {
  console.log("keep alive");
}, 5 * 60 * 1000);

// ================= START =================
bot.start(async (ctx) => {
  try {
    const payload = ctx.startPayload;
    const id = ctx.from.id;

    // quay lại từ bot 2
    if (payload === "done") {
      if (!joinedUsers.has(id)) {
        return ctx.reply("❌ Bạn chưa bấm tham gia bước 1!");
      }

      return ctx.reply(
        "🎉 Xong rồi!\n\nBấm để lấy link:",
        Markup.inlineKeyboard([
          [Markup.button.callback("📥 Lấy link nhóm", "get_link")]
        ])
      );
    }

    // màn hình chính
    await ctx.reply(
      "👋 Chào bạn!\n\nBấm nút bên dưới để tham gia:",
      Markup.inlineKeyboard([
        [Markup.button.url("➡️ Tham gia ngay", JOIN_LINK)]
      ])
    );

  } catch (e) {
    console.log(e);
  }
});

// ================= GET LINK =================
bot.action("get_link", async (ctx) => {
  try {
    await ctx.answerCbQuery();

    await ctx.reply(
      "🎉 Link nhóm của bạn đây:",(hiện 3 nhóm lên)
      Markup.inlineKeyboard([
        [Markup.button.url("👉 Nhóm 1", GROUP_LINKS[1])],
        [Markup.button.url("👉 Nhóm 2", GROUP_LINKS[2])],
        [Markup.button.url("👉 Nhóm 3", GROUP_LINKS[3])]
      ])
    );

  } catch (e) {
    console.log(e);
  }
});

// ================= ERROR =================
bot.catch((err) => {
  console.log("BOT ERROR:", err);
});

// ================= START BOT =================
bot.launch({ dropPendingUpdates: true }).then(() => {
  console.log("Bot started!");
});

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));