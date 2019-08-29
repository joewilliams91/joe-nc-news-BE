const ENV = process.env.NODE_ENV || "development";
const testData = require("./data/test-data");
const devData = require("./data/development-data");

const data = {
  test: testData,
  development: devData,
  production: devData
};

module.exports = data[ENV];
