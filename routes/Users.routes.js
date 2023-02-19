const express = require("express");
const usersRouter = express.Router();
const { UserModel } = require("../models/User.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Authenticator } = require("../middlewares/Authenticator.middleware");
const { Validator } = require("../middlewares/Validator.middleware");

usersRouter.post("/register", async (req, res) => {
  let { password, confirm_password } = req.body;
  try {
    if (password !== confirm_password) {
      res.send({ msg: "Passowd & confirm password should be same" });
    }
    bcrypt.hash(password, 5, async (err, hash) => {
      try {
        const user = new UserModel({
          ...req.body,
          password: hash,
          confirm_password: hash,
        });
        await user.save();
        res.send({ msg: "Registration successful" });
      } catch (err) {
        res.send({ msg: err.message });
      }
    });
  } catch (err) {
    res.send({ msg: "Something went wrong" });
  }
});

usersRouter.post("/login", Authenticator, async (req, res) => {
  let { password, user } = req.body;
  console.log(user);
  try {
    bcrypt.compare(password, user.password, (err, result) => {
      if (result) {
        let token = jwt.sign({ userID: user._id }, "masai");
        res.send({ msg: "Login successfull", token: token, role: user.ROle });
      } else {
        res.send({ msg: "Something went wrong", error: err });
      }
    });
  } catch (err) {
    res.send({ msg: "Wrong Credentials" });
  }
});

usersRouter.get("/", async (req, res) => {
  try {
    let users = await UserModel.find();
    res.send(users);
  } catch (err) {
    res.send({ msg: "Get users request failed", error: err.message });
  }
});

usersRouter.get("/:id", async (req, res) => {
  try {
    let user = await UserModel.findById(req.params.id);
    res.send(user);
  } catch (err) {
    res.send({ error: err.message });
  }
});

usersRouter.patch("/:id", Validator, async (req, res) => {
  let ID = req.params.id;
  let payload = req.body;
  console.log(ID, payload);
  try {
    await UserModel.findByIdAndUpdate({ _id: ID }, payload);
    res.send({ msg: "User info updated" });
  } catch (err) {
    res.send({ error: err.message });
  }
});

usersRouter.delete("/:id", Validator, async (req, res) => {
  let ID = req.params.id;
  try {
    let user = await UserModel.findByIdAndDelete(ID);
    res.send({ msg: "User account deleted" });
  } catch (err) {
    res.send({ error: err.message });
  }
});

module.exports = { usersRouter };
