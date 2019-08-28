const express = require('express');
const apiRouter = require('./routes/api-router')
const {
    handleCustomErrors,
    handlePsqlErrors,
    handleServerErrors
  } = require("./errors/error-handler");
const app = express();

app.use(express.json());
app.use('/api', apiRouter);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

app.all("/*", (req, res, next) => {
  res.status(404).send({ msg: "Not Found" });
});

module.exports = app;