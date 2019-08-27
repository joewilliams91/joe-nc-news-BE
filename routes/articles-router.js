const express = require("express");
const {
  getArticleByArticleId,
  patchArticleByArticleId,
  postCommentByArticleId,
  getCommentByArticleId,
  getArticles
} = require("../controllers/articles-controllers");
// const { send405Error } = require("../errors/error-handler");
const articlesRouter = express.Router();

articlesRouter.route("/").get(getArticles);

articlesRouter
  .route("/:article_id")
  .get(getArticleByArticleId)
  .patch(patchArticleByArticleId);

articlesRouter
  .route("/:article_id/comments")
  .post(postCommentByArticleId)
  .get(getCommentByArticleId);

module.exports = articlesRouter;
