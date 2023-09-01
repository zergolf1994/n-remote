"use strict";
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const fs = require("fs-extra");

exports.GetData = async (video) => {
  try {
    return new Promise((resolve, reject) => {
      ffmpeg(video).ffprobe((err, data) => {
        if (err) {
          resolve({ error: true });
        }
        resolve(data);
      });
    });
  } catch (error) {
    //console.error(error);
    return { error: true };
  }
};

exports.ConvertDefault = async ({ row }) => {
  try {
    const inputPath = path.join(global.dirPublic, row?.slug),
      inputFile = `file_${row?.quality}`,
      outputFile = `file_${row?.quality}.mp4`;

    let video_data = await this.GetData(path.join(inputPath, inputFile));
    const streams = video_data?.streams;
    const videoStream = streams.find((stream) => stream.codec_type === "video");
    if (!videoStream) {
      return res.json({ error: true, msg: "ไม่พบสตรีมวิดีโอในไฟล์" });
    }
    let { codec_name } = videoStream;

    const audioStream = streams.find((stream) => stream.codec_type === "audio");

    return new Promise((resolve, reject) => {
      let setup = ffmpeg(path.join(inputPath, inputFile));
      setup.output(path.join(inputPath, outputFile));
      if (codec_name != "h264") {
        setup.videoCodec("libx264");
      } else {
        setup.videoCodec("copy");
      }

      if (audioStream && audioStream?.codec_name == "acc") {
        setup.audioCodec("aac");
      }

      setup.on("start", () => {
        console.log("Convert..", row?.slug);
      });
      setup.on("progress", async (d) => {
        let percent = Math.floor(d?.percent);
        fs.writeFileSync(
          path.join(inputPath, `convert_${row?.quality}.txt`),
          JSON.stringify({ percent: percent || 0 }),
          "utf8"
        );
        //console.log("Convert..", row?.slug, percent);
      });
      setup.on("end", async () => {
        fs.writeFileSync(
          path.join(inputPath, `convert_${row?.quality}.txt`),
          JSON.stringify({ percent: 100 }),
          "utf8"
        );
        resolve({ msg: "converted" });
      });
      setup.on("error", async (err, stdout, stderr) => {
        fs.writeFileSync(
          path.join(inputPath, `convert_${row?.quality}.txt`),
          JSON.stringify({ percent: 100 }),
          "utf8"
        );
        console.log(`error video-convert`, err);
        resolve({ error: true, err });
      });
      setup.run();
    });
  } catch (error) {
    //console.error(error);
    return { error: true };
  }
};
