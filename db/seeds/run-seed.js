const { seed } = require("./seed.js");
const devData = require("../data/development-data/index.js");

const runSeed = async () => {
  return seed(devData);
};

runSeed();
