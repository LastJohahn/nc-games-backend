const { selectCategories } = require("../models/categories.model.js");

exports.getCategories = (req, res) => {
  selectCategories()
    .then((categories) => {
      res.status(200).send({ categories });
    })
    .catch((err) => {
      res.status(500).send({ msg: "internal server error" });
    });
};
