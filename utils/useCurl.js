const request = require("request");

exports.get = async (data) => {
  try {
    return new Promise(function (resolve, reject) {
      request.get(data, function (err, response, body) {
        const parsed = JSON.parse(response?.body);
        resolve(parsed);
      });
    });
  } catch (error) {
    return;
  }
};
