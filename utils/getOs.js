"use strict";
const os = require("os");
module.exports = () => {
  try {
    const ipV4 = Object.values(os.networkInterfaces())
      .flat()
      .filter(({ family, internal }) => family === "IPv4" && !internal)
      .map(({ address }) => address)
      .at(0);
    const hostname = os.hostname();

    return { ipV4, hostname };
  } catch (error) {
    console.log(error);
    return { ipV4: undefined, hostname: undefined };
  }
};
