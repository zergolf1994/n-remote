const { Server } = require("../models");
const { getOs } = require("../utils");

exports.serverCreate = async (req, res) => {
  try {
    let { ipV4, hostname } = getOs();

    const server = await Server.List.findOne({
      svIp: ipV4,
    }).select(`_id svIp`);

    if (server?._id)
      return res.json({ error: true, msg: `มีเซิฟเวอร์ในระบบแล้ว` });

    let dataCreate = {
      type: "remote",
      svIp: ipV4,
      svName: hostname,
      isWork: false,
    };

    let dbCreate = await Server.List.create(dataCreate);
    if (dbCreate?._id) {
      return res.json({
        msg: `เพิ่มเซิฟเวอร์ ${hostname} สำเร็จ`,
      });
    } else {
      return res.json({ error: true, msg: `ลองอีกครั้ง` });
    }
  } catch (err) {
    console.log(err);
    return res.json({ error: true });
  }
};
