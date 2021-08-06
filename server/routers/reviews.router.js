const express = require("express");
const {
  getReviewById,
  getReviewByIdAndUpdateVotes,
  getReviews,
  getCommentsByReviewId,
  postCommentByReviewId,
  deleteCommentByIdFromReviewId,
  postReview,
  deleteReview,
} = require("../controllers/reviews.controller");

const reviewsRouter = express.Router();

reviewsRouter.route("/").get(getReviews).post(postReview);

reviewsRouter
  .route("/:review_id")
  .get(getReviewById)
  .patch(getReviewByIdAndUpdateVotes)
  .delete(deleteReview);

reviewsRouter
  .route("/:review_id/comments")
  .get(getCommentsByReviewId)
  .post(postCommentByReviewId);

reviewsRouter
  .route("/:review_id/comments/:comment_id")
  .delete(deleteCommentByIdFromReviewId);

module.exports = reviewsRouter;
