const express = require("express");
const {
  getArticleByArticleId,
  patchArticleByArticleId,
  postCommentByArticleId,
  getCommentsByArticleId,
  getArticles,
  postArticle,
  removeArticleByArticleId
} = require("../controllers/articles-controllers");
const { send405Error } = require("../errors/error-handler");
const articlesRouter = express.Router();

articlesRouter
  .route("/")
  .get(getArticles)
  .post(postArticle)
  .all(send405Error);

articlesRouter
  .route("/:article_id")
  .get(getArticleByArticleId)
  .patch(patchArticleByArticleId)
  .delete(removeArticleByArticleId)
  .all(send405Error);

articlesRouter
  .route("/:article_id/comments")
  .post(postCommentByArticleId)
  .get(getCommentsByArticleId)
  .all(send405Error);

module.exports = articlesRouter;
