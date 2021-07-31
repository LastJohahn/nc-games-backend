const db = require("../../db/connection.js");
const format = require("pg-format");

exports.selectCategories = () => {
  return db
    .query(
      `
  SELECT * FROM categories;
  `
    )
    .then((result) => {
      return result.rows;
    });
};

exports.insertCategory = async (category_body) => {
  const { slug, description } = category_body;
  const { rows } = await db.query(
    format(
      `
      INSERT INTO categories
      (slug, description)
      VALUES
      (%L)
      RETURNING*;
      `,
      [slug, description]
    )
  );
  return rows;
};
