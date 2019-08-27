const {
  updateCommentByCommentId,
  removeCommentByCommentId
} = require("../models/comments-models");

exports.patchCommentByCommentId = (req, res, next) => {
  const incrementer = +req.body.inc_votes;
  const comment_id = req.params.comment_id;
  updateCommentByCommentId(comment_id, incrementer).then(comment => {
    res.status(200).send({ comment });
  });
};

exports.deleteCommentByCommentId = (req, res, next) => {};
