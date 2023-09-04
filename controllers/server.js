const { Server, File } = require("../models");
const { getOs } = require("../utils");
const shell = require("shelljs");

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

exports.serverReload = async (req, res) => {
  try {
    let { ipV4, hostname } = getOs();

    const row = await Server.List.findOne({
      svIp: ipV4,
    }).select(`_id svIp`);

    if (!row?._id) return res.json({ error: true, msg: `ไม่พบเซิฟเวอร์` });

    await Server.List.findByIdAndUpdate(
      { _id: row?._id },
      { isWork: false, active: true }
    );
    await File.Process.deleteOne({ serverId: row?._id });

    shell.exec(
      `sudo bash ${global.dir}/shell/reload.sh ${global.dir}`,
      { async: false, silent: false },
      function (data) {}
    );

    return res.json({
      msg: `เริ่มรีโหลด ${hostname}`,
    });
  } catch (err) {
    console.log(err);
    return res.json({ error: true });
  }
};

exports.serverReloaded = async (req, res) => {
  try {
    let { ipV4, hostname } = getOs();

    const row = await Server.List.findOne({
      svIp: ipV4,
    }).select(`_id svIp`);

    if (!row?._id) return res.json({ error: true, msg: `ไม่พบเซิฟเวอร์` });

    await Server.List.findByIdAndUpdate({ _id: row?._id }, { active: true });

    return res.json({
      msg: `รีโหลด ${hostname} สำเร็จ`,
    });
  } catch (err) {
    console.log(err);
    return res.json({ error: true });
  }
};
