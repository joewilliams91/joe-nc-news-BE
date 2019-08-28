const express = require("express");
const { getUserByUsername } = require("../controllers/users-controllers");
const { send405Error } = require("../errors/error-handler");
const usersRouter = express.Router();

usersRouter
  .route("/:username")
  .get(getUserByUsername)
  .all(send405Error);

module.exports = usersRouter;
