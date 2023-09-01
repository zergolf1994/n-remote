"use strict";
const jwt = require("jsonwebtoken");

//decrypt
exports.Decrypt = (token) => {
  return jwt.verify(token, process.env.JWT_TOKEN_KEY);
};
//encrypt
exports.Encrypt = (data = {}, option = {}) => {
  return jwt.sign(data, process.env.JWT_TOKEN_KEY, option);
};
