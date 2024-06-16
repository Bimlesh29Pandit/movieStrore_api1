const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const connection = require("./config/db");
const userRouter = require("./routes/user.routes");
const { auth, roleVerifyPrinciple } = require("./middleware/auth.middleware");

const app = express();

const PORT = process.env.PORT;
app.use(express.json());

app.use("/users", userRouter);

app.get("/", (req, res) => {
  res.send("Home");
});

app.get("/movie-data", auth, (req, res) => {
  res.send("Private Data");
});
app.get("/principleOffice", [auth, roleVerifyPrinciple], (req, res) => {
  // console.log(req.user);
  // here we can login with the help of role
  // if (req.user.role == "Principle") {
  //   res.send("In teh Principle office");
  // } else {
  //   res.send("You are not authorized to get in");
  // }

  res.send("You are in Principle office");
});
app.listen(PORT, async () => {
  try {
    await connection;
    console.log(
      `Server is running on port :  ${PORT} and db is also connected`
    );
  } catch (error) {
    console.log(error);
  }
});
