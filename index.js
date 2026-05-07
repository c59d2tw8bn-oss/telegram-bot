const http = require('http');
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write('Bot is alive!');
  res.end();
}).listen(process.env.PORT || 3000);

const { Telegraf, Markup } = require("telegraf");

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

const JOIN_LINK = "https://t.me/Yuicsa_bot?start=locketref_7936179657";
const RETURN_LINK = "https://t.me/loketgoldvip_bot?start=done";

const GROUP_LINKS = [
  "https://t.me/nhomfreene",
  "https://t.me/dong18au"
  "https://t.me/donggdamm18"
];

// 👉 Lưu user đã bấm B1
const joinedUsers = new Set();

bot.start(async (ctx) => {
  try {
    const payload = ctx.startPayload;
    const id = ctx.from.id;

    // ✅ Nếu quay lại
    if (payload === "done") {
      if (!joinedUsers.has(id)) {
        return ctx.reply("❌ Bạn chưa bấm nút THAM GIA bước 1!");
      }

      return ctx.reply(
        "🎉 Xong rồi!\n\nBấm nút dưới để lấy link nhóm:",
        Markup.inlineKeyboard([
          [Markup.button.callback("📥 Lấy link nhóm", "get_link")]
        ])
      );
    }

    // ✅ Lần đầu → KHÔNG add user vội
    await ctx.reply(
      "👋 Chào mừng bạn!\n\n1️⃣ Bấm THAM GIA\n2️⃣ Xong bấm QUAY LẠI",
      Markup.inlineKeyboard([
        [Markup.button.callback("➡️ Tham gia ngay", "join_step")],
        [Markup.button.url("🔙 Quay lại nhận link", RETURN_LINK)]
      ])
    );
  } catch (e) {
    console.log(e);
  }
});

// 👉 Khi bấm nút THAM GIA
bot.action("join_step", async (ctx) => {
  try {
    const id = ctx.from.id;

    joinedUsers.add(id); // ✅ chỉ add khi bấm nút

    await ctx.answerCbQuery();
    await ctx.reply(
      "👉 Nhấn link dưới để tham gia, xong quay lại nhé:",
      Markup.inlineKeyboard([
        [Markup.button.url("🚀 Đi đến bot tham gia", JOIN_LINK)]
      ])
    );
  } catch (e) {
    console.log(e);
  }
});

// 👉 Lấy link nhóm
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