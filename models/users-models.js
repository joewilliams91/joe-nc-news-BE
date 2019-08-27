const connection = require("../db/connection");

exports.selectUserByUsername = username => {
  return connection
    .select()
    .from("users")
    .where("username", "=", username)
    .then(([user]) => {
      return user;
    });
};
