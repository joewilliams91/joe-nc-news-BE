const express = require("express");
const { getTopics } = require("../controllers/topics-controllers");
// const { send405Error } = require("../errors/errorHandler");
const topicsRouter = express.Router();

topicsRouter.route("/").get(getTopics);

module.exports = topicsRouter;
