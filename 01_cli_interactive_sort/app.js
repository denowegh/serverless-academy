const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function getUserInput() {
  rl.question(
    "Hello. Enter 10 words or digits deviting them in spaces:",
    (answer) => {
      let wordsArr = [...new Set(answer.split(" ").filter((e) => e !== ""))];
      console.log(
        "How would you like to sort values: \n" +
          "1) Sort words alphabetically. \n" +
          "2) Show numbers from lesser to greater. \n" +
          "3) Show numbers from bigger to smaller. \n" +
          "4) Display words in ascending order by the number of letters in the word. \n" +
          "5) Show only unique words. \n"
      );
      rl.question("Select (1-5) or exit and press ENTER: ", (answer) => {
        switch (answer.trim()) {
          case "exit":
            rl.close();
            break;
          case "1":
            wordsArr = wordsArr.filter((e) => {
              let hasNumbers = true;
              for (let i = 0; i < e.length; i++) {
                if (!isNaN(parseInt(e[i]))) {
                  hasNumbers = false;
                  break;
                }
              }
              return hasNumbers;
            });
            console.log(wordsArr.sort());
            getUserInput();
            break;
          case "2":
            wordsArr = wordsArr.filter((e) => {
              let hasNumbers = true;
              for (let i = 0; i < e.length; i++) {
                if (isNaN(parseInt(e[i]))) {
                  hasNumbers = false;
                  break;
                }
              }
              return hasNumbers;
            });
            console.log(wordsArr.sort());
            getUserInput();
            break;
          case "3":
            wordsArr = wordsArr.filter((e) => {
              let hasNumbers = true;
              for (let i = 0; i < e.length; i++) {
                if (isNaN(parseInt(e[i]))) {
                  hasNumbers = false;
                  break;
                }
              }
              return hasNumbers;
            });
            console.log(wordsArr.sort((a, b) => b.localeCompare(a)));
            getUserInput();
            break;
          case "4":
            wordsArr = wordsArr
              .filter((e) => {
                let hasNumbers = true;
                for (let i = 0; i < e.length; i++) {
                  if (!isNaN(parseInt(e[i]))) {
                    hasNumbers = false;
                    break;
                  }
                }
                return hasNumbers;
              })
              .sort((a, b) => {
                if (a.length < b.length) {
                  return -1;
                }
                if (a.length > b.length) {
                  return 1;
                }
                return 0;
              });

            console.log(wordsArr);
            getUserInput();
            break;
          case "5":
            wordsArr = wordsArr.filter((e) => {
              let hasNumbers = true;
              for (let i = 0; i < e.length; i++) {
                if (!isNaN(parseInt(e[i]))) {
                  hasNumbers = false;
                  break;
                }
              }
              return hasNumbers;
            });
            console.log(wordsArr);
            getUserInput();
            break;
          default:
            getUserInput();
            break;
        }
      });
    }
  );
}

getUserInput();
