const {
  updateArticleByArticleId,
  selectArticles,
  getTotalCount,
  insertArticle,
  deleteArticleByArticleId
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

  insertCommentByArticleId(username, body, article_id)
    .then(comment => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
  const article_id = req.params.article_id;
  const { sort_by, order, limit, p } = req.query;
  selectCommentsByArticleId(article_id, sort_by, order, limit, p)
    .then(comments => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.removeArticleByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  deleteArticleByArticleId(article_id)
    .then(deleteCount => {
      if (deleteCount) {
        res.sendStatus(204).send();
      }
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  const { sort_by, order, author, topic, limit, p } = req.query;
  return Promise.all([
    selectArticles(null, sort_by, order, author, topic, limit, p),
    getTotalCount(author, topic)
  ])
    .then(([articles, [{ total_count }]]) => {
      if (p && (p - 1) * (limit || 10) + 1 > total_count) {
        next({ status: 404, msg: "Not Found" });
      }
      res.status(200).send({ articles, total_count });
    })
    .catch(next);
};

exports.postArticle = (req, res, next) => {
  const { title, body, topic, author, votes } = req.body;
  insertArticle(title, body, topic, author, votes)
    .then(article => {
      res.status(201).send({ article });
    })
    .catch(next);
};
