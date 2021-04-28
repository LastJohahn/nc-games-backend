const { selectReviewById } = require("../models/reviews.model");

exports.getReviewById = (req, res) => {
  selectReviewById().then((review) => {
    res.status(200).send({ review });
  });
};
