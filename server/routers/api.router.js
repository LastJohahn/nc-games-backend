const express = require("express");
const { endpointsLister } = require("../controllers/api.controller.js");
const categoriesRouter = require("./categories.router.js");
const reviewsRouter = require("./reviews.router.js");
const usersRouter = require("./users.router.js");

const apiRouter = express.Router();

apiRouter.use("/categories", categoriesRouter);

apiRouter.use("/reviews", reviewsRouter);

apiRouter.use("/users", usersRouter);

apiRouter.use("/", endpointsLister);

module.exports = apiRouter;
