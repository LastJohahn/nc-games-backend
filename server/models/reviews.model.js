const db = require("../../db/connection.js");
const format = require("pg-format");

exports.selectReviews = async (
  sort_by = "created_at",
  order = "DESC",
  category
) => {
  if ((order === "DESC" || order === "ASC") && category === undefined) {
    const { rows } = await db.query(
      `
  SELECT reviews.*, COUNT(comments.comment_id)::int AS comment_count FROM reviews
  LEFT JOIN comments ON comments.review_id = reviews.review_id
  GROUP BY reviews.review_id
  ORDER BY reviews.${sort_by} ${order}; 
  `
    );
    return rows;
  } else if (category != undefined && (order === "DESC" || order === "ASC")) {
    const queryString = format(
      `
    SELECT reviews.*, COUNT(comments.comment_id)::int AS comment_count FROM reviews
    LEFT JOIN comments ON comments.review_id = reviews.review_id
    WHERE category LIKE %L
    GROUP BY reviews.review_id
    ORDER BY reviews.${sort_by} ${order};
    `,
      [category]
    );
    const { rows } = await db.query(queryString);
    return rows;
  } else {
    return Promise.reject({
      status: 400,
      msg: "Please provide a valid order query",
    });
  }
};

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
