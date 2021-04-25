const express = require("express");
const router = express.Router();

router.get("/", function (req, res) {
  req.session.adminname = null;
  res.json({ message: "logged out successfully" });
});
module.exports = router;
