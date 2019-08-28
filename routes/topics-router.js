const express = require("express");
const { getTopics } = require("../controllers/topics-controllers");
const { send405Error } = require("../errors/error-handler");
const topicsRouter = express.Router();

topicsRouter
  .route("/")
  .get(getTopics)
  .all(send405Error);

module.exports = topicsRouter;
