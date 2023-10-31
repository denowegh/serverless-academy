import fs from "fs/promises";

async function uniqueValues() {
  console.time("Elapsed time uniqueValues");
  let usernames = new Set();

  for (let i = 0; i < 20; i++) {
    const data = await fs.readFile(`./data/out${i}.txt`, "utf8");
    const lines = data.split("\n");

    for (let j = 0; j < lines.length; j++) {
      usernames.add(lines[j]);
    }
  }
  console.timeEnd("Elapsed time uniqueValues");
  console.log(usernames.size);
}

async function existInAllFiles() {
  console.time("Elapsed time existInAllFiles");
  let countUsernames = new Map();
  for (let i = 0; i < 20; i++) {
    const data = await fs.readFile(`./data/out${i}.txt`, "utf8");
    const usernames = new Set(data.split("\n"));
    for (const username of usernames) {
      if (i == 0) {
        countUsernames.set(username, 1);
      } else {
        if (countUsernames.has(username)) {
          countUsernames.set(username, countUsernames.get(username) + 1);
        }
      }
    }
  }
  let count = [...countUsernames].filter(([_, value]) => value == 20).length;
  console.timeEnd("Elapsed time existInAllFiles");
  console.log(count);
}

async function existInAtleastTen() {
  console.time("Elapsed time existInAtleastTen");
  let countUsernames = new Map();
  for (let i = 0; i < 20; i++) {
    const data = await fs.readFile(`./data/out${i}.txt`, "utf8");
    const usernames = new Set(data.split("\n"));
    for (const username of usernames) {
      countUsernames.set(username, (countUsernames.get(username) || 0) + 1);
    }
  }

  let count = [...countUsernames].filter(([_, value]) => value >= 10).length;
  console.timeEnd("Elapsed time existInAtleastTen");
  console.log(count);
}

console.time("Elapsed time");
await uniqueValues();
await existInAllFiles();
await existInAtleastTen();
console.timeEnd("Elapsed time");
