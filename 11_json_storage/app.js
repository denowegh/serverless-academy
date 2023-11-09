const express = require("express");
const fs = require("fs").promises;
const path = require("path");

const app = express();

const dataDir = path.join(__dirname, "data");

fs.mkdir(dataDir, { recursive: true });

const usedPaths = new Set();

app.use(express.json());

app.put("/:json_path", async (req, res) => {
  const jsonPath = `${req.params.json_path}.json`;
  const jsonDocument = req.body;
  const filePath = path.join(dataDir, jsonPath);

  if (usedPaths.has(jsonPath)) {
    return res.status(400).json({ error: "JSON path is already in use" });
  }

  try {
    await fs.writeFile(filePath, JSON.stringify(jsonDocument, null, 2));
    usedPaths.add(jsonPath);
    res.json({ message: "JSON document stored successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to store JSON document" });
  }
});

app.get("/:json_path", async (req, res) => {
  const jsonPath = req.params.json_path;
  const filePath = path.join(dataDir, jsonPath);

  try {
    const data = await fs.readFile(filePath, "utf-8");
    const jsonDocument = JSON.parse(data);
    res.json(jsonDocument);
  } catch (error) {
    res.status(404).json({ error: "JSON document not found" });
  }
});

module.exports = app;
