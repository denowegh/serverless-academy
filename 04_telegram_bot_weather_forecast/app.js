import TelegramBot from "node-telegram-bot-api";
import axios from "axios";

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_BOT_CHAT_ID;
const API_KEY_WEATHER = process.env.API_KEY_WEATHER;
const CITY_NAME = process.env.CITY_NAME;

const bot = new TelegramBot(TOKEN, { polling: true });

async function getCoordinates() {
  try {
    const response = await axios.get(
      `http://api.openweathermap.org/geo/1.0/direct?q=${CITY_NAME}&limit=1&appid=${API_KEY_WEATHER}`
    );
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

async function getWeatherWithInterval(Coordinats, IntervalHours) {
  if (Coordinats) {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${Coordinats[0]}&lon=${Coordinats[1]}&exclude=daily&appid=${API_KEY_WEATHER}&units=metric`
      );
      const weatherData = response.data.list;

      const dailyWeather = {};
      for (let id = 0; id < weatherData.length; id += IntervalHours / 3) {
        const data = weatherData[id];
        const dateTime = new Date(data.dt * 1000);
        const date = dateTime.toLocaleDateString();
        const time = dateTime.toLocaleTimeString();

        const temperature = data.main.temp;
        const feelsLike = data.main.feels_like;
        const humidity = data.main.humidity;
        const weatherDescription = data.weather[0].description;

        const dailyInfo = `Date: ${date}\nTime: ${time}\nTemperature: ${temperature}°C\nIt feels like: ${feelsLike}°C\nHumidity: ${humidity}%\nWeather condition: ${weatherDescription}\n`;

        if (!dailyWeather[date]) {
          dailyWeather[date] = dailyInfo;
        } else {
          dailyWeather[date] += `\n\n${dailyInfo}`;
        }
      }

      return dailyWeather;
    } catch (error) {
      console.error("Error get weather:", error);
    }
  } else {
    console.error("Error");
  }
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

  const menuKeyboard = {
    reply_markup: {
      keyboard: [[{ text: `Forecast in ${CITY_NAME}` }]],
    },
  };

  bot.sendMessage(chatId, "Choose an option:", menuKeyboard);
});

bot.onText(new RegExp(`Forecast in ${CITY_NAME}`), (msg) => {
  const chatId = msg.chat.id;

  const submenuKeyboard = {
    reply_markup: {
      keyboard: [
        [
          { text: "at intervals of 3 hours" },
          { text: "at intervals of 6 hours" },
        ],
      ],
      one_time_keyboard: true,
    },
  };

  bot.sendMessage(chatId, "Choose the interval:", submenuKeyboard);
});

bot.onText(/at intervals of 3 hours/, async (msg) => {
  const chatId = msg.chat.id;

  let coordinats = await getCoordinates();
  let weather = await getWeatherWithInterval(coordinats, 3);
  for (const date in weather) {
    bot.sendMessage(chatId, `Weather on ${date}:\n${weather[date]}\n\n`);
  }
});

bot.onText(/at intervals of 6 hours/, async (msg) => {
  const chatId = msg.chat.id;
  let coordinats = await getCoordinates();
  let weather = await getWeatherWithInterval(coordinats, 6);
  for (const date in weather) {
    if (weather[date])
      bot.sendMessage(chatId, `Weather on ${date}:\n${weather[date]}\n\n`);
  }
});

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  sendMainMenu(chatId);
});
sendMainMenu(CHAT_ID);
