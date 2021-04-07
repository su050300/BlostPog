var express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcrypt");


router.get("/", async function (req, res) {
  var token = req.baseUrl.split("/");
  token = token[2];
  var result = jwt.verify(token, process.env.EMAIL_SECRET);
  const userId = result.userId;
  res.redirect(`http://localhost:3000/resetpass/${userId}`);
});
router.post("/", function (req, res) {
  const id = req.body.id;
  const password = saltHashPassword(req.body.password);
  var user = User.update({
      password:password,
  },{
      where:{
          id:id,
      }
  })
  res.json({
      success:true,
  });
});
function saltHashPassword(password) {
  var saltRounds = 10; //the cost of processing the data
  var salt = bcrypt.genSaltSync(saltRounds); //generate  a dynamic salt
  var hash = bcrypt.hashSync(password, salt); //generate hash of the plain text password and append it with the dynamic salt
  return hash;
}
module.exports = router;
