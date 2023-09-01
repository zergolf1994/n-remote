"use strict";
const mongoose = require("mongoose");
mongoose.set("strictQuery", true);

const { MONGO_IP, MONGO_USERNAME, MONGO_PASSWORD, MONGO_PORT, MONGO_DATABASE } =
  process.env;
const URI = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}`;

module.exports = mongoose.connect(
  URI,
  {
    dbName: MONGO_DATABASE,
  },
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  },
  (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Connected to MongoDB");
    }
  }
);
