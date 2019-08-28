exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.handlePsqlErrors = (err, req, res, next) => {
  const psql400ErrorCodes = ["22P02", "42703"];
  if (psql400ErrorCodes.includes(err.code)) {
    res.status(400).send({ msg: "Bad Request" });
  }
};

exports.send405Error = (req, res, next) => {
  res.status(405).send({ msg: "Method not Allowed" });
};

exports.handleServerErrors = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
};
