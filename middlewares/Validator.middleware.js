const Validator = async (req, res, next) => {
  let { authorization, role } = req.headers;
  if (authorization && role === "Admin") {
    next();
  } else {
    res.send({ msg: "You are not authorized" });
  }
};

module.exports = { Validator };
