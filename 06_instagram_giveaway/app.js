import fs from "fs/promises";

async function uniqueValues() {
  console.time("Elapsed time uniqueValues");
  let usernames = new Set();
  await Promise.all(
    Array.from({ length: 20 }, async (_, i) => {
      const data = await fs.readFile(`./data/out${i}.txt`, "utf8");
      data.split("\n").forEach((e) => {
        usernames.add(e);
      });
    })
  );
  console.timeEnd("Elapsed time uniqueValues");
  return usernames.size;
}

async function existInAllFiles() {
  console.time("Elapsed time existInAllFiles");
  let countUsernames = new Map();
  for (let i = 0; i < 20; i++) {
    const data = await fs.readFile(`./data/out${i}.txt`, "utf8");
    const usernames = new Set(data.split("\n"));

    usernames.forEach((e) => {
      if (i == 0) {
        countUsernames.set(e, 1);
      } else {
        if (countUsernames.has(e)) {
          countUsernames.set(e, countUsernames.get(e) + 1);
        }
      }
    });
  }
  let count = [...countUsernames].filter(([_, value]) => value == 20).length;
  console.timeEnd("Elapsed time existInAllFiles");
  return count;
}

async function existInAtleastTen() {
  console.time("Elapsed time existInAtleastTen");
  let countUsernames = new Map();
  for (let i = 0; i < 20; i++) {
    const data = await fs.readFile(`./data/out${i}.txt`, "utf8");
    const usernames = new Set(data.split("\n"));

    usernames.forEach((e) => {
      countUsernames.set(e, (countUsernames.get(e) || 0) + 1);
    });
    usernames.clear();
  }
  let count = [...countUsernames].filter(([_, value]) => value >= 10).length;
  console.timeEnd("Elapsed time existInAtleastTen");
  return count;
}

console.time("Elapsed time");
let uniqueUsernames = await uniqueValues();
let usernamesExistInAllFiles = await existInAllFiles();
let usernamesexistInAtleastTen = await existInAtleastTen();
console.timeEnd("Elapsed time");
console.log(uniqueUsernames);
console.log(usernamesExistInAllFiles);
console.log(usernamesexistInAtleastTen);
