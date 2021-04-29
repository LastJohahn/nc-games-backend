const db = require("../../db/connection.js");

exports.selectReviewById = async (review_id) => {
  const { rows } = await db.query(
    `
  SELECT reviews.*, COUNT(comments.comment_id)::int AS comment_count FROM reviews
  LEFT JOIN comments ON comments.review_id = reviews.review_id
  WHERE reviews.review_id = $1
  GROUP BY reviews.review_id;
  `,
    [review_id]
  );
  if (rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Not found" });
  }
  return rows;
};

exports.patchReviewVotesById = async (review_id, inc_votes) => {
  if (inc_votes === undefined) {
    return Promise.reject({
      status: 422,
      msg: "Please provide a number to alter the votes count by",
    });
  }
  const { rows } = await db.query(
    `
  UPDATE reviews
  SET votes = votes + $1
  WHERE review_id = $2
  RETURNING *;
  `,
    [inc_votes, review_id]
  );
  return rows;
};
