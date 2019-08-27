const connection = require("../db/connection");

exports.selectTopics = () => {
  return connection
    .select()
    .from("topics")
    .then(topics => {
      return topics;
    });
};
