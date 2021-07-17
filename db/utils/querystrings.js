exports.selectReviewsQueryString = (sort_by, order, category) => {
  let queryString;
  if (!category) {
    queryString = `
  SELECT reviews.*, COUNT(comments.comment_id)::int AS comment_count FROM reviews
  LEFT JOIN comments ON comments.review_id = reviews.review_id
  GROUP BY reviews.review_id
  ORDER BY reviews.${sort_by} ${order};
  `;
  } else {
    queryString = `
  SELECT reviews.*, COUNT(comments.comment_id)::int AS comment_count FROM reviews
  LEFT JOIN comments ON comments.review_id = reviews.review_id
  WHERE category LIKE "${category}"
  GROUP BY reviews.review_id
  ORDER BY reviews.${sort_by} ${order};
  `;
  }
  return queryString;
};
