const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { Mixed } = mongoose.Schema.Types;
const uuid = require("uuid");

const GAuth = mongoose.model(
  "gauth",
  new Schema(
    {
      _id: { type: String, default: () => uuid.v4() },
      active: { type: Boolean, default: true },
      role: { type: Array, default: ["access", "download"] },
      email: { type: String, required: true },
      client_id: { type: String, required: true },
      client_secret: { type: String, required: true },
      refresh_token: { type: String, required: true },
      token: { type: Mixed },
      userId: { type: String },
    },
    {
      timestamps: true,
    }
  )
);
module.exports = GAuth;
