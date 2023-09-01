const uuid = require("uuid");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { Mixed } = mongoose.Schema.Types;

const List = mongoose.model(
  "server",
  new Schema(
    {
      _id: { type: String, default: () => uuid.v4() },
      active: { type: Boolean, default: true },
      isWork: { type: Boolean, default: false },
      type: { type: String, required: true },
      svName: { type: String },
      svIp: { type: String, required: true },
      diskPercent: { type: Number, default: 0 },
      diskUsed: { type: Mixed, default: 0 },
      diskTotal: { type: Mixed, default: 0 },
      svUser: { type: String },
      svPass: { type: String },
      svPort: { type: Number },
      Domain: { type: String },
      userId: { type: String },
    },
    {
      timestamps: true,
    }
  )
);

module.exports = File = { List };
