const express = require("express");
const {
  getCommentByIdAndUpdateVotes,
} = require("../controllers/comments.controller");

const commentsRouter = express.Router();

commentsRouter.route("/:comment_id").patch(getCommentByIdAndUpdateVotes);

module.exports = commentsRouter;
