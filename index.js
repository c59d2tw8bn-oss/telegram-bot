const { Telegraf, Markup } = require("telegraf");
require('http').createServer((req, res) => res.end('OK')).listen(process.env.PORT || 3000);

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const LINK_REF = "https://t.me/Yuicsa_bot?start=locketref_7936179657";

bot.start((ctx) => {
  // BƯỚC 1: Chỉ hiện duy nhất 1 nút "Tham gia ngay"
  ctx.reply("👋 Chào mừng bạn!\n\nBấm nút dưới đây để tham gia:", 
    Markup.inlineKeyboard([[Markup.button.callback("➡️ Tham gia ngay", "step1")]])
  );
});

bot.action("step1", (ctx) => {
  // BƯỚC 2: Cú bấm "bay" sang bot 2 ngay lập tức (Hết lag)
  ctx.answerCbQuery("Đang chuyển hướng...", { url: LINK_REF }).catch(() => {});

  // BƯỚC 3: Đổi nội dung tin nhắn ngay lúc đó để hiện nút lấy link
  ctx.editMessageText("🎉 Bạn đã bấm tham gia!\n\nGiờ hãy bấm nút dưới đây để lấy link nhóm thưởng:", 
    Markup.inlineKeyboard([[Markup.button.callback("🎁 Lấy link nhóm", "step2")]])
  ).catch(() => {});
});

bot.action("step2", (ctx) => {
  ctx.answerCbQuery().catch(() => {});
  ctx.reply("🎉 Link nhóm thưởng của bạn:\n\n👉 https://t.me/nhomfreene\n👉 https://t.me/dong18au");
});

bot.launch({ dropPendingUpdates: true });
