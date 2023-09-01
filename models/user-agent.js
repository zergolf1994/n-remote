const uuid = require("uuid");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserAgain = mongoose.model(
  "user_agent",
  new Schema({
    _id: { type: String, default: () => uuid.v4() },
    text: { type: String, required: true },
  })
);
module.exports = UserAgain;
