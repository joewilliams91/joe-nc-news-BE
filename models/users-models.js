const connection = require("../db/connection");

exports.selectUserByUsername = username => {
  return connection
    .select()
    .from("users")
    .where("username", "=", username)
    .then(([user]) => {
      if (!user) {
        return Promise.reject({ status: 404, msg: "Page not Found" });
      } else {
        return user;
      }
    });
};
