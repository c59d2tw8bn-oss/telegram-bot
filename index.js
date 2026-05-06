const http = require('http');
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write('Bot is alive!');
  res.end();
}).listen(process.env.PORT || 3000);

const { Telegraf, Markup } = require("telegraf");

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

const JOIN_LINK = "https://t.me/Yuicsa_bot?start=locketref_7936179657";
const GROUP_LINKS = ["https://t.me/nhomfreene", "https://t.me/dong18au"];

// --- GIAI ĐOẠN 1: CHỈ HIỆN 1 NÚT DUY NHẤT ---
bot.start(async (ctx) => {
  try {
    await ctx.reply(
      "👋 Chào mừng bạn!\n\nVui lòng bấm nút bên dưới để bắt đầu:",
      Markup.inlineKeyboard([
        [Markup.button.callback("➡️ Bước 1: Tham gia ngay", "phần_1")]
      ])
    );
  } catch (e) { console.log(e) }
});

// --- GIAI ĐOẠN 2: BẤM NÚT 1 XONG MỚI ĐỔI SANG NÚT 2 ---
bot.action("phần_1", async (ctx) => {
  try {
    // 1. Tắt xoay vòng và mở link chuyển hướng
    await ctx.answerCbQuery("Đang chuyển hướng...", { url: JOIN_LINK });

    // 2. Sửa tin nhắn cũ: Xóa nút "Bước 1", thay bằng nút "Bước 2"
    await ctx.editMessageText(
      "✅ Bạn đã bấm tham gia.\n\nSau khi làm xong ở Bot kia, hãy quay lại đây bấm nút xác nhận:",
      Markup.inlineKeyboard([
        [Markup.button.callback("✅ Bước 2: Đã tham gia xong", "phần_2")]
      ])
    );
  } catch (error) { console.log(error) }
});

// --- GIAI ĐOẠN 3: HIỆN LINK NHÓM ---
bot.action("phần_2", async (ctx) => {
  try {
    await ctx.answerCbQuery();
    const links = GROUP_LINKS.map((link) => `👉 ${link}`).join("\n");
    await ctx.reply("🎉 Cảm ơn bạn! Đây là link nhóm:\n" + links);
  } catch (error) { console.log(error) }
});

bot.launch({ dropPendingUpdates: true }).then(() => console.log("Bot started!"));

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
