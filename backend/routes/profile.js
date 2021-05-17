var express = require("express");
var redirectUserLogin = require("../middlewares/check").checkUserLogin;
const router = express.Router();
const { User } = require("../models");
const { Profile } = require("../models");

router.post("/id", redirectUserLogin, async function (req, res) {
  var userId = req.body.id;
  try {
    var user = await User.findOne({
      where: {
        id: userId,
      },
      include: [
        {
          model: Profile,
          as: "profile",
        },
      ],
    });
    res.json({ profile: user, success: true });
  } catch (err) {
    console.log(err);
  }
});

router.post("/profid", async function (req, res) {
  var id = req.body.id;
  try {
    var profile = await Profile.findOne({
      where: {
        id: id,
      },
      include: [
        {
          model: User,
          as: "user",
        },
      ],
    });
    res.json({ profile: profile, success: true });
  } catch (err) {
    console.log(err);
  }
});

router.post("/", redirectUserLogin, async function (req, res) {
  var first_name = req.body.first_name;
  var last_name = req.body.last_name;
  var bio = req.body.bio;
  var avatar = req.body.avatar;
  try {
    var user = await User.findOne({
      where: {
        id: req.session.userid,
      },
      include: [
        {
          as: "profile",
          model: Profile,
        },
      ],
    });
    if (user) {
      var profile = await Profile.update(
        {
          first_name: first_name,
          last_name: last_name,
          bio: bio,
          avatar: avatar,
        },
        {
          where: {
            id: user.profile.id,
          },
        }
      );
      res.json({ success: true });
    } else {
      console.log("!error");
    }
  } catch (err) {
    console.log(err);
  }
});
module.exports = router;
