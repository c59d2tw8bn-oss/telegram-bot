const { Telegraf, Markup } = require("telegraf");
const http = require("http");

// Kiểm tra Token trong Environment Variables của Render
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

const JOIN_LINK = "https://t.me/Yuicsa_bot?start=locketref_7936179657";
const GROUP_LINKS = [
  "https://t.me/nhomfreene",
  "https://t.me/dong18au",
  "https://t.me/donggdamm18",
];

// Map lưu trạng thái để chặn người dùng "vượt rào"
const userStep = new Map();

bot.start(async (ctx) => {
  const userId = ctx.from.id;
  userStep.set(userId, 0); // Reset trạng thái về ban đầu

  await ctx.reply(
    "👋 *Chào mừng bạn!*\n\nHãy làm theo thứ tự để nhận link nhóm:\n\n1️⃣ Bấm nút **Tham gia** bên dưới.",
    {
      parse_mode: "Markdown",
      ...Markup.inlineKeyboard([
        [Markup.button.callback("➡️ 1. Tham gia", "step_1")],
        [Markup.button.callback("🔒 2. Đã tham gia (Chưa mở)", "locked")]
      ]),
    }
  );
});

// Xử lý khi bấm nút "1. Tham gia"
bot.action("step_1", async (ctx) => {
  const userId = ctx.from.id;
  userStep.set(userId, 1); // Đánh dấu đã bấm tham gia

  await ctx.answerCbQuery(); // Tắt biểu tượng "đang tải"

  // Sửa tin nhắn cũ để hiện nút Đã tham gia (mở khóa)
  await ctx.editMessageText(
    "🔗 *BƯỚC TIẾP THEO:*\n\nBạn hãy bấm vào link này để sang Bot 2: " + JOIN_LINK + "\n\nSau đó quay lại đây bấm **Đã tham gia** để lấy link nhóm nhé!",
    {
      parse_mode: "Markdown",
      ...Markup.inlineKeyboard([
        [Markup.button.callback("✅ 2. Đã tham gia (Bấm để lấy link)", "step_2")]
      ]),
    }
  );
});

// Xử lý khi nút vẫn đang khóa
bot.action("locked", async (ctx) => {
  await ctx.answerCbQuery("⚠️ Bạn phải bấm nút '1. Tham gia' trước đã!", { show_alert: true });
});

// Xử lý khi bấm nút "2. Đã tham gia"
bot.action("step_2", async (ctx) => {
  const userId = ctx.from.id;

  // Kiểm tra kỹ lần nữa xem đã qua bước 1 chưa
  if (userStep.get(userId) !== 1) {
    return ctx.answerCbQuery("❌ Bạn cần bấm nút tham gia trước!", { show_alert: true });
  }

  await ctx.answerCbQuery("🎉 Thành công!");
  await ctx.reply(
    "🚀 *Đây là link các nhóm dành cho bạn:*\n\n" +
    GROUP_LINKS.map(link => "👉 [Nhấn vào đây để vào nhóm](" + link + ")").join("\n"),
    { parse_mode: "Markdown", disable_web_page_preview: true }
  );
});

// --- PHẦN QUAN TRỌNG ĐỂ CHẠY TRÊN RENDER KHÔNG BỊ LỖI ---
bot.launch({ dropPendingUpdates: true })
  .then(() => console.log("Bot đang hoạt động ổn định!"))
  .catch((err) => console.error("Lỗi khởi động Bot:", err));

// Giữ bot không bị Render tắt (Fix lỗi Status 1)
const PORT = process.env.PORT || 3000;
http.createServer((req, res) => {
  res.writeHead(200);
  res.end("Bot is live!");
}).listen(PORT, () => {
  console.log("Server giữ mạng đang chạy trên cổng: " + PORT);
});

// Xử lý dừng bot an toàn
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
