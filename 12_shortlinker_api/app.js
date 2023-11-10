const express = require("express");
const bodyParser = require("body-parser");
const nanoid = require("nanoid");
const fs = require("fs");
const path = require("path");
const { PORT } = require("./config");
const validUrl = require("valid-url");

const app = express();
const dataFilePath = path.join(__dirname, "data.json");

app.use(bodyParser.json());

let urlDatabase = loadDatabase();

function loadDatabase() {
  try {
    const data = fs.readFileSync(dataFilePath, "utf8");
    return JSON.parse(data) || [];
  } catch (err) {
    console.error("Error loading database:", err.message);
    return {};
  }
}

function saveDatabase() {
  try {
    const data = JSON.stringify(urlDatabase, null, 2);
    fs.writeFileSync(dataFilePath, data, "utf8");
  } catch (err) {
    console.error("Error saving database:", err.message);
  }
}

app.post("/shorten", (req, res) => {
  const { url } = req.body;

  if (!validUrl.isUri(url)) {
    return res.status(400).json({ error: "Invalid URL" });
  }

  const existingEntry = urlDatabase.find((entry) => entry.originalUrl === url);

  if (existingEntry) {
    return res.json({
      shortUrl: `http://localhost:${PORT}/${existingEntry.id}`,
    });
  }
  const shortId = nanoid.nanoid(6);

  const shortUrl = `http://localhost:${PORT}/${shortId}`;

  urlDatabase.push({ id: shortId, originalUrl: url });

  saveDatabase();

  res.json({ shortUrl });
});

app.get("/:shortId", (req, res) => {
  const { shortId } = req.params;

  const entry = urlDatabase.find((item) => item.id === shortId);

  if (entry) {
    res.redirect(entry.originalUrl);
  } else {
    res.status(404).json({ error: "URL not found" });
  }
});

module.exports = app;
