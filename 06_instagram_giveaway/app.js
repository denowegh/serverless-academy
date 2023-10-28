import fs from "fs/promises";

async function uniqueValues() {
  let usernames = new Set();
  let c = 0;
  await Promise.all(
    Array.from({ length: 20 }, async (_, i) => {
      const data = await fs.readFile(`./data/out${i}.txt`, "utf8");
      data.split("\n").forEach((e) => {
        usernames.add(e);
        c++;
      });
    })
  );
  console.log(c);
  return usernames.size;
}

async function existInAllFiles() {
  let countUsernames = new Map();
  let usernames = new Set();
  for (let i = 0; i < 20; i++) {
    const data = await fs.readFile(`./data/out${i}.txt`, "utf8");
    data.split("\n").forEach((e) => {
      usernames.add(e);
    });

    usernames.forEach((e) => {
      countUsernames.set(e, (countUsernames.get(e) || 0) + 1);
    });
    usernames.clear();
  }
  let count = 0;
  for (const [kay, value] of countUsernames) {
    if (value == 20) {
      count++;
    }
  }
  return count;
}

async function existInAtleastTen() {
  let countUsernames = new Map();
  let usernames = new Set();
  for (let i = 0; i < 20; i++) {
    const data = await fs.readFile(`./data/out${i}.txt`, "utf8");
    data.split("\n").forEach((e) => {
      usernames.add(e);
    });

    usernames.forEach((e) => {
      countUsernames.set(e, (countUsernames.get(e) || 0) + 1);
    });
    usernames.clear();
  }
  let count = 0;
  for (const [kay, value] of countUsernames) {
    if (value >= 10) {
      count++;
    }
  }
  return count;
}

console.time("ExecutionTimeUniqueValues");
let uniqueUsernames = await uniqueValues();
console.timeEnd("ExecutionTimeUniqueValues");
console.log(uniqueUsernames);
console.time("ExecutionTimeExistInAllFiles");
let usernamesExistInAllFiles = await existInAllFiles();
console.timeEnd("ExecutionTimeExistInAllFiles");
console.log(usernamesExistInAllFiles);
console.time("ExecutionTimeExistInAtleastTen");
let usernamesexistInAtleastTen = await existInAtleastTen();
console.timeEnd("ExecutionTimeExistInAtleastTen");
console.log(usernamesexistInAtleastTen);
