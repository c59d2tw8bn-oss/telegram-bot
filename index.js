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

// Join status (tạm thời)
const joinedUsers = new Set();

// giữ bot đỡ sleep nhẹ
setInterval(() => {
  console.log("keep alive");
}, 5 * 60 * 1000);

// ================= START =================
bot.start(async (ctx) => {
  try {
    const payload = ctx.startPayload;
    const id = ctx.from.id;

    // quay lại
    if (payload === "done") {
      if (!joinedUsers.has(id)) {
        return ctx.reply("❌ Bạn chưa bấm tham gia bước 1!");
      }

      return ctx.reply("🎉 Xong rồi! Bấm để lấy link:");
    }

    await ctx.reply(
      "👋 Chào bạn!\n\n1️⃣ Bấm tham gia\n2️⃣ Xong quay lại nhận link",
      Markup.inlineKeyboard([
        [Markup.button.callback("➡️ Tham gia ngay", "join_step")],
        [Markup.button.url("🔙 Quay lại nhận link", RETURN_LINK)]
      ])
    );

  } catch (e) {
    console.log(e);
  }
});

// ================= B1 =================
bot.action("join_step", async (ctx) => {
  try {
    const id = ctx.from.id;

    joinedUsers.add(id);

    await ctx.answerCbQuery();

    await ctx.reply(
      "🚀 Bấm vào đây để tham gia:",
      Markup.inlineKeyboard([
        [Markup.button.url("➡️ Đi tới bot", JOIN_LINK)]
      ])
    );

  } catch (e) {
    console.log(e);
  }
});

// ================= GET LINK (ĐÃ LÀM ĐẸP) =================
bot.action("get_link", async (ctx) => {
  try {
    await ctx.answerCbQuery();

    await ctx.reply(
      "🎉 Link nhóm của bạn đây:",
      Markup.inlineKeyboard([
        [Markup.button.url("👉 Nhóm 1", "https://t.me/nhomfreene")],
        [Markup.button.url("👉 Nhóm 2", "https://t.me/dong18au")],
        [Markup.button.url("👉 Nhóm 3", "https://t.me/donggdamm18")]
      ])
    );

  } catch (e) {
    console.log(e);
  }
});

// error
bot.catch((err) => {
  console.log("BOT ERROR:", err);
});

// launch
bot.launch({ dropPendingUpdates: true }).then(() => {
  console.log("Bot started!");
});

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));