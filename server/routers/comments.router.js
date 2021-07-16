const express = require("express");

const commentsRouter = express.Router();

commentsRouter.route("/:comment_id").patch(() => {});

module.exports = commentsRouter;
