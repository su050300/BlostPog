var express = require("express");
var router = express.Router();
var conn = require("./db.js");
var bcrypt = require("bcrypt");

router.post("/", function (req, res) {
  const name = req.body.user['name'];
  const username = req.body.user['username'];
  const email = req.body.user['email'];
  const password = req.body.user['password'];
  conn.query(
    "SELECT * from User WHERE username = ?",
    [username],
    function (err, rows, fields) {
      if (err){
          throw err;
      } 
      if (rows.length > 0) {
        res.send({ message: "username exists" });
      } else {
        conn.query(
          "SELECT * from User where email = ?",
          [email],
          function (err, rows, fields) {
            if (rows.length > 0) {
              res.send({ messgae: "email exists" });
            } else {
              var pass = saltHashPassword(password);
              conn.query(
                "INSERT into User (username,name,email,password) VALUES (?,?,?,?)",
                [username, name, email, pass],
                function (err, rows, fields) {
                  if (err) throw err;
                  res.send({message:'registered successfully'});
                }
              );
            }
          }
        );
      }
    }
  );
});
function saltHashPassword(password) {
  var saltRounds = 10; //the cost of processing the data
  var salt = bcrypt.genSaltSync(saltRounds); //generate  a dynamic salt
  var hash = bcrypt.hashSync(password, salt); //generate hash of the plain text password and append it with the dynamic salt
  return hash;
}
module.exports = router;
