const uuid = require("uuid");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { Mixed } = mongoose.Schema.Types;

const List = mongoose.model(
  "user",
  new Schema(
    {
      _id: { type: String, default: () => uuid.v4() },
      active: { type: Boolean, default: true },
      username: { type: String, required: true },
      password: { type: String, required: true },
      role: { type: String, default: "member", required: true },
      planId: { type: String },
    },
    {
      timestamps: true,
    }
  )
);

const Auth = mongoose.model(
  "user_auth",
  new Schema(
    {
      _id: { type: String, default: () => uuid.v4() },
      userId: { type: String, required: true },
      uaId: { type: String, required: true },
      active: { type: Boolean, default: true },
      token: { type: String, required: true },
      ipAddress: { type: String, default: "" },
    },
    {
      timestamps: true,
    }
  )
);

module.exports = User = { List, Auth };
