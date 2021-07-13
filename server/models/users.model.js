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
  if (rows.length != 0) {
    return rows[0];
  } else {
    return Promise.reject({
      status: 404,
      msg: "No user found with this username",
    });
  }
};
