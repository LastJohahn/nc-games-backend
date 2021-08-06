const format = require("pg-format");
const { offsetCalculator } = require("./data-manipulation.js");

exports.selectReviewsQueryString = (
  sort_by,
  order,
  category,
  validLimit,
  p = "1"
) => {
  let queryString;
  const validPage = offsetCalculator(validLimit, p);
  if (!category) {
    queryString = format(
      `
  SELECT reviews.*, COUNT(comments.comment_id)::int AS comment_count FROM reviews
  LEFT JOIN comments ON comments.review_id = reviews.review_id
  GROUP BY reviews.review_id
  ORDER BY reviews.${sort_by} ${order}
  LIMIT ${validLimit} OFFSET ${validPage};
  `,
      []
    );
  } else {
    queryString = format(
      `
  SELECT reviews.*, COUNT(comments.comment_id)::int AS comment_count FROM reviews
  LEFT JOIN comments ON comments.review_id = reviews.review_id
  WHERE category LIKE %L
  GROUP BY reviews.review_id
  ORDER BY reviews.${sort_by} ${order}
  LIMIT ${validLimit} OFFSET ${validPage};
  `,
      [category]
    );
  }
  return queryString;
};
