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

// --- BƯỚC 1: CHỈ HIỆN 1 NÚT THAM GIA ---
bot.start(async (ctx) => {
  try {
    await ctx.reply(
      "👋 Chào mừng bạn!\n\nVui lòng bấm nút bên dưới để tham gia Bot, sau đó link nhóm thưởng sẽ hiện ra!",
      Markup.inlineKeyboard([
        [Markup.button.callback("➡️ Bước 1: Tham gia để nhận thưởng", "bam_tham_gia")]
      ])
    );
  } catch (e) { console.log(e); }
});

// --- BƯỚC 2: BẤM XONG MỚI HIỆN NÚT "ĐÃ THAM GIA" ---
bot.action("bam_tham_gia", async (ctx) => {
  try {
    // 1. Chuyển hướng người dùng sang bot Yuicsa ngay lập tức (Để bạn nhận REF)
    // Dùng lệnh này giúp TẮT XOAY VÒNG và NHẢY LINK cùng lúc
    await ctx.answerCbQuery("Đang chuyển hướng sang Bot...", { url: JOIN_LINK });

    // 2. Sửa tin nhắn: Xóa nút cũ, hiện nút "Đã tham gia" để bắt họ bấm lần 2
    await ctx.editMessageText(
      "✅ Bạn đã bấm tham gia Bot Yuicsa!\n\nSau khi bấm 'Start' ở bên đó xong, hãy quay lại đây bấm nút xác nhận để lấy 2 link nhóm thưởng:",
      Markup.inlineKeyboard([
        [Markup.button.callback("✅ Bước 2: Đã tham gia (Nhận link)", "nhan_thuong")]
      ])
    );
  } catch (error) { console.log(error); }
});

// --- BƯỚC 3: HIỆN 2 LINK NHÓM THƯỞNG ---
bot.action("nhan_thuong", async (ctx) => {
  try {
    await ctx.answerCbQuery();
    const links = GROUP_LINKS.map(l => "👉 " + l).join("\n");
    await ctx.reply(
      "🎉 Chúc mừng bạn đã hoàn thành!\n\nĐây là 2 nhóm thưởng dành cho bạn:\n\n" + links
    );
  } catch (error) { console.log(error); }
});

bot.launch({ dropPendingUpdates: true }).then(() => console.log("Bot started!"));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
