const uuid = require("uuid");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { Mixed } = mongoose.Schema.Types;

const List = mongoose.model(
  "file",
  new Schema(
    {
      _id: { type: String, default: () => uuid.v4() },
      active: { type: Boolean, default: true },
      type: { type: String },
      title: { type: String },
      source: { type: String },
      slug: { type: String, required: true },
      mimeType: { type: String, required: true },
      dimention: { type: String },
      views: { type: Mixed },
      size: { type: Mixed },
      duration: { type: Number },
      dirId: { type: String },
      userId: { type: String, required: true },
      trashedAt: { type: Date },
    },
    {
      timestamps: true,
    }
  )
);

const Data = mongoose.model(
  "file_data",
  new Schema(
    {
      _id: { type: String, default: () => uuid.v4() },
      active: { type: Boolean, default: true },
      type: { type: String },
      name: { type: String },
      size: { type: Mixed },
      serverId: { type: String },
      userId: { type: String, required: true },
      fileId: { type: String, required: true },
    },
    {
      timestamps: true,
    }
  )
);
const Process = mongoose.model(
  "file_process",
  new Schema(
    {
      _id: { type: String, default: () => uuid.v4() },
      type: { type: String },
      quality: { type: String },
      percent: { type: Number, default: 0 },
      content: { type: Mixed },
      serverId: { type: String },
      userId: { type: String, required: true },
      fileId: { type: String, required: true },
    },
    {
      timestamps: true,
    }
  )
);

module.exports = File = { List, Data, Process };
