"use strict";
const express = require("express");
const router = express.Router();

const {
  PreStart,
  DataRemote,
  UploadToStorage,
  ConvertToMp4,
} = require("./controllers/remote");

router.get("/start", PreStart);

router.get("/data", DataRemote);

router.get("/convert", ConvertToMp4);

router.get("/remote", UploadToStorage);

const { DataVideo, DownloadPercent } = require("./controllers/data");
router.get("/video/:fileId/:fileName", DataVideo);

router.get("/download-percent", DownloadPercent);

const { serverCreate } = require("./controllers/server");
router.get("/server/create", serverCreate);

router.all("*", async (req, res) => {
  return res.status(404).json({ error: true, msg: `link_not_found` });
});

module.exports = router;
