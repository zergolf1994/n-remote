"use strict";
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc"); // เพิ่มโมดูล UTC
dayjs.extend(utc);

const request = require("request");
const queryString = require("query-string");
const getSet = require("./get.set.obj");
const { GAuth } = require("../models");

exports.DriveSource = async ({ source, userId }) => {
  if (!source) return;
  try {
    const url = `https://docs.google.com/get_video_info?docid=${source}`;
    const sets = await getSet({ attr: ["string_webproxy"] });
    let headers = {},
      proxy = null,
      token = await this.AuthOneRand({ userId });

    if (token) {
      headers.Authorization = `${token?.token_type} ${token?.access_token}`;
    }
    if (sets?.string_webproxy) {
      proxy = sets?.string_webproxy;
    }
    // console.log(headers, proxy);
    return new Promise(function (resolve, reject) {
      request({ url, proxy, headers }, function (error, response, body) {
        const parsed = queryString.parse(body);
        /*
        const url_encoded = queryString.parse(
          parsed.url_encoded_fmt_stream_map
        );*/
        resolve({ ...parsed });
      });
    });
  } catch (error) {
    console.log(error);
    return;
  }
};
exports.DriveInfo = async ({ source, userId }) => {
  if (!source) return;
  try {
    const url = `https://www.googleapis.com/drive/v2/files/${source}`;
    const sets = await getSet({ attr: ["string_webproxy"] });
    let headers = {},
      proxy = null,
      token = await this.AuthOneRand({ userId });

    if (token) {
      headers.Authorization = `${token?.token_type} ${token?.access_token}`;
    }
    if (sets?.string_webproxy) {
      proxy = sets?.string_webproxy;
    }
    // console.log(headers, proxy);
    return new Promise(function (resolve, reject) {
      request({ url, proxy, headers }, function (error, response, body) {
        let out;
        try {
          out = JSON.parse(body);
        } catch (error) {
          out = body;
        }
        resolve(out);
      });
    });
  } catch (error) {
    console.log(error);
    return;
  }
};
exports.GAuthOne = async ({ userId }) => {
  try {
    return {
      access_token:
        "ya29.a0AfB_byB2TbZjcgs54CJ0l1ZFQRML_PKKVL2Ydridm_QXUs-7hXkGvf-WhvomwZ2afpmdX3N9y_kEG8rUpXYE-DDfbQ7iVPEm6dBADdqwG7MkboIaaajU-yRcsslQMorWgSAsrs8aeQKcQXsM-jKpcJo5uyaSsYOhzXQIIxDRHhUaCgYKAasSARISFQHsvYlsnsddJaSzrYx-v_e3adDf5Q0178",
      expires_in: 3599,
      scope: "https://www.googleapis.com/auth/drive",
      token_type: "Bearer",
    };
  } catch (error) {
    return;
  }
};

exports.AuthOneRand = async ({ userId }) => {
  try {
    // เช็คจำนวน
    const count = await GAuth.countDocuments({ userId, active: true });
    let row;
    if (count > 1) {
      //มีมากกว่า 1
      const pipeline = [
        { $match: { userId, active: true } },
        { $sample: { size: 1 } }, // สุ่มเลือก 1 เรคคอร์ด
      ];
      const randomRecord = await GAuth.aggregate(pipeline);
      if (randomRecord[1]) row = randomRecord[1];
    } else if (count > 0) {
      //มี 1
      row = await GAuth.findOne({ userId, active: true });
    } else {
      //ไม่มี
      const pipeline = [
        { $match: { userId: undefined, active: true } },
        { $sample: { size: 1 } }, // สุ่มเลือก 1 เรคคอร์ด
      ];
      const randomRecord = await GAuth.aggregate(pipeline);
      if (randomRecord[1]) row = randomRecord[1];
    }
    if (!row) return;
    //อัพเดต
    if (dayjs().diff(dayjs(row?.updatedAt), "second") > 3500) {
      let token = await this.AuthGetNewToken(row);
      let dataUpdate = { token };

      let dbUpdate = await GAuth.findByIdAndUpdate(
        { _id: row?._id },
        { ...dataUpdate }
      );
      if (dbUpdate?._id) {
        row = dbUpdate;
      }
    }
    return row?.token || {}; // เนื่องจากเราสุ่มเลือก 1 เรคคอร์ดเท่านั้น
  } catch (error) {
    console.log(error);
    return;
  }
};

exports.AuthGetNewToken = async ({
  client_id,
  client_secret,
  refresh_token,
}) => {
  try {
    const url = "https://www.googleapis.com/oauth2/v4/token";
    const data = {
      client_id,
      client_secret,
      refresh_token,
      grant_type: "refresh_token",
    };

    return new Promise(function (resolve, reject) {
      request.post(url, { form: data }, function (err, response, body) {
        const parsed = JSON.parse(response?.body);
        //delete parsed.expires_in;
        resolve(parsed);
      });
    });
  } catch (error) {
    return;
  }
};
