const express = require("express");
const {
  patchCommentByCommentId,
  deleteCommentByCommentId
} = require("../controllers/comments-controllers");
// const { send405Error } = require("../errors/errorHandler");
const commentsRouter = express.Router();

commentsRouter
  .route("/:comment_id")
  .patch(patchCommentByCommentId)
  .delete(deleteCommentByCommentId);

module.exports = commentsRouter;
