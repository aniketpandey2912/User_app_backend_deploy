const { UserModel } = require("../models/User.model");

const Authenticator = async (req, res, next) => {
  let { email } = req.body;
  try {
    let user = await UserModel.find({ email });
    if (user.length > 0) {
      req.body.user = user[0];
      next();
    } else {
      res.send({ msg: "Wrong Credentials" });
    }
  } catch (err) {
    res.send({ msg: "Wrong Credentials" });
  }
};

module.exports = { Authenticator };
