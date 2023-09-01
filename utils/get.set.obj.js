"use strict";

const { Setting } = require("../models");

module.exports = async ({ attr = [] }) => {
  try {
    let where = {};
    if (attr.length) where.name = attr;

    let rows = await Setting.find({ ...where }).select(`-_id name value`);

    var object = rows.reduce(
      (obj, item) => Object.assign(obj, { [item.name]: item.value }),
      {}
    );
    return object || {};
  } catch (error) {
    return {};
  }
};
