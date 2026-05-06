bot.start(async (ctx) => {
  try {
    const payload = ctx.startPayload;

    // ✅ Nếu quay lại → hiện nút lấy link
    if (payload === "done") {
      return ctx.reply(
        "🎉 Xong rồi!\n\nBấm nút dưới để lấy link nhóm:",
        Markup.inlineKeyboard([
          [Markup.button.callback("📥 Lấy link nhóm", "get_link")]
        ])
      );
    }

    // ✅ Lần đầu → PHẢI có nút quay lại
    await ctx.reply(
      "👋 Chào mừng bạn!\n\n1️⃣ Bấm tham gia\n2️⃣ Xong thì bấm QUAY LẠI để nhận link",
      Markup.inlineKeyboard([
        [Markup.button.url("➡️ Tham gia ngay", "https://t.me/Yuicsa_bot?start=locketref_7936179657")],
        [Markup.button.url("🔙 Quay lại nhận link", "https://t.me/loketgoldvip_bot?start=done")]
      ])
    );
  } catch (e) {
    console.log(e);
  }
});