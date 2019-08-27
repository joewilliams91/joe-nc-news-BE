const {
  selectArticleByArticleId,
  updateArticleByArticleId,
  insertCommentByArticleId,
  selectCommentByArticleId,
  selectArticles
} = require("../models/articles-models");

exports.getArticleByArticleId = (req, res, next) => {
  const article_id = req.params.article_id;
  selectArticleByArticleId(article_id).then(article => {
    res.status(200).send({ article });
  });
};

exports.patchArticleByArticleId = (req, res, next) => {
  const incrementer = req.body.inc_votes;
  const article_id = req.params.article_id;
  updateArticleByArticleId(incrementer, article_id).then(article => {
    res.status(200).send({ article });
  });
};

exports.postCommentByArticleId = (req, res, next) => {};

exports.getCommentByArticleId = (req, res, next) => {};

exports.getArticles = (req, res, next) => {};
