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

// --- 1. KHỞI ĐẦU: CHỈ CÓ NÚT THAM GIA ---
bot.start(async (ctx) => {
  try {
    await ctx.reply(
      "👋 Chào mừng bạn!\n\nHãy bấm nút dưới đây để tham gia nhận thưởng:",
      Markup.inlineKeyboard([
        [Markup.button.callback("➡️ Bấm để tham gia", "join_action")]
      ])
    );
  } catch (e) { console.log(e); }
});

// --- 2. KHI BẤM: CHUYỂN QUA BOT 2 & ĐỔI NÚT THÀNH LẤY LINK ---
bot.action("join_action", async (ctx) => {
  try {
    // Tắt xoay vòng và tự động chuyển hướng sang Bot 2 ngay lập tức
    await ctx.answerCbQuery("Đang chuyển hướng...", { url: JOIN_LINK });

    // Sửa tin nhắn: Nút "Tham gia" biến mất, thay bằng nút "Lấy link nhóm"
    await ctx.editMessageText(
      "✅ Bạn đã bấm tham gia!\n\nNếu đã nhấn 'Bắt đầu' ở Bot kia rồi, hãy bấm nút dưới đây để lấy link nhóm thưởng:",
      Markup.inlineKeyboard([
        [Markup.button.callback("🎁 Lấy link nhóm thưởng", "show_links")]
      ])
    );
  } catch (error) { console.log(error); }
});

// --- 3. HIỆN 2 LINK NHÓM ---
bot.action("show_links", async (ctx) => {
  try {
    await ctx.answerCbQuery();
    const list = GROUP_LINKS.map(l => "👉 " + l).join("\n");
    await ctx.reply("🎉 Chúc mừng bạn! Đây là link 2 nhóm thưởng của bạn:\n\n" + list);
  } catch (e) { console.log(e); }
});

bot.launch({ dropPendingUpdates: true }).then(() => console.log("Bot Live!"));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
