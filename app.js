const express = require("express");
const apiRouter = require("./server/routers/api.router.js");

const app = express();
app.use(express.json());

app.use("/api", apiRouter);

app.use(function (req, res, next) {
  res.status(404).send({ msg: "route not found" });
});

module.exports = app;
