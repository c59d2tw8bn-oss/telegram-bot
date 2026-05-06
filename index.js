const http = require("http");
const { Telegraf, Markup } = require("telegraf");

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// 👉 Web server cho Render + UptimeRobot ping
http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Bot is alive!");
}).listen(process.env.PORT || 3000);

// 👉 Links
const JOIN_LINK = "https://t.me/Yuicsa_bot?start=locketref_7936179657";
const RETURN_LINK = "https://t.me/loketgoldvip_bot?start=done";

const GROUP_LINKS = [
  "https://t.me/nhomfreene",
  "https://t.me/donggdamm18"
];

// 👉 lưu user (tạm thời)
const joinedUsers = new Set();

// 👉 chống bot ngủ nhẹ
setInterval(() => {
  console.log("keep alive");
}, 5 * 60 * 1000);

// ================= START =================
bot.start(async (ctx) => {
  try {
    const payload = ctx.startPayload;
    const id = ctx.from.id;

    // 🔥 quay lại
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

    // 🔥 lần đầu vào
    await ctx.reply(
      "👋 Chào mừng bạn!\n\n1️⃣ Bấm tham gia\n2️⃣ Xong quay lại nhận link",
      Markup.inlineKeyboard([
        [Markup.button.callback("➡️ Tham gia ngay", "join_step")],
        [Markup.button.url("🔙 Quay lại nhận link", RETURN_LINK)]
      ])
    );

  } catch (err) {
    console.log("START ERROR:", err);
  }
});

// ================= B1 =================
bot.action("join_step", async (ctx) => {
  try {
    const id = ctx.from.id;

    joinedUsers.add(id);

    await ctx.answerCbQuery();

    await ctx.reply(
      "🚀 Bấm link dưới để tham gia:",
      Markup.inlineKeyboard([
        [Markup.button.url("➡️ Đi đến bot", JOIN_LINK)]
      ])
    );

  } catch (err) {
    console.log("JOIN ERROR:", err);
  }
});

// ================= GET LINK =================
bot.action("get_link", async (ctx) => {
  try {
    await ctx.answerCbQuery();

    const links = GROUP_LINKS.map((l) => `👉 ${l}`).join("\n");

    await ctx.reply("🎉 Đây là link nhóm của bạn:\n\n" + links);

  } catch (err) {
    console.log("LINK ERROR:", err);
  }
});

// ================= ERROR CATCH =================
bot.catch((err) => {
  console.log("BOT ERROR:", err);
});

// ================= LAUNCH =================
bot.launch({ dropPendingUpdates: true }).then(() => {
  console.log("Bot started!");
});

// ================= SAFE SHUTDOWN =================
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));