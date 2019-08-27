const express = require('express');
const apiRouter = require('./routes/api-router')
// const {
//     handleCustomErrors,
//     handlePsqlErrors,
//     handleServerErrors
//   } = require("./errors/errorHandler");
const app = express();

app.use(express.json());
app.use('/api', apiRouter);

// app.use(handleCustomErrors);
// app.use(handlePsqlErrors);
// app.use(handleServerErrors);

// app.all("/*", (req, res, next) => {
//   res.status(404).send({ msg: "Page not Found" });
// });

module.exports = app;