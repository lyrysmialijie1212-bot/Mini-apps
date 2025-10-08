const TelegramBot = require('node-telegram-bot-api');
const BOT_TOKEN = '7913811171:AAEdOyaHASA6lX2XvX7X8qorTophk9PxH1A';
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// Handle /start command
bot.onText(/\/start/, msg => {
    bot.sendMessage(msg.chat.id, "Play Mood Swing 🌈!", {
        reply_markup: {
            inline_keyboard: [
                [{ text: "🎮 Play Now", web_app: { url: "https://your-game-url.com" } }]
            ]
        }
    });
});
