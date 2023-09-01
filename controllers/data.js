const { Ffmpeg } = require("../utils");
const path = require("path");
const fs = require("fs-extra");
const request = require("request");
const { File } = require("../models");

exports.DataVideo = async (req, res) => {
  try {
    const { fileId, fileName } = req.params;

    const outPutPath = `${global.dirPublic}${fileId}/${fileName}`;
    const data = await Ffmpeg.GetData(outPutPath);

    return res.json(data);
  } catch (err) {
    console.log(err);
    return res.json({ error: true });
  }
};

exports.DownloadPercent = async (req, res) => {
  try {
    const { fileId } = req.query;
    if (!fileId) {
      return res.json({ error: true, msg: "กรุณาใส่ fileId" });
    }
    if (!fs.existsSync(`${global.dirPublic}${fileId}`)) {
      return res.json({ error: true, msg: "ไม่พบข้อมูล" });
    }
    const downloadPath = `${global.dirPublic}${fileId}/file_default.txt`;
    const convertPath = `${global.dirPublic}${fileId}/convert_default.txt`;
    const remotePath = `${global.dirPublic}${fileId}/remote_default.txt`;

    let data = {};
    if (!fs.existsSync(downloadPath)) {
      data.download = 0;
    } else {
      const logData = await fs.readFileSync(downloadPath, "utf-8");

      let code = logData
        .toString()
        .replace(/ /g, "")
        .replace(/#/g, "")
        .split(/\r?\n/);

      const dataRaw = code.filter((e) => {
        return e != "";
      });

      const Array = dataRaw
        .at(0)
        .split(/\r/)
        .filter((e) => {
          return Number(e.replace(/%/g, ""));
        })
        .map((e) => {
          return Number(e.replace(/%/g, ""));
        });
      data.download = Math.max(...Array) || 0;
    }

    if (!fs.existsSync(convertPath)) {
      data.convert = 0;
    } else {
      const logData = await fs.readFileSync(convertPath, "utf-8");
      try {
        data.convert = JSON.parse(logData).percent || 0;
      } catch (error) {
        data.convert = 0;
      }
    }
    if (!fs.existsSync(remotePath)) {
      data.remote = 0;
    } else {
      const logData = await fs.readFileSync(remotePath, "utf-8");
      const svIp = JSON.parse(logData).svIp;
      const dataUpload = await getReq(
        `http://${svIp}/file-size/${fileId}/file_default.mp4`
      );

      if (!dataUpload?.size) {
        data.remote = 0;
      } else {
        const stats = fs.statSync(
          `${global.dirPublic}${fileId}/file_default.mp4`
        );
        const localSize = stats.size;
        if (localSize == dataUpload?.size) {
          data.remote = 100;
        } else {
          data.remote =
            ((Number(dataUpload?.size) * 100) / localSize ?? 0).toFixed(0) || 0;
        }
      }
    }

    let allPercent =
      Number(data.download) + Number(data.convert) + Number(data.remote);

    let totalPercent = ((allPercent * 100) / 300 ?? 0).toFixed(0) || 0;

    //find file id
    const files = await File.List.findOne({ slug: fileId }).select(`_id`);
    if (files?._id) {
      await File.Process.findOneAndUpdate(
        { fileId: files?._id, type: "remote" },
        { percent: totalPercent }
      );
    }
    return res.json(data);
  } catch (err) {
    console.log(err);
    return res.json({ error: true });
  }
};

function getReq(url) {
  try {
    return new Promise(async function (resolve, reject) {
      if (!url) resolve({ error: true });
      request({ url }, function (error, response, body) {
        if (!body) reject();
        resolve(JSON.parse(body));
      });
    });
  } catch (error) {
    return { error: true };
  }
}
