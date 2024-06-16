const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  // if (req.query.token == 123) {
  //   next();
  // } else {
  //   res.send("Please login first");
  // }
  // var token = req.query.token;

  // key --> Authorization  && value --> bearer {token}--> this how we pass the value in headers
  var token = req.headers.authorization.split(" ")[1];
  console.log(token);
  jwt.verify(token, "self", (error, decode) => {
    if (error) {
      console.log(error);
      res.send("Please login first");
    } else {
      // console.log(req.role);
      req.user = decode;
      next();
    }
  });
};

var roleVerifyPrinciple = (req, res, next) => {
  if (req.user.role == "Principle") {
    next();
  } else {
    res.send("You are not authorized to enter in priniple room");
  }
};

module.exports = { auth, roleVerifyPrinciple };
