const express = require("express");
const { getUserByUsername } = require("../controllers/users-controllers");
// const { send405Error } = require("../errors/errorHandler");
const usersRouter = express.Router();

usersRouter.route("/:username").get(getUserByUsername);

module.exports = usersRouter;
