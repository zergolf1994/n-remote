"use strict";

require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const cors = require("cors");
const path = require("path");
const app = express();

// Global
global.dir = __dirname;
global.dirPublic = path.join(global.dir, "public/");


app.set("trust proxy", true);
app.use(
  cors({
    origin: "*",
    optionsSuccessStatus: 200,
  })
);

app.use(express.static(global.dirPublic));

app.use(bodyParser.json({ limit: "10mb" }));
app.options("*", (req, res, next) => res.end());

app.use(require("./routes"));

const server = http.createServer(app);
server.listen(process.env.HTTP_PORT, () =>
  console.log(`Listening on port: %s`, process.env.HTTP_PORT)
);
