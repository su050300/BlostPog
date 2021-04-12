var express = require("express");
const router = express.Router();
const User = require("../models/User");
const Profile = require("../models/Profile");

router.get("/", async function (req, res) {
  var userId = req.session.userid;
  var profile = await Profile.findOne({
    where: {
      userId: userId,
    },
  });
  var user = await User.findOne({
    where: {
      id: userId,
    },
  });
  var message = {
    username: user.username,
    email: user.email,
    first_name: profile.first_name,
    last_name: profile.last_name,
    bio: profile.bio,
    avatar: profile.avatar,
    followers: 0,
  };
  res.json({ profile: message });
});
module.exports = router;
