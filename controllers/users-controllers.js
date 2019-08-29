const { selectUserByUsername } = require("../models/users-models");

exports.getUserByUsername = (req, res, next) => {
  const username = req.params.username;
  selectUserByUsername(username)
    .then(user => {
      res.status(200).send({ user });
    })
    .catch(next);
};
