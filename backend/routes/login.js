var express = require("express");
var router = express.Router();
var conn = require("./db.js");
var bcrypt = require("bcrypt");

router.get("/", function (req, res) {
  if (req.session.username) {
    res.send({ loggedIn: true, username: req.session.username });
  } else {
    res.send({ loggedIn: false });
  }
});

router.post("/", function (req, res, next) {
  const username = req.body.user["username"];
  const password = req.body.user["password"];
  conn.query(
    "SELECT * from User WHERE username = ?",
    [username],
    function (err, rows, fields) {
      if (err) throw err;
      if (rows.length > 0) {
        const check = bcrypt.compareSync(password, rows[0]["password"]);
        if (check) {
          req.session.username = username;
          req.session.userid = rows[0]["id"];
          res.send({ message: "login successfully", loggedIn: true });
        } else {
          res.send({
            message: "username and password do not match",
            loggedIn: true,
          });
        }
      } else {
        res.send({ message: "username do not exist", loggedIn: true });
      }
    }
  );
});
module.exports = router;
