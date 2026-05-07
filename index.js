const { Telegraf, Markup } = require("telegraf");
const http = require("http");

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

const JOIN_LINK = "https://t.me/Yuicsa_bot?start=locketref_7936179657";
const GROUP_LINKS = [
  "https://t.me/nhomfreene",
  "https://t.me/dong18au",
  "https://t.me/donggdamm18",
];

// Dùng Map để theo dõi trạng thái: 1 = đã bấm tham gia, 2 = đã xác nhận
const userProgress = new Map();

bot.start(async (ctx) => {
  const userId = ctx.from.id;
  userProgress.set(userId, 0); // Reset khi bắt đầu lại

  await ctx.reply(
    "👋 Chào mừng bạn!\n\nBạn cần thực hiện đúng thứ tự:\n1️⃣ Bấm **Tham gia**.\n2️⃣ Bấm **Đã tham gia** để xác nhận.",
    {
      parse_mode: "Markdown",
      ...Markup.inlineKeyboard([
        [Markup.button.callback("➡️ 1. Tham gia", "click_join_link")],
        [Markup.button.callback("✅ 2. Đã tham gia", "confirm")],
        [Markup.button.callback("🔗 3. Lấy link nhóm", "getlink")],
      ]),
    }
  );
});

// Bước 1: Khi khách bấm "Tham gia"
bot.action("click_join_link", async (ctx) => {
  const userId = ctx.from.id;
  userProgress.set(userId, 1); // Đánh dấu đã bấm xem link
  
  await ctx.answerCbQuery();
  await ctx.reply(`Vui lòng tham gia tại đây: ${JOIN_LINK}\n\nSau khi tham gia xong, hãy bấm nút "Đã tham gia" ở tin nhắn trên.`);
});

// Bước 2: Xác nhận đã tham gia
bot.action("confirm", async (ctx) => {
  const userId = ctx.from.id;
  
  // CHẶN: Nếu chưa bấm bước 1
  if (userProgress.get(userId) !== 1) {
    return ctx.answerCbQuery("⚠️ Bạn chưa bấm nút '1. Tham gia'!", { show_alert: true });
  }

  userProgress.set(userId, 2); // Đánh dấu đã xác nhận thành công
  await ctx.answerCbQuery("✅ Xác nhận thành công!");
  await ctx.reply("Bây giờ bạn có thể bấm nút '3. Lấy link nhóm' để nhận link.");
});

// Bước 3: Lấy link
bot.action("getlink", async (ctx) => {
  const userId = ctx.from.id;

  // CHẶN: Nếu chưa qua bước xác nhận (status 2)
  if (userProgress.get(userId) !== 2) {
    return ctx.answerCbQuery("❌ Bạn chưa hoàn thành các bước xác nhận!", { show_alert: true });
  }

  await ctx.answerCbQuery();
  await ctx.reply(
    "🎉 Đây là link nhóm dành cho bạn:\n\n" +
      GROUP_LINKS.map((link) => "👉 " + link).join("\n")
  );
});

// Khởi chạy bot (tránh crash)
bot.launch({ dropPendingUpdates: true }).catch(err => console.error(err));

// Server giữ app sống trên Render
const PORT = process.env.PORT || 3000;
http.createServer((req, res) => {
  res.writeHead(200);
  res.end("Bot is running!");
}).listen(PORT);
