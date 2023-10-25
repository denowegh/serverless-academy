import inquirer from "inquirer";
import fs from "fs";
const FILE_NAME = "users.txt";
let users = [];

fs.readFile(FILE_NAME, "utf8", (err, data) => {
  if (err) {
  } else {
    users = JSON.parse(data);
  }
});

const prompt = inquirer.createPromptModule();
(async function () {
  let a = true;
  let b = true;
  while (a) {
    let e = await prompt([
      {
        type: "input",
        name: "Name",
        message: "Enter the user's name. To cansel press ENTER:",
        validate: (input) => {
          if (input == "") {
            fs.writeFile(FILE_NAME, JSON.stringify(users), (err) => {});
            a = b = false;
          }
          return true;
        },
      },
      {
        type: "list",
        choices: ["Male", "Female"],
        name: "Gender",
        when: () => {
          return b;
        },
        message: "Enter your Gender.",
      },
      {
        type: "number",
        name: "Age",
        when: () => {
          return b;
        },
        message: "Enter your age:",
      },
      {
        type: "confirm",
        name: "SurName",
        when: () => {
          return !b;
        },
        transformer: (input) => {
          if (input) {
            return true;
          } else {
            b = true;
            return false;
          }
        },
        message: "Would you to search values in DB? ",
      },
      {
        type: "input",
        name: "FindUserName",
        when: () => {
          if (!b) {
            console.log(users);
          }
          return !b;
        },
        message: "Enter user's name you wanna find in DB: ",
      },
    ]);
    if (e.Name) {
      users.push({ ...e, Name: e.Name.trim() });
    } else if (e.FindUserName) {
      let usersFiltered = users.find(
        (el) =>
          el.Name.trim().toLowerCase() == e.FindUserName.trim().toLowerCase()
      );
      if (usersFiltered) {
        console.log(`User ${e.FindUserName.trim()} was found.`);
        console.log(usersFiltered);
      } else {
        console.log("Such a user does not exist");
      }
    }
  }
})();
