const express = require("express");
const authRouter = require("./routes/authRouter.js");
const usersRouter = require("./routes/usersRouter.js");
const authenticateToken = require("./middleware/authMiddleware.js");
const app = express();

app.use(express.json());
app.use("/auth", authRouter);
app.use(authenticateToken);
app.use(usersRouter);
module.exports = app;
