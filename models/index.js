"use strict";

require("./conn");

const User = require("./user");
const UserAgain = require("./user-agent");
const Setting = require("./setting");
const GAuth = require("./gauth");
const File = require("./file");
const Server = require("./server");

module.exports = {
  User,
  UserAgain,
  Setting,
  GAuth,
  File,
  Server,
};
