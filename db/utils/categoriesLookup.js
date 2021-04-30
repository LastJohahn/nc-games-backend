const db = require("../connection.js");

exports.categoriesLookup = async () => {
  // get all categories from categories
  // return them in an object i can use to check in GET /api/reviews?category=
  const { rows } = await db.query(`SELECT * FROM categories`);
  let lookupArray = [];
  rows.forEach((category) => {
    lookupArray.push(category.slug);
  });
  return lookupArray;
};
