const express = require("express");
const apiRouter = express.Router();
const usersRouter = require("./users-router");
const articlesRouter = require("./articles-router");
const commentsRouter = require("./comments-router");
const topicsRouter = require("./topics-router");
const { getAllEndpoints } = require("../controllers/api-controllers");
const { send405Error } = require("../errors/error-handler");
const cors = require("cors");

apiRouter.use(cors());
apiRouter.options("*", cors());
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.use("/topics", topicsRouter);

apiRouter
  .route("/")
  .get(getAllEndpoints)
  .all(send405Error);

module.exports = apiRouter;
