const db = require("../../db/connection.js");

exports.patchCommentVotesById = async (comment_id, inc_votes) => {
  if (inc_votes === undefined) {
    return Promise.reject({
      status: 422,
      msg: "Please provide a number to alter the votes count by",
    });
  }
  const { rows } = await db.query(
    `
      UPDATE comments
      SET votes = votes + $1
      WHERE comment_id = $2
      RETURNING*
      `,
    [inc_votes, comment_id]
  );
  return rows;
};
