const { Client } = require("node-scp");
const fs = require("fs-extra");

exports.Storage = async ({ row, storage }) => {
  try {
    let outPutPath = `${global.dirPublic}${row?.slug}/file_${row?.quality}.mp4`;
    let saveDir = `/home/files/${row.slug}`;

    let sshConfig = {
      host: storage?.svIp,
      port: storage?.svPort,
      username: storage?.svUser,
      password: storage?.svPass,
    };
    return new Promise(async function (resolve, reject) {
      Client(sshConfig)
        .then(async (client) => {
          //เข็คว่ามาโฟลเดอร์ไหม
          const dir_exists = await client
            .exists(saveDir)
            .then((result) => {
              return result;
            })
            .catch((error) => {
              client.close();
              resolve({ error: true, msg: "check_dir" });
            });
          //หากไม่มีให้สร้าง
          if (!dir_exists) {
            await client
              .mkdir(saveDir)
              .then((response) => {
                console.log("dir created", saveDir);
              })
              .catch((error) => {
                client.close();
                resolve({ error: true, msg: "create_dir" });
              });
          }

          fs.writeFileSync(
            `${global.dirPublic}${row?.slug}/remote_${row?.quality}.txt`,
            JSON.stringify({ svIp: storage?.svIp }),
            "utf8"
          );

          await client
            .uploadFile(outPutPath, `${saveDir}/file_${row?.quality}.mp4`)
            .then(async (response) => {
              resolve({ msg: "uploaded" });
            })
            .catch((error) => {
              client.close();
              resolve({ error: true, msg: "upload" });
            });
          client.close();
          resolve({ msg: "done" });
        })
        .catch((e) => {
          //console.log("e", e);
          client.close();
          resolve({ error: true, msg: "connect" });
        });
    });
  } catch (err) {
    console.log(err);
    return res.json({ error: true });
  }
};
