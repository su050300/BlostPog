const express = require("express");
const router = express.Router();
const {User} = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  port: process.env.EMAIL_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});
var message = {
  from: process.env.EMAIL_USERNAME,
  subject: "Verify your mail",
  text: "verify your mail to login",
};
router.post("/", async function (req, res) {
  const username = req.body.user["username"];
  const email = req.body.user["email"];
  const password = req.body.user["password"];
  const isVerified = false;
  try {
    var user = await User.findOne({
      where: {
        username: username,
      },
    });
    if (user) {
      res.json({
        message: "username exists",
        registered: false,
      });
    } else {
      try {
        user = await User.findOne({
          where: {
            email: email,
          },
        });
        if (user) {
          res.json({
            message: "email exists",
            registered: false,
          });
        } else {
          var pass = saltHashPassword(password);
          try {
            user = await User.create({
              username: username,
              email: email,
              password: pass,
              isVerified: isVerified,
            });
            res.json({
              message: "mail sended successfully",
              registered: true,
            });
            const userId = user.id;
            message.to = user.email;
            jwt.sign(
              {
                userId: userId,
              },
              process.env.EMAIL_SECRET,
              {
                expiresIn: "1d",
              },
              (err, emailToken) => {
                var url = `http://localhost:9000/verify/${emailToken}`;
                message.html = `Click this url to confirm your email id:<a href="${url}">${url}</a>`;
                transporter.sendMail(message, (err, info) => {
                  if (err) {
                    console.log("Error occurred. " + err.message);
                  }
                });
              }
            );
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
