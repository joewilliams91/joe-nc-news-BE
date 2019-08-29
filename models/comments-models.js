const connection = require("../db/connection");
const { checkArticleExists } = require("../models/articles-models");

exports.updateCommentByCommentId = (comment_id, incrementer) => {
  return connection("comments")
    .where("comment_id", "=", comment_id)
    .increment("votes", incrementer || 0)
    .returning("*")
    .then(([comment]) => {
      if (!comment) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      } else {
        return comment;
      }
    });
};

exports.removeCommentByCommentId = comment_id => {
  return connection("comments")
    .where("comment_id", "=", comment_id)
    .del()
    .then(deleteCount => {
      if (deleteCount === 0)
        return Promise.reject({ status: 404, msg: "Not Found" });
      else return deleteCount;
    });
};

exports.insertCommentByArticleId = (author, body, article_id) => {
  const newComment = { author, body, article_id };
  return connection("comments")
    .insert(newComment)
    .returning("*")
    .then(([addedComment]) => {
      return addedComment;
    });
};

exports.selectCommentsByArticleId = (article_id, sort_by, order) => {
  if (order && !/(de|a)sc/.test(order)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  } else {
    return connection("comments")
      .select("comment_id", "author", "votes", "created_at", "body")
      .where({ article_id: article_id })
      .orderBy(sort_by || "created_at", order || "desc")
      .returning("*")
      .then(comments => {
        return Promise.all([comments, checkArticleExists(article_id)]);
      })
      .then(([comments]) => {
        return comments;
      });
  }
};
