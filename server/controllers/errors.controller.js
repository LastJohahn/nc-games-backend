exports.handleInvalidRouteErrors = (req, res, next) => {
  res.status(404).send({ msg: "route not found" });
};

exports.handleInternalServerError = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal Server Error" });
};
