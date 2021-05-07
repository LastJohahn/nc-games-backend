const seed = require("./seed.js");
const devData = require("./data/development-data/index.js");

const { categoryData } = devData;
const { commentData } = devData;
const { reviewData } = devData;
const { userData } = devData;

const runSeed = async () => {
  return seed(categoryData, commentData, reviewData, userData);
};

runSeed();
