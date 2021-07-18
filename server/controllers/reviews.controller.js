const {
  selectReviewById,
  patchReviewVotesById,
  selectReviews,
  selectCommentsByReviewId,
  insertCommentByReviewId,
  removeCommentByIdFromReviewId,
} = require("../models/reviews.model");

exports.getReviews = (req, res, next) => {
  const { sort_by, order, category, limit } = req.query;
  selectReviews(sort_by, order, category, limit)
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch(next);
};

exports.getReviewById = (req, res, next) => {
  const { review_id } = req.params;
  selectReviewById(review_id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch(next);
};

exports.getReviewByIdAndUpdateVotes = (req, res, next) => {
  const { review_id } = req.params;
  const { inc_votes } = req.body;
  patchReviewVotesById(review_id, inc_votes)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch(next);
};

exports.getCommentsByReviewId = (req, res, next) => {
  const { review_id } = req.params;
  selectCommentsByReviewId(review_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postCommentByReviewId = (req, res, next) => {
  const { review_id } = req.params;
  const comment_body = req.body;
  insertCommentByReviewId(review_id, comment_body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.deleteCommentByIdFromReviewId = (req, res, next) => {
  const { comment_id } = req.params;
  removeCommentByIdFromReviewId(comment_id)
    .then((comment) => {
      res.status(204).send();
    })
    .catch(next);
};
