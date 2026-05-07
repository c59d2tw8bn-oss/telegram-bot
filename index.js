const { Telegraf, Markup } = require("telegraf");
const http = require("http");

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

const JOIN_LINK = "https://t.me/Yuicsa_bot?start=locketref_7936179657";
const GROUP_LINKS = ["https://t.me/nhomfreene", "https://t.me/dong18au", "https://t.me/donggdamm18"];

// Bộ nhớ ghi nhận người đã bấm
const clickedUsers = new Set();

bot.start(async (ctx) => {
  const userId = ctx.from.id;
  clickedUsers.delete(userId); // Reset 

  await ctx.reply(
    "👋 *Để lấy link nhóm, bạn cần làm đúng 2 bước:*\n\n1️⃣ Bấm nút **THAM GIA**.\n2️⃣ Quay lại đây bấm **ĐÃ THAM GIA**.",
    {
      parse_mode: "Markdown",
      ...Markup.inlineKeyboard([
        [Markup.button.callback("➡️ 1. THAM GIA (Bắt buộc)", "do_join")],
        [Markup.button.callback("✅ 2. ĐÃ THAM GIA", "do_verify")]
      ]),
    }
  );
});

// Bước 1: Khách bấm nút này mới được tính là có ref
bot.action("do_join", async (ctx) => {
  const userId = ctx.from.id;
  clickedUsers.add(userId); // Ghi nhận ĐÃ BẤM

  await ctx.answerCbQuery(); // Tắt xoay vòng nút

  // Gửi duy nhất 1 nút mở Bot 2 (Gọn nhất có thể)
  await ctx.reply("👇 Bấm vào đây để sang Bot 2:", 
    Markup.inlineKeyboard([
      [Markup.button.url("🚀 MỞ BOT 2 NGAY", JOIN_LINK)]
    ])
  );
});

// Bước 2: Chốt chặn lấy hoa hồng
bot.action("do_verify", async (ctx) => {
  const userId = ctx.from.id;

  // Nếu nó chưa bấm nút số 1 mà đã đòi bấm nút này -> CHẶN
  if (!clickedUsers.has(userId)) {
    return ctx.answerCbQuery("⚠️ Bạn chưa bấm nút số 1 để tham gia!", { show_alert: true });
  }

  await ctx.answerCbQuery("✅ Xác nhận thành công!");
  await ctx.reply(
    "🎉 Đây là danh sách nhóm của bạn:\n\n" + 
    GROUP_LINKS.map(l => "👉 " + l).join("\n")
  );
});

// --- FIX LỖI RENDER ---
bot.launch({ dropPendingUpdates: true });
const PORT = process.env.PORT || 3000;
http.createServer((req, res) => { res.end("Bot live"); }).listen(PORT);
