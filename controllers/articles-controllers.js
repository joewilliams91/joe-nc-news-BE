const {
  updateArticleByArticleId,
  insertCommentByArticleId,
  selectCommentsByArticleId,
  selectArticles
} = require("../models/articles-models");

exports.getArticleByArticleId = (req, res, next) => {
  const article_id = req.params.article_id;
  selectArticles(article_id)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(err => {
      next(err);
    });
};

exports.patchArticleByArticleId = (req, res, next) => {
  if (!req.body.inc_votes || Object.keys(req.body).length > 1) {
    next({ status: 400, msg: "Bad Request" });
  } else {
    const incrementer = req.body.inc_votes;
    const article_id = req.params.article_id;
    updateArticleByArticleId(incrementer, article_id)
      .then(article => {
        res.status(200).send({ article });
      })
      .catch(err => {
        next(err);
      });
  }
};

exports.postCommentByArticleId = (req, res, next) => {
  const { username, body } = req.body;
  const { article_id } = req.params;
  insertCommentByArticleId(username, body, article_id)
    .then(comment => {
      res.status(201).send({ comment });
    })
    .catch(err => {
      next(err);
    });
};

exports.getCommentsByArticleId = (req, res, next) => {
  const article_id = req.params;
  const { sort_by, order } = req.query;
  if ((order && order !== "asc") || (order && order !== "desc")) {
    next({ status: 400, msg: "Bad Request" });
  } else {
    selectCommentsByArticleId(article_id, sort_by, order)
      .then(comments => {
        res.status(200).send({ comments });
      })
      .catch(err => {
        next(err);
      });
  }
};

exports.getArticles = (req, res, next) => {
  const { sort_by, order, author, topic } = req.query;
  selectArticles(null, sort_by, order, author, topic)
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(err => {
      next(err);
    });
};
