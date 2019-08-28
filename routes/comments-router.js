const express = require("express");
const {
  patchCommentByCommentId,
  deleteCommentByCommentId
} = require("../controllers/comments-controllers");
const { send405Error } = require("../errors/error-handler");
const commentsRouter = express.Router();

commentsRouter
  .route("/:comment_id")
  .patch(patchCommentByCommentId)
  .delete(deleteCommentByCommentId)
  .all(send405Error);

module.exports = commentsRouter;
