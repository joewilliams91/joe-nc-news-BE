exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.handlePsqlErrors = (err, req, res, next) => {
  const psql400ErrorCodes = ["22P02", "42703", "23502"];
  const psql422ErrorCodes = ["23503"];
  if (psql400ErrorCodes.includes(err.code)) {
    res.status(400).send({ msg: "Bad Request" });
  } else if (psql422ErrorCodes.includes(err.code)) {
    res.status(422).send({ msg: "Unprocessable Entity" });
  } else {
    next(err);
  }
};

exports.handleServerErrors = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
};

exports.send405Error = (req, res, next) => {
  res.status(405).send({ msg: "Method not Allowed" });
};
