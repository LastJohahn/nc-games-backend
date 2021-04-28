const db = require("../../db/connection.js");

exports.selectReviewById = () => {
  return db
    .query(
      `
  SELECT * FROM reviews
  `
    )
    .then((result) => {
      return result.rows;
    });
};
