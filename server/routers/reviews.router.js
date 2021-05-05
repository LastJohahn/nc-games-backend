const express = require("express");
const {
  getReviewById,
  getReviewByIdAndUpdateVotes,
  getReviews,
  getCommentsByReviewId,
} = require("../controllers/reviews.controller");

const reviewsRouter = express.Router();

reviewsRouter.route("/").get(getReviews);

reviewsRouter
  .route("/:review_id")
  .get(getReviewById)
  .patch(getReviewByIdAndUpdateVotes);

reviewsRouter.route("/:review_id/comments").get(getCommentsByReviewId);

module.exports = reviewsRouter;
