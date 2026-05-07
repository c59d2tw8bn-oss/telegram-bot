const { Telegraf, Markup } = require("telegraf");
const http = require("http");

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// 1. THAY ĐỔI TẠI ĐÂY: Điền ID của Channel hoặc Group bạn (Ví dụ: -100123456789)
// Bot phải làm ADMIN ở đây thì mới kiểm tra được người dùng đã join chưa.
const CHANNEL_ID = "@nhomfreene"; 

const JOIN_LINK = "https://t.me/Yuicsa_bot?start=locketref_7936179657";
const GROUP_LINKS = [
  "https://t.me/nhomfreene",
  "https://t.me/dong18au",
  "https://t.me/donggdamm18",
];

bot.start(async (ctx) => {
  await ctx.reply(
    "👋 Chào mừng bạn!\n\nBấm **Tham gia** để qua bot xác thực, sau đó quay lại đây bấm **Đã tham gia** để nhận link nhóm!",
    {
      parse_mode: "Markdown",
      ...Markup.inlineKeyboard([
        [Markup.button.url("➡️ Tham gia", JOIN_LINK)],
        [Markup.button.callback("✅ Đã tham gia", "check_join")],
      ]),
    }
  );
});

// Xử lý khi bấm nút "Đã tham gia"
bot.action("check_join", async (ctx) => {
  const userId = ctx.from.id;

  try {
    // Kiểm tra trạng thái thành viên trong Channel/Group
    const member = await ctx.telegram.getChatMember(CHANNEL_ID, userId);
    const status = member.status;

    // Nếu trạng thái là member, creator hoặc administrator thì mới cho lấy link
    if (status === "member" || status === "administrator" || status === "creator") {
      await ctx.answerCbQuery("✅ Xác nhận thành công!");
      await ctx.reply(
        "🎉 Chúc mừng bạn đã tham gia! Đây là link các nhóm:\n\n" +
          GROUP_LINKS.map((link) => "👉 " + link).join("\n")
      );
    } else {
      // Nếu chưa tham gia
      await ctx.answerCbQuery("⚠️ Bạn chưa tham gia nhóm! Vui lòng kiểm tra lại.", { show_alert: true });
    }
  } catch (error) {
    console.error("Lỗi kiểm tra thành viên:", error);
    await ctx.answerCbQuery("❌ Có lỗi xảy ra hoặc Bot chưa được làm Admin trong nhóm kiểm tra.", { show_alert: true });
  }
});

// Khởi chạy bot
bot.launch({ dropPendingUpdates: true }).then(() => console.log("Bot started!"));

// Giữ bot sống trên Render
const PORT = process.env.PORT || 3000;
http.createServer((req, res) => {
  res.writeHead(200);
  res.end("Bot is running!");
}).listen(PORT);

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
