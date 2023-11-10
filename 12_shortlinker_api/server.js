const app = require("./app");
const { PORT } = require("./config");

(() => {
  try {
    app.listen(PORT, () => console.log(`server started on port ${PORT}`));
  } catch (e) {
    console.error(e);
  }
})();
