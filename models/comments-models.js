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
  if (typeof body !== "string" || typeof author !== "string") {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  } else {
    const newComment = { author, body, article_id };
    return connection("comments")
      .insert(newComment)
      .returning("*")
      .then(([addedComment]) => {
        return addedComment;
      });
  }
};

exports.selectCommentsByArticleId = (
  article_id,
  sort_by,
  order,
  limit,
  page
) => {
  if (
    (order && !/(de|a)sc/.test(order)) ||
    (limit && (limit < 0 || isNaN(+limit))) ||
    (page && (page < 0 || isNaN(+page)))
  ) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  } else {
    return connection("comments")
      .select("comment_id", "author", "votes", "created_at", "body")
      .where({ article_id: article_id })
      .orderBy(sort_by || "created_at", order || "desc")
      .offset((page - 1) * (limit || 10) || 0)
      .limit(limit || 10)
      .returning("*")
      .then(comments => {
        return Promise.all([comments, checkArticleExists(article_id)]);
      })
      .then(([comments]) => {
        if (!comments.length) {
          if (page && page > 1) {
            return Promise.reject({ status: 404, msg: "Not Found" });
          }
        }
        return comments;
      });
  }
};
