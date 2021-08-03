const express = require("express");
const cors = require("cors");
const {
  handleInvalidRouteErrors,
  handleInternalServerError,
  handleInvalidParam,
  handleCustomErrors,
  handleInvalidUsername,
  handleInvalidReviewId,
  handleInvalidCategory,
} = require("./server/controllers/errors.controller.js");
const apiRouter = require("./server/routers/api.router.js");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", apiRouter);

app.all("/*", handleInvalidRouteErrors);

app.use(handleCustomErrors);
app.use(handleInvalidParam);
app.use(handleInvalidUsername);
app.use(handleInvalidCategory);
app.use(handleInvalidReviewId);
app.use(handleInternalServerError);

module.exports = app;
