const db = require("../../db/connection.js");
const format = require("pg-format");
const { categoriesLookup } = require("../../db/utils/lookups.js");

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
    const categories = await categoriesLookup();
    if (categories.includes(category)) {
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
        msg: "Please provide a valid category query",
      });
    }
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

exports.selectCommentsByReviewId = async (review_id) => {
  const { rows } = await db.query(
    format(
      `
    SELECT comment_id, author, votes, created_at, body
    FROM comments
    WHERE review_id = %L
    `,
      [review_id]
    )
  );
  if (rows.length != 0) {
    return rows;
  } else {
    return Promise.reject({
      status: 404,
      msg: "No comments found for this review",
    });
  }
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

exports.insertCommentByReviewId = async (review_id, comment_body) => {
  const { body } = comment_body;
  const { username } = comment_body;
  const { rows } = await db.query(
    format(
      `
    INSERT INTO comments
    (author, body, review_id, votes, created_at)
    VALUES
    (%L, DEFAULT, DEFAULT)
    RETURNING*;
  `,
      [username, body, review_id]
    )
  );
  return rows;
};
