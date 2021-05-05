exports.handleInvalidRouteErrors = (req, res, next) => {
  res.status(404).send({ msg: "route not found" });
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.handleInvalidSortQuery = (err, req, res, next) => {
  if (err.code === "42703") {
    res.status(400).send({ msg: "Invalid sort_by query" });
  } else {
    next(err);
  }
};

exports.handleInvalidParam = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid request parameter" });
  } else {
    next(err);
  }
};

exports.handleInvalidUsername = (err, req, res, next) => {
  if (err.code === "23503") {
    res.status(422).send({
      msg: "Username not recognised, please provide a user from the database",
    });
  } else {
    next(err);
  }
};

exports.handleInternalServerError = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal Server Error" });
};
