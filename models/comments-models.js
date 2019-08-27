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
