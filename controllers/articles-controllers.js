const {
  selectArticleByArticleId,
  updateArticleByArticleId,
  insertCommentByArticleId,
  selectCommentsByArticleId,
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

exports.postCommentByArticleId = (req, res, next) => {
  const { username, body } = req.body;
  const { article_id } = req.params;
  insertCommentByArticleId(username, body, article_id).then(comment => {
    res.status(201).send({ comment });
  });
};

exports.getCommentsByArticleId = (req, res, next) => {
  const article_id = req.params;
  const { sort_by, order } = req.query;
  console.log(sort_by);
  selectCommentsByArticleId(article_id, sort_by, order).then(comments => {
    res.status(200).send({ comments });
  });
};

exports.getArticles = (req, res, next) => {
  const { sort_by, order, author, topic } = req.query;
  selectArticles(sort_by, order, author, topic).then(articles => {
    res.status(200).send({ articles });
  });
};
