const {
  selectCategories,
  insertCategory,
} = require("../models/categories.model.js");

exports.getCategories = (req, res, next) => {
  selectCategories()
    .then((categories) => {
      res.status(200).send({ categories });
    })
    .catch(next);
};

exports.postCategory = (req, res, next) => {
  const category_body = req.body;
  insertCategory(category_body);
};
