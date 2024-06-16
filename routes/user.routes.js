const express = require("express");
const UserModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userRouter = express.Router();

userRouter.post("/register", async (req, res) => {
  //   res.send("Registeration Page");

  try {
    const { username, email, password, age, role } = req.body;
    bcrypt.hash(password, 5, async (error, hash) => {
      if (error) {
        res
          .status(404)
          .send(
            `something went wrong in creating the hash password with error ${error}`
          );
      } else {
        const userModel = new UserModel({
          username,
          email,
          password: hash,
          age,
          role,
        });
        await userModel.save();
        res.status(200).send({ msg: " New User has been registered" });
      }
    });
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
    const user = await UserModel.findOne({ email });
    if (user) {
      bcrypt.compare(password, user.password, (error, result) => {
        //result --> boolean (true or false)
        if (error) {
          res
            .status(404)
            .send(
              `something went wrong in comapring the password with error ${error}`
            );
        }

        if (result) {
          const token = jwt.sign(
            { email: user.email, password: user.passoword, role: user.role },
            "self"
          );
          res.status(200).send({ msg: " Login Successfull", token: token });
        } else {
          res.status(200).send({ msg: "wrong Credentials try again!!!" });
        }
      });
    } else {
      res.status(200).send({ msg: " Wrong email Credentials" });
    }
  } catch (error) {
    res
      .status(404)
      .send(`something went wrong Unable to login due to error ${error}`);
  }
});

module.exports = userRouter;
