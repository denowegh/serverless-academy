const express = require("express");
const fs = require("fs");

const app = express();
const csvFilePath = "./IP2LOCATION-LITE-DB1.csv";

const csvData = fs
  .readFileSync(csvFilePath, "utf8")
  .split("\n")
  .map((line) => line.split(",").map((item) => item.replace(/"|\r/g, "")));

function ipToNumber(ip) {
  var parts = ip.split(".");
  var num = 0;
  var pow = 3;
  for (var i = 0; i < 4; i++) {
    num += parseInt(parts[i]) * Math.pow(256, pow);
    pow--;
  }
  return num;
}

function findCountryForIP(ipAddress) {
  const ipValue = ipToNumber(ipAddress);
  for (const data of csvData) {
    if (ipValue >= data[0] && ipValue <= data[1]) {
      return { code: data[2], name: data[3] };
    }
  }
  return csvData;
}

app.use(express.json());

app.get("/location", (req, res) => {
  try {
    const { ip: ipAddress } = req.body;
    const ip = req.ip.replace("::ffff:", "");

    if (ipAddress) {
      const country = findCountryForIP(ipAddress);
      return res.json(country);
    } else {
      const country = findCountryForIP(ip);
      return res.json(country);
    }
  } catch (e) {
    return res.json({ error: e.message });
  }
});

module.exports = app;
