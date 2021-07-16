const { patchCommentVotesById } = require("../models/comments.model.js");

exports.getCommentByIdAndUpdateVotes = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  patchCommentVotesById(comment_id, inc_votes)
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch(next);
};
