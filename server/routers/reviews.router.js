const express = require("express");
const {
  getReviewById,
  getReviewByIdAndUpdateVotes,
} = require("../controllers/reviews.controller");

const reviewsRouter = express.Router();

reviewsRouter
  .route("/:review_id")
  .get(getReviewById)
  .patch(getReviewByIdAndUpdateVotes);

module.exports = reviewsRouter;
