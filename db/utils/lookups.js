const db = require("../connection.js");

exports.categoriesLookup = async () => {
  const { rows } = await db.query(`SELECT * FROM categories`);
  let lookupArray = [];
  rows.forEach((category) => {
    lookupArray.push(category.slug);
  });
  return lookupArray;
};
