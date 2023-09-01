const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { Mixed } = mongoose.Schema.Types;
const uuid = require("uuid");

const Setting = mongoose.model(
  "setting",
  new Schema({
    _id: { type: String, default: () => uuid.v4() },
    name: { type: String, required: true },
    value: { type: Mixed },
  })
);
module.exports = Setting;