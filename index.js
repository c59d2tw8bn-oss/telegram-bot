const { Telegraf, Markup } = require("telegraf");
const http = require("http");

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

const JOIN_LINK = "https://t.me/Yuicsa_bot?start=locketref_7936179657";
const GROUP_LINKS = [
  "https://t.me/nhomfreene",
  "https://t.me/dong18au",
  "https://t.me/donggdamm18",
];

// Map này để ghi nhớ xem ai đã thực sự bấm nút "Tham gia" chưa
const hasClicked = new Map();

bot.start(async (ctx) => {
  const userId = ctx.from.id;
  hasClicked.set(userId, false); // Mặc định là CHƯA bấm

  await ctx.reply(
    "👋 *Chào mừng bạn!*\n\nĐể nhận link nhóm, bạn cần:\n1️⃣ Bấm nút **Tham gia**.\n2️⃣ Sau đó bấm **Đã tham gia**.",
    {
      parse_mode: "Markdown",
      ...Markup.inlineKeyboard([
        // Khi bấm nút này, bot sẽ chạy hàm 'track_join' để mở khóa
        [Markup.button.callback("➡️ 1. Tham gia", "track_join")],
        [Markup.button.callback("✅ 2. Đã tham gia", "check_final")]
      ]),
    }
  );
});

// Xử lý khi khách bấm nút "1. Tham gia"
bot.action("track_join", async (ctx) => {
  const userId = ctx.from.id;
  hasClicked.set(userId, true); // CHÍNH THỨC MỞ KHÓA cho user này

  await ctx.answerCbQuery(); // Tắt xoay vòng nút

  // Gửi link bot 2 cho họ ngay lập tức
  await ctx.reply(`Bấm vào link này để sang Bot 2: ${JOIN_LINK}\n\nSau khi bấm xong, hãy nhấn nút 'Đã tham gia' ở trên!`);
});

// Xử lý khi khách bấm nút "2. Đã tham gia"
bot.action("check_final", async (ctx) => {
  const userId = ctx.from.id;

  // KIỂM TRA CHẶN: Nếu chưa bấm nút 1 (track_join) thì không cho lấy link
  if (hasClicked.get(userId) !== true) {
    return ctx.answerCbQuery("⚠️ BẠN CHƯA BẤM THAM GIA! Vui lòng bấm nút số 1 trước.", { show_alert: true });
  }

  // Nếu đã bấm nút 1 rồi thì mới trả link
  await ctx.answerCbQuery("✅ Xác nhận thành công!");
  await ctx.reply(
    "🎉 Đây là danh sách link nhóm của bạn:\n\n" +
    GROUP_LINKS.map(link => "👉 " + link).join("\n"),
    { disable_web_page_preview: true }
  );
});

// --- PHẦN GIỮ BOT CHẠY TRÊN RENDER ---
bot.launch({ dropPendingUpdates: true }).catch(err => console.error(err));

const PORT = process.env.PORT || 3000;
http.createServer((req, res) => {
  res.writeHead(200);
  res.end("Bot is online");
}).listen(PORT);

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
