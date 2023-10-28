import TelegramBot from "node-telegram-bot-api";
import axios from "axios";
import NodeCache from "node-cache";

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_BOT_CHAT_ID;
const API_URL_MONOBANK = "https://api.monobank.ua/bank/currency";
const API_URL_CASH_RATE_PRIVATBANK =
  "https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5";
const API_URL_NON_CASH_COURSE_PRIVATBANK =
  "https://api.privatbank.ua/p24api/pubinfo?exchange&json&coursid=11";

const cache = new NodeCache();
const bot = new TelegramBot(TOKEN, { polling: true });

async function getExchangeRateMonobank(currency) {
  let dataMonobank,
    dataPrivatbankCash,
    dataPrivatbankNonCash,
    rateSell,
    rateBuy;

  const cachedData = cache.get("currencyData");

  if (cachedData) {
    dataMonobank = cachedData;
  }

  try {
    const responseNonCash = await axios.get(API_URL_NON_CASH_COURSE_PRIVATBANK);
    const responseCash = await axios.get(API_URL_CASH_RATE_PRIVATBANK);
    const response = await axios.get(API_URL_MONOBANK);

    if (
      responseNonCash.status === 200 &&
      responseCash.status === 200 &&
      response.status === 200
    ) {
      dataPrivatbankCash = responseCash.data;
      dataPrivatbankNonCash = responseNonCash.data;
      cache.set("currencyData", response.data, 60);
      dataMonobank = response.data;
    }
  } catch (error) {
    console.error(error);
  }

  switch (currency) {
    case "USD":
      if (dataMonobank) {
        var usdData = dataMonobank.find(
          (item) => item.currencyCodeA === 840 && item.currencyCodeB === 980
        );
        if (usdData) {
          rateSell = usdData.rateSell;
          rateBuy = usdData.rateBuy;
        }
      }
      break;
    case "EUR":
      if (dataMonobank) {
        var eurData = dataMonobank.find(
          (item) => item.currencyCodeA === 978 && item.currencyCodeB === 980
        );
        if (eurData) {
          rateSell = eurData.rateSell;
          rateBuy = eurData.rateBuy;
        }
      }
      break;
    default:
      return "Error currency";
  }

  if (
    rateSell !== undefined &&
    rateSell !== rateBuy &&
    dataPrivatbankCash &&
    dataPrivatbankNonCash
  ) {
    return `
Currency:  ${currency}
Monobank:
Buy:  ${rateBuy.toFixed(4)}
Sell:   ${rateSell.toFixed(4)}\n
PrivatBank cash rate:
Buy:  ${Number(dataPrivatbankCash.find((e) => e.ccy == currency).buy).toFixed(
      4
    )}
Sell:   ${Number(
      dataPrivatbankCash.find((e) => e.ccy == currency).sale
    ).toFixed(4)}\n
PrivatBank cashless rate:
Buy:  ${Number(
      dataPrivatbankNonCash.find((e) => e.ccy == currency).buy
    ).toFixed(4)}
Sell:   ${Number(
      dataPrivatbankNonCash.find((e) => e.ccy == currency).sale
    ).toFixed(4)}`;
  } else {
    return "Course data not found";
  }
}

function sendMainMenu(chatId) {
  const opts = {
    reply_markup: {
      keyboard: [[`Exchange rate`]],
      resize_keyboard: true,
    },
  };
  bot.sendMessage(chatId, "Choose an option:", opts);
}

bot.onText(/\/exchange_rate/, (msg) => {
  const chatId = msg.chat.id;

  sendMainMenu(chatId);
});

bot.onText(/Exchange rate/, (msg) => {
  const chatId = msg.chat.id;

  const submenuKeyboard = {
    reply_markup: {
      resize_keyboard: true,
      keyboard: [[{ text: "USD" }, { text: "EUR" }], [{ text: "Back" }]],
    },
  };

  bot.sendMessage(chatId, "Choose the currency:", submenuKeyboard);
});

bot.onText(/USD/, async (msg) => {
  const chatId = msg.chat.id;
  var exchangeRateString = await getExchangeRateMonobank("USD");
  bot.sendMessage(chatId, exchangeRateString);
});

bot.onText(/EUR/, async (msg) => {
  const chatId = msg.chat.id;
  var exchangeRateString = await getExchangeRateMonobank("EUR");
  bot.sendMessage(chatId, exchangeRateString);
});

bot.onText(/Back/, (msg) => {
  const chatId = msg.chat.id;

  sendMainMenu(chatId);
});

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  sendMainMenu(chatId);
});
sendMainMenu(CHAT_ID);
