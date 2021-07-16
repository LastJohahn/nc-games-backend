exports.getCommentByIdAndUpdateVotes = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
};
