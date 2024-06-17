const express = require("express");
const UserModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const blacklisted = require("../blacklisted");

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
          const accesstoken = jwt.sign(
            { email: user.email, password: user.passoword, role: user.role },
            "self",
            { expiresIn: "15s" }
          );
          const refressToken = jwt.sign(
            { email: user.email, password: user.passoword, role: user.role },
            "selfless",
            { expiresIn: "1d" }
          );
          res.status(200).send({
            msg: " Login Successfull",
            accesstoken: accesstoken,
            refressToken: refressToken,
          });
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

userRouter.get("/logout", (req, res) => {
  let token = req.headers.authorization.split(" ")[1];
  blacklisted.push(token);
  res.status(200).send("logout successful");
});

userRouter.post("/token", (req, res) => {
  const refressToken = req.body.token;
  if (!refressToken) {
    return res.send("You are not authenticated");
  }
  jwt.verify(refressToken, "selfless", (error, decode) => {
    if (error) {
      return res.send("Token is not valid");
    } else {
      let accesstoken = jwt.sign(
        { email: decode.email, username: decode.username, role: decode.role },
        "self",
        { expiresIn: "1m" }
      );
      res.send({ accessToken: accesstoken });
    }
  });
});
module.exports = userRouter;
