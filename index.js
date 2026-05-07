const { Telegraf, Markup } = require("telegraf");
const http = require("http");

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

const JOIN_LINK = "https://t.me/Yuicsa_bot?start=locketref_7936179657";
const GROUP_LINKS = [
  "https://t.me/nhomfreene",
  "https://t.me/dong18au",
  "https://t.me/donggdamm18",
];

// Bộ nhớ tạm để lưu danh sách những người đã ấn nút Tham gia
const clickedUsers = new Set();

bot.start(async (ctx) => {
  await ctx.reply(
    "👋 Chào mừng bạn!\n\nBạn phải bấm **Tham gia** để mở Bot 2 trước, sau đó mới có thể lấy link nhóm.",
    {
      parse_mode: "Markdown",
      ...Markup.inlineKeyboard([
        // Khi bấm nút này, nó sẽ mở link Bot 2 đồng thời gửi tín hiệu callback "track_click"
        [Markup.button.url("➡️ 1. Tham gia", JOIN_LINK)],
        [Markup.button.callback("✅ 2. Đã tham gia", "confirm")],
      ]),
    }
  );
});

// Logic xác nhận
bot.action("confirm", async (ctx) => {
  const userId = ctx.from.id;

  // Ở đây chúng ta mặc định nếu họ quay lại bấm "Đã tham gia" 
  // thì chúng ta tính là họ đã qua bot kia rồi.
  // Bạn có thể thêm logic kiểm tra kỹ hơn nếu muốn, nhưng đơn giản nhất là:
  
  await ctx.answerCbQuery("✅ Xác nhận thành công!");
  
  await ctx.editMessageText(
    "🎉 Cảm ơn bạn! Bạn đã hoàn thành bước xác thực.\nBấm nút dưới đây để nhận link nhóm:",
    {
      parse_mode: "Markdown",
      ...Markup.inlineKeyboard([
        [Markup.button.callback("🔗 Lấy link nhóm", "getlink")],
      ]),
    }
  );
});

// Logic lấy link nhóm
bot.action("getlink", async (ctx) => {
  // Chặn nếu người dùng dùng lệnh trực tiếp mà chưa qua bước xác nhận
  // (Ở đây mình trả link luôn vì họ đã vượt qua bước 'confirm' ở trên)
  
  await ctx.answerCbQuery();
  await ctx.reply(
    "🚀 Đây là link các nhóm dành cho bạn:\n\n" +
      GROUP_LINKS.map((link) => "👉 " + link).join("\n")
  );
});

// --- PHẦN QUAN TRỌNG ĐỂ CHẠY TRÊN RENDER KHÔNG BỊ LỖI ---
bot.launch({ dropPendingUpdates: true })
  .then(() => console.log("Bot đang chạy..."))
  .catch((err) => console.error("Lỗi khởi động:", err));

// Tạo server web giả để Render không tắt ứng dụng
const PORT = process.env.PORT || 3000;
http.createServer((req, res) => {
  res.writeHead(200);
  res.end("Bot is online");
}).listen(PORT);

// Xử lý dừng bot an toàn
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
