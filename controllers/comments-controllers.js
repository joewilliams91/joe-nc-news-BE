const {
  updateCommentByCommentId,
  removeCommentByCommentId
} = require("../models/comments-models");

exports.patchCommentByCommentId = (req, res, next) => {
  const incrementer = +req.body.inc_votes;
  const comment_id = req.params.comment_id;
  updateCommentByCommentId(comment_id, incrementer)
    .then(comment => {
      res.status(200).send({ comment });
    })
    .catch(err => {
      next(err);
    });
};

exports.deleteCommentByCommentId = (req, res, next) => {
  const comment_id = req.params.comment_id;
  removeCommentByCommentId(comment_id)
    .then(deleteCount => {
      res.sendStatus(204).send();
    })
    .catch(err => {
      next(err);
    });
};
