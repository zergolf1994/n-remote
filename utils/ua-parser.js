"use strict";
const parser = require("ua-parser-js");
const { UserAgain } = require("../models");

exports.UserAgainGetID = async (useragent) => {
  let data = await UserAgain.findOne({ text: useragent });

  if (!data?._id) {
    //save
    let dataCreate = { text: useragent };
    let dbCreate = await UserAgain.create(dataCreate);
    if (!dbCreate?._id) {
      return {};
    }
    data = dbCreate;
  }

  return { uaId: data?._id };
};

exports.UAparser = (str) => {
  return parser(str);
};

exports.UserIP = (req) => {
  try {
    const ipAddress =
      req.ip ||
      req.headers["cf-connecting-ip"] ||
      req.headers["cf-pseudo-ipv4"] ||
      req.headers["x-real-ip"] ||
      req.headers["x-forwarded-for"];
    const Country = req.headers["cf-ipcountry"];
    return { ipAddress, Country };
  } catch (err) {
    return {};
  }
};
