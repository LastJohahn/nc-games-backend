const db = require("../../db/connection.js");
const format = require("pg-format");
const { categoriesLookup } = require("../../db/utils/lookups.js");
const { selectReviewsQueryString } = require("../../db/utils/querystrings.js");
const { numberSanitiser } = require("../../db/utils/sanitisers.js");

exports.selectReviews = async (
  sort_by = "created_at",
  order = "DESC",
  category,
  limit = "10",
  p
) => {
  const sortByColumns = [
    "review_id",
    "title",
    "review_body",
    "designer",
    "review_img_url",
    "votes",
    "category",
    "owner",
    "created_at",
    "comment_count",
  ];
  const categories = await categoriesLookup();
  const validLimit = numberSanitiser(limit);
  if (validLimit != "NaN") {
    if (sortByColumns.includes(sort_by)) {
      if (order === "DESC" || order === "ASC") {
        if (category === undefined || categories.includes(category)) {
          const queryString = selectReviewsQueryString(
            sort_by,
            order,
            category,
            validLimit,
            p
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
    } else {
      return Promise.reject({
        status: 400,
        msg: "Invalid sort_by query",
      });
    }
  } else {
    return Promise.reject({
      status: 400,
      msg: "Please provide a valid limit query",
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
  return rows[0];
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
  return rows[0];
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
  return rows[0];
};

exports.removeCommentByIdFromReviewId = async (comment_id) => {
  const { rows } = await db.query(
    format(
      `
      DELETE FROM comments
      WHERE comment_id = %L
      RETURNING *;
      `,
      [comment_id]
    )
  );
  if (rows.length != 0) {
    return rows;
  } else {
    return Promise.reject({
      status: 404,
      msg: "No comment found with this id",
    });
  }
};

exports.insertReview = async (
  owner,
  title,
  review_body,
  designer,
  category
) => {
  const { rows } = await db.query(
    format(
      `
      INSERT INTO reviews
      (title, review_body, designer, owner, category, votes, review_img_url, created_at)
      VALUES
      (%L, DEFAULT, DEFAULT, DEFAULT)
      RETURNING*;
      `,
      [title, review_body, designer, owner, category]
    )
  );
  return rows[0];
};

exports.deleteReview = async (review_id) => {
  const { rows } = await db.query(
    format(
      `
      DELETE FROM reviews
      WHERE review_id = %L
      RETURNING*;
      `,
      [review_id]
    )
  );
  if (rows.length === 0) {
    return Promise.reject({
      status: 404,
      msg: "No review with this ID",
    });
  }
  return rows;
};
