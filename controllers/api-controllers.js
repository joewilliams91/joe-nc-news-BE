const { selectAllEndpoints } = require("../models/api-models");

exports.getAllEndpoints = (req, res, next) => {
  selectAllEndpoints().then(endpoints => {
    res.status(200).send({ endpoints });
  });
};
