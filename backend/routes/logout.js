var express = require("express");
var router = express.Router();

router.get("/", function (req, res) {
  req.session.username = null;
  req.session.userid = null;
  res.json({ message: "logged out successfully" });
});
module.exports = router;
