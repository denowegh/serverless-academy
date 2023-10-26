import { program } from "commander";
import TelegramBot from "node-telegram-bot-api";

process.env["NTBA_FIX_350"] = 1;
const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_BOT_CHAT_ID;

const bot = new TelegramBot(TOKEN, { polling: true });

program
  .command("send-message <message>")
  .alias("m")
  .description("Send a message to Telegram Bot")
  .action((message) => {
    bot.sendMessage(CHAT_ID, message).then(() => {
      process.exit();
    });
  });

program
  .command("send-photo <path>")
  .alias("p")
  .description("Send a photo to Telegram Bot")
  .action((path) => {
    bot.sendPhoto(CHAT_ID, path).then(() => {
      process.exit();
    });
  });

program.parse();
