const {
  updateArticleByArticleId,
  selectArticles
} = require("../models/articles-models");

const {
  insertCommentByArticleId,
  selectCommentsByArticleId
} = require("../models/comments-models");

exports.getArticleByArticleId = (req, res, next) => {
  const article_id = req.params.article_id;
  selectArticles(article_id)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticleByArticleId = (req, res, next) => {
  const incrementer = req.body.inc_votes;
  const article_id = req.params.article_id;
  updateArticleByArticleId(incrementer, article_id)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.postCommentByArticleId = (req, res, next) => {
  const { username, body } = req.body;
  const { article_id } = req.params;

  if (typeof body !== "string") {
    next({ status: 400, msg: "Bad Request" });
  } else {
    insertCommentByArticleId(username, body, article_id)
      .then(comment => {
        res.status(201).send({ comment });
      })
      .catch(next);
  }
};

exports.getCommentsByArticleId = (req, res, next) => {
  const article_id = req.params.article_id;
  const { sort_by, order } = req.query;
  selectCommentsByArticleId(article_id, sort_by, order)
    .then(comments => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  const { sort_by, order, author, topic } = req.query;
  selectArticles(null, sort_by, order, author, topic)
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(next);
};
