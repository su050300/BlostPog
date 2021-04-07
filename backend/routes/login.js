var express = require("express");
var router = express.Router();
var bcrypt = require("bcrypt");
const User = require("../models/User");

router.get("/", function (req, res) {
  if (req.session.username) {
    res.send({
      loggedIn: true,
      username: req.session.username
    });
  } else {
    res.send({
      loggedIn: false
    });
  }
});

router.post("/", function (req, res, next) {
  const username = req.body.user["username"];
  const password = req.body.user["password"];
  User.findOne({
    where: {
      username: username,
    }
  }).then((user) => {
    if (!user) {
      res.json({
        message: "username do not exist",
        loggedIn: false
      });
    } else {
      if (user.isVeified == false) {
        res.json({
          message: "Verify your email then try login",
          loggedIn: false
        });
      } else {
        var dbpass = bcrypt.compareSync(password, user.password);
        if (dbpass) {
          req.session.username = username;
          req.session.userid = user.id;
          res.json({
            loggedIn: true
          });
        } else {
          res.json({
            message: "username and password do not match",
            loggedIn: false,
          });
        }
      }
    }
  }).catch(err => {
    throw err;
  })
});
module.exports = router;