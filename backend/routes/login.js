const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const {User} = require("../models");

router.get("/", function (req, res) {
  if (req.session.username) {
    res.send({
      loggedIn: true,
      id: req.session.userid
    });
  } else {
    res.send({
      loggedIn: false
    });
  }
});

router.post("/", async function (req, res, next) {
  const username = req.body.user["username"];
  const password = req.body.user["password"];
  try{
    var user = await User.findOne({
      where: {
        username: username,
      }
    });
    if (user) {
      if (user.isVerified == false) {
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
            user:user,
            loggedIn: true
          });
        } else {
          res.json({
            message: "username and password do not match",
            loggedIn: false,
          });
        }
      }
    } else {
      res.json({
        message: "username do not exist",
        loggedIn: false
      });
    }
  }
  catch(err){
    console.log(err);
  }
});
module.exports = router;