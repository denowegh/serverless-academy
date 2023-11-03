import TelegramBot from "node-telegram-bot-api";
import axios from "axios";

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_BOT_CHAT_ID;
const API_KEY_WEATHER = process.env.API_KEY_WEATHER;
const CITY_NAME = process.env.CITY_NAME;

const bot = new TelegramBot(TOKEN, { polling: true });

async function getCoordinates() {
  const LINK = `http://api.openweathermap.org/geo/1.0/direct?q=${CITY_NAME}&limit=1&appid=${API_KEY_WEATHER}`;
  try {
    const response = await axios.get(LINK);
    const results = response.data[0];
    if (results) {
      const latitude = results.lat;
      const longitude = results.lon;

      return [latitude, longitude];
    } else {
      console.log(`Coordinats canot find ${cityName} `);
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function getWeather(Coordinats) {
  const LINK = `https://api.openweathermap.org/data/2.5/weather?lat=${Coordinats[0]}&lon=${Coordinats[1]}&appid=${API_KEY_WEATHER}&units=metric`;
  const response = await axios.get(LINK);
  const {
    name,
    sys: { country },
    main: { temp, feels_like, humidity },
    weather: [{ description }],
    dt,
  } = response.data;
  const dateTime = new Date(dt * 1000);
  const date = dateTime.toLocaleDateString();
  const time = dateTime.toLocaleTimeString();

  return `Location: ${name}, ${country}
Date: ${date}
Time: ${time}
Temperature: ${temp.toFixed(2)}°C
It feels like: ${feels_like.toFixed(2)}°C
Humidity: ${humidity}%
Weather condition: ${description}`;
}

function sendMainMenu(chatId) {
  const opts = {
    reply_markup: {
      keyboard: [[`Forecast in ${CITY_NAME}`]],
      resize_keyboard: true,
    },
  };
  bot.sendMessage(chatId, "Choose an option:", opts);
}

bot.onText(/\/weither/, (msg) => {
  const chatId = msg.chat.id;

  sendMainMenu(chatId);
});

bot.onText(new RegExp(`Forecast in ${CITY_NAME}`), (msg) => {
  const chatId = msg.chat.id;

  const submenuKeyboard = {
    reply_markup: {
      resize_keyboard: true,
      keyboard: [
        [
          { text: "at intervals of 3 hours" },
          { text: "at intervals of 6 hours" },
        ],

        [{ text: "Back" }],
      ],
    },
  };

  bot.sendMessage(chatId, "Choose the interval:", submenuKeyboard);
});

bot.onText(/Back/, (msg) => {
  const chatId = msg.chat.id;

  sendMainMenu(chatId);
});

let intervalId;

async function sendMessageWeather(chatId) {
  const coordinats = await getCoordinates();
  const weather = await getWeather(coordinats);
  bot.sendMessage(chatId, `Weather:\n ${weather}`);
}

bot.onText(/at intervals of 3 hours/, async (msg) => {
  const chatId = msg.chat.id;

  clearInterval(intervalId);

  sendMessageWeather(chatId);

  intervalId = setInterval(async () => {
    sendMessageWeather(chatId);
  }, 3 * 60 * 60 * 1000); //3 hours
});

bot.onText(/at intervals of 6 hours/, async (msg) => {
  const chatId = msg.chat.id;

  clearInterval(intervalId);

  sendMessageWeather(chatId);

  intervalId = setInterval(async () => {
    sendMessageWeather(chatId);
  }, 6 * 60 * 60 * 1000); //6 hours
});

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  sendMainMenu(chatId);
});
sendMainMenu(CHAT_ID);
