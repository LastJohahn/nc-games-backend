const db = require("../../db/connection.js");
const format = require("pg-format");

exports.selectUsers = () => {
  return db
    .query(
      `
        SELECT username FROM users;
        `
    )
    .then((result) => {
      return result.rows;
    });
};

exports.selectUserByUsername = async (username) => {
  const { rows } = await db.query(
    format(
      `
    SELECT * FROM users 
    WHERE username = %L
    `,
      [username]
    )
  );
  return rows[0];
};
