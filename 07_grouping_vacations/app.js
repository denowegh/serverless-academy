import fs from "fs";
const FILE_NAME = "data.json";
const NEW_FILE_NAME = "new-data.json";

let data = JSON.parse(fs.readFileSync(FILE_NAME, "utf8")).map((e, i, arr) => {
  let vacations = [];
  arr.forEach((el) => {
    if (el.user._id == e.user._id) {
      el.status
        ? vacations.push({
            startDate: el.startDate,
            endDate: el.endDate,
            status: el.status,
          })
        : vacations.push({
            startDate: el.startDate,
            endDate: el.endDate,
          });
    }
  });
  return {
    userId: e.user._id,
    userName: e.user.name,
    vacations,
  };
});

let newDataArr = Array.from(new Set(data.map((e) => JSON.stringify(e))), (e) =>
  JSON.parse(e)
);

fs.writeFileSync(NEW_FILE_NAME, JSON.stringify(newDataArr, null, 2));

console.log(...newDataArr);
