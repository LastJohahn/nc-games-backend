const express = require("express");
const { getCategories } = require("../controllers/category.controller");

const categoryRouter = express.Router();

categoryRouter.route("/").get(getCategories);

module.exports = categoryRouter;
