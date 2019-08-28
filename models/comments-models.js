const connection = require("../db/connection");

exports.updateCommentByCommentId = (comment_id, incrementer) => {
  return connection("comments")
    .where("comment_id", "=", comment_id)
    .increment("votes", incrementer)
    .returning("*")
    .then(([comment]) => {
      return comment;
    });
};

exports.removeCommentByCommentId = comment_id => {
  return connection("comments")
    .where("comment_id", "=", comment_id)
    .del()
    .then(deleteCount => {
      if (deleteCount === 0)
        return Promise.reject({ status: 404, msg: "Path not Found" });
      else return deleteCount;
    });
};
