const format = require("pg-format");
const db = require("../connection.js");
const { dropTables, createTables } = require("../manage-tables.js");

exports.seed = function ({ categoryData, commentData, reviewData, userData }) {
  // add seeding functionality here
  // this function should take as argument(s) all the data it needs to seed
  // it should insert this data into the relevant tables in your database
};
