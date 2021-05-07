const express = require("express");
const {
  handleInvalidRouteErrors,
  handleInternalServerError,
  handleInvalidParam,
  handleCustomErrors,
  handleInvalidSortQuery,
  handleInvalidUsername,
  handleInvalidReviewId,
} = require("./server/controllers/errors.controller.js");
const apiRouter = require("./server/routers/api.router.js");

const app = express();
app.use(express.json());

app.use("/api", apiRouter);

app.all("/*", handleInvalidRouteErrors);

app.use(handleCustomErrors);
app.use(handleInvalidParam);
app.use(handleInvalidUsername);
app.use(handleInvalidReviewId);
app.use(handleInternalServerError);

module.exports = app;
