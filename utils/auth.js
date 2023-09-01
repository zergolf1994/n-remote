const { Decrypt } = require("./jwt");

const authVerify = async (req, res, next) => {
  try {
    let token;
    if (req?.headers?.authorization) {
      const bearer = req?.headers?.authorization?.split(" ");
      if (bearer?.at(0) != "Bearer")
        return res.status(401).json({ error: true, msg: "invalid_token" });
      token = bearer?.at(1);
    } else {
      token =
        req.body.accessToken ||
        req.query.accessToken ||
        req.headers["x-access-token"];
    }

    if (!token)
      return res.status(401).json({ error: true, msg: "required_token" });

    let decrypt = Decrypt(token);
    if (!decrypt?.userId)
      return res.status(403).json({ error: true, msg: `invalid_id` });

    req.authentication = {
      ...decrypt,
    };
  } catch (error) {
    return res.status(401).json({ error: true, msg: "invalid_token" });
    /*req.authentication = {
      error: "invalid_token",
    };*/
  }
  return next();
};
module.exports = authVerify;
