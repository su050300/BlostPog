const express = require("express");
const router = express.Router();
const {Admin} = require("../models");
const bcrypt = require("bcrypt");

router.post("/", async function (req, res) {
  const username = req.body.user["username"];
  const email = req.body.user["email"];
  const password = req.body.user["password"];
  try {
    var admin = await Admin.findOne({
      where: {
        username: username,
      },
    });
    if (admin) {
      res.json({
        message: "username exists",
        registered: false,
      });
    } else {
      try {
        admin = await Admin.findOne({
          where: {
            email: email,
          },
        });
        if (admin) {
          res.json({
            message: "email exists",
            registered: false,
          });
        } else {
          var pass = saltHashPassword(password);
          try {
            admin = await Admin.create({
              username: username,
              email: email,
              password: pass,
            });
            req.session.adminname = username;
            res.json({
              registered: true,
            });
          } catch (err) {
            console.log(err);
          }
        }
      } catch (err) {
        console.log(err);
      }
    }
  } catch (err) {
    console.log(err);
  }
});

function saltHashPassword(password) {
  var saltRounds = 10; //the cost of processing the data
  var salt = bcrypt.genSaltSync(saltRounds); //generate  a dynamic salt
  var hash = bcrypt.hashSync(password, salt); //generate hash of the plain text password and append it with the dynamic salt
  return hash;
}
module.exports = router;
