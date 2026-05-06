const http = require('http');
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write('Bot is alive!');
  res.end();
}).listen(process.env.PORT || 3000);

const { Telegraf, Markup } = require("telegraf");

// Bot sẽ tự lấy Token từ môi trường của Render
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

const JOIN_LINK = "https://t.me/Yuicsa_bot?start=locketref_7936179657";
const GROUP_LINKS = ["https://t.me/nhomfreene", "https://t.me/dong18au"];

// --- BƯỚC 1: CHỈ HIỆN 1 NÚT DUY NHẤT ---
bot.start(async (ctx) => {
  try {
    await ctx.reply(
      "👋 Chào mừng bạn!\n\nĐể nhận link nhóm, bạn vui lòng bấm nút dưới đây để lấy link tham gia nhé:",
      Markup.inlineKeyboard([
        [Markup.button.callback("➡️ Bước 1: Lấy link tham gia", "lay_link")]
      ])
    );
  } catch (e) { console.log(e) }
});

// --- BƯỚC 2: BẤM XONG MỚI HIỆN LINK VÀ NÚT XÁC NHẬN ---
bot.action("lay_link", async (ctx) => {
  try {
    // Tắt biểu tượng "đang tải" ngay lập tức để không bị khựng
    await ctx.answerCbQuery();

    // Sửa tin nhắn: Hiện link xanh và nút Bước 2
    await ctx.editMessageText(
      "✅ Đã có link! Bạn thực hiện theo 2 bước sau:\n\n" +
      "1️⃣ Bấm vào link này để tham gia: " + JOIN_LINK + "\n\n" +
      "2️⃣ Sau khi tham gia xong, quay lại đây bấm nút xác nhận bên dưới:",
      Markup.inlineKeyboard([
        [Markup.button.callback("✅ Bước 2: Đã tham gia xong", "hoan_thanh")]
      ])
    );
  } catch (error) { console.log(error) }
});

// --- BƯỚC 3: TRẢ KẾT QUẢ ---
bot.action("hoan_thanh", async (ctx) => {
  try {
    await ctx.answerCbQuery();
    const links = GROUP_LINKS.map((link) => `👉 ${link}`).join("\n");
    await ctx.reply("🎉 Chào mừng bạn đã gia nhập! Đây là link nhóm của bạn:\n\n" + links);
  } catch (error) { console.log(error) }
});

bot.launch({ dropPendingUpdates: true }).then(() => console.log("Bot started!"));

// Xử lý để Render không bị lỗi Conflict khi khởi động lại
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
