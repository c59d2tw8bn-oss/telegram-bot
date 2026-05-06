const { Telegraf, Markup } = require("telegraf");
require('http').createServer((req, res) => res.end('OK')).listen(process.env.PORT || 3000);

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const LINK_REF = "https://t.me/Yuicsa_bot?start=locketref_7936179657";

// BƯỚC 1: CHỈ HIỆN 1 NÚT THAM GIA
bot.start((ctx) => {hi
// BƯỚC 2: CÚ BẤM "THẦN THÁNH"
bot.action("phat_mot", (ctx) => {
  // 1. NHẢY QUA BOT 2 NGAY LẬP TỨC (Dùng lệnh này sẽ tắt luôn cái xoay vòng 'Đang tải')
  ctx.answerCbQuery("Đang chuyển hướng...", { url: LINK_REF }).catch(() => {});

  // 2. HIỆN NÚT LẤY LINK NHÓM (Dùng tin nhắn mới để chắc chắn không bị treo)
  ctx.reply("✅ Bạn đã bấm tham gia!\n\nNếu đã nhấn 'Bắt đầu' ở Bot kia rồi, hãy bấm nút dưới đây để lấy 2 link nhóm thưởng:",
    Markup.inlineKeyboard([[Markup.button.callback("🎁 Lấy link nhóm thưởng", "phat_hai")]])
  );
});

// BƯỚC 3: HIỆN LINK NHÓM THƯỞNG
bot.action("phat_hai", (ctx) => {
  ctx.answerCbQuery().catch(() => {});
  ctx.reply("🎉 Link nhóm thưởng của bạn đây:\n\n👉 https://t.me/nhomfreene\n👉 https://t.me/dong18au");
});

bot.launch({ dropPendingUpdates: true });
