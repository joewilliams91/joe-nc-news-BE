const connection = require("../db/connection");

exports.selectTopics = () => {
  return connection
    .select()
    .from("topics")
    .then(topics => {
      return topics;
    });
};

exports.checkTopicExists = topic => {
  return connection("topics")
    .first('*')
    .where({ slug: topic }).then(topic => {
      if(!topic){
        return Promise.reject({ status: 404, msg: "Not Found" });
      } else {
        return Promise.resolve()
      }
    })
};
