var express = require("express");
const router = express.Router();
const {User} = require("../models");
const {Profile} = require("../models");

router.get("/", async function (req, res) {
  var userId = req.session.userid;
  var user = await User.findOne({
    where: {
      id: userId,
    },
    include:[{
      model:Profile,
      as:'profile',
    }]
  });
  // res.json({ profile: message });
});
module.exports = router;
