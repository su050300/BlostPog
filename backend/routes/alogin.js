const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const {Admin} = require("../models");

router.get("/", function (req, res) {
  console.log(req.session.adminname);
  if (req.session.adminname) {
    res.json({
      loggedIn: true,
      adminname: req.session.adminname,
    });
  } else {
    res.json({
      loggedIn: false,
    });
  }
});

router.post("/", async function (req, res, next) {
  const username = req.body.user["username"];
  const password = req.body.user["password"];
  try{
    var admin = await Admin.findOne({
      where: {
        username: username,
      }
    });
    if (admin) {
        var dbpass = bcrypt.compareSync(password, admin.password);
        if (dbpass) {
          req.session.adminname = username;
          res.json({
            loggedIn: true
          });
        } else {
          res.json({
            message: "username and password do not match",
            loggedIn: false,
          });
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