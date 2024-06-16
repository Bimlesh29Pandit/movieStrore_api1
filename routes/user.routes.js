const express = require("express");
const UserModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

const userRouter = express.Router();

userRouter.post("/register", async (req, res) => {
  //   res.send("Registeration Page");

  try {
    const userData = req.body;
    const userModel = await new UserModel(userData);
    userModel.save();
    res.status(200).send({ msg: " New User has been registered" });
  } catch (error) {
    res
      .status(404)
      .send(`something went wrong Unable to register due to error ${error}`);
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    // const filter = req.body;
    // console.log(filter);
    const user = await UserModel.findOne({ email, password });
    const token = jwt.sign({ email: user.email, role: user.role }, "self");
    if (user) {
      res.status(200).send({ msg: " Login Successfull", token: token });
    } else {
      res.status(200).send({ msg: " Wrong Credentials" });
    }
  } catch (error) {
    res
      .status(404)
      .send(`something went wrong Unable to login due to error ${error}`);
  }
});

module.exports = userRouter;
