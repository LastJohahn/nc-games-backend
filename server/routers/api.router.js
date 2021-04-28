const express = require("express");
const categoryRouter = require("./category.router.js");

const apiRouter = express.Router();

apiRouter.use("/categories", categoryRouter);

module.exports = apiRouter;
