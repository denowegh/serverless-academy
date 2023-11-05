const express = require("express");
const usersController = require("../controllers/usersController");
const usersRouter = express.Router();

usersRouter.get("/me", usersController.getMe);

module.exports = usersRouter;
