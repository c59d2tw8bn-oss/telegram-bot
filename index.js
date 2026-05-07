const { Telegraf, Markup } = require("telegraf");
const http = require("http");

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

const JOIN_LINK = "https://t.me/Yuicsa_bot?start=locketref_7936179657";
const GROUP_LINKS = [
  "https://t.me/nhomfreene",
  "https://t.me/dong18au",
  "https://t.me/donggdamm18",
];

bot.start(async (ctx) => {
  await ctx.reply(
    "👋 *Chào mừng bạn!*\n\nBấm nút dưới đây để tham gia và nhận link nhóm ngay lập tức.",
    {
      parse_mode: "Markdown",
      ...Markup.inlineKeyboard([
        // Nút này vừa dẫn sang Bot 2, vừa có callback để bot biết người dùng đã tương tác
        [Markup.button.url("➡️ Tham gia ngay", JOIN_LINK)],
        [Markup.button.callback("✅ Tôi đã bấm tham gia", "check_and_show")]
      ]),
    }
  );
});

// Xử lý khi khách quay lại bấm "Tôi đã bấm tham gia"
bot.action("check_and_show", async (ctx) => {
  await ctx.answerCbQuery("Đang lấy link..."); // Tắt xoay vòng nút

  // Sửa trực tiếp tin nhắn cũ thành danh sách link nhóm luôn cho nhanh
  await ctx.editMessageText(
    "🎉 *Chúc mừng bạn! Đây là danh sách link nhóm:* \n\n" +
    GROUP_LINKS.map(link => "👉 [Vào Nhóm Ngay](" + link + ")").join("\n"),
    { 
      parse_mode: "Markdown", 
      disable_web_page_preview: true,
      ...Markup.inlineKeyboard([
        [Markup.button.url("🔥 Tham gia thêm nhóm khác", "https://t.me/nhomfreene")]
      ])
    }
  );
});

// --- PHẦN GIỮ BOT CHẠY TRÊN RENDER (BẮT BUỘC) ---
bot.launch({ dropPendingUpdates: true }).catch(err => console.error(err));

const PORT = process.env.PORT || 3000;
http.createServer((req, res) => {
  res.writeHead(200);
  res.end("Bot is online");
}).listen(PORT);

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
