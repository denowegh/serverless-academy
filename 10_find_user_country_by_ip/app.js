const express = require("express");
const fs = require("fs");

const app = express();
const csvFilePath = "./IP2LOCATION-LITE-DB1.csv";

const csvData = fs
  .readFileSync(csvFilePath, "utf8")
  .split("\n")
  .map((line) => line.split(",").map((item) => item.replace(/"|\r/g, "")))
  .map((row) => ({
    from: row[0],
    to: row[1],
    country: row[3],
  }));

function ipToNumber(ip) {
  const parts = ip.split(".");

  if (parts.length !== 4) {
    throw new Error("Incorrect IP address format");
  }

  const number =
    (parseInt(parts[0]) << 24) |
    (parseInt(parts[1]) << 16) |
    (parseInt(parts[2]) << 8) |
    parseInt(parts[3]);

  return number;
}

function findCountryForIP(ipAddress) {
  const ipValue = ipToNumber(ipAddress);
  for (const data of csvData) {
    if (ipValue >= data.from && ipValue <= data.to) {
      return data.country;
    }
  }
  return csvData;
}

app.use(express.json());

app.get("/location", (req, res) => {
  try {
    const { ip: ipAddress } = req.body;
    const ip = req.ip.replace("::ffff:", "");
    console.log(ip);

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
