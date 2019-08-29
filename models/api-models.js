const fs = require("fs");

exports.selectAllEndpoints = cb => {
  return new Promise(function(resolve, reject) {
    fs.readFile("./endpoints.json", "utf8", (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};
