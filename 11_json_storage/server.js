const app = require("./app");
const PORT = process.env.PORT || 8080;

(() => {
  try {
    app.listen(PORT, () => console.log(`server started on port ${PORT}`));
  } catch (e) {
    console.error(e);
  }
})();
