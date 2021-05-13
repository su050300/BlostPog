const express = require("express");
const router = express.Router();
const { User, Profile, Images } = require("../models");
var redirectUserLogin = require("../middlewares/check").checkUserLogin;
router.post("/", redirectUserLogin, async function (req, res) {
  var link = req.body.url;
  var userId = req.session.userid;
  try {
    var profileId = await User.findOne({
      where: {
        id: userId,
      },
      include: [
        {
          as: "profile",
          model: Profile,
        },
      ],
    });
    if (profileId) {
      profileId = profileId.profile.id;
      try {
        var image = await Images.create({
          url: link,
          profileId: profileId,
        });
        res.json({ message: "success" });
      } catch (err) {
        console.log(err);
      }
    } else {
      res.json({ message: "no user exists" });
    }
  } catch (err) {
    console.log(err);
  }
});

router.get("/", redirectUserLogin, async function (req, res) {
  var userId = req.session.userid;
  try {
    var profileId = await User.findOne({
      where: {
        id: userId,
      },
      include: [
        {
          as: "profile",
          model: Profile,
        },
      ],
    });
    if (profileId) {
      profileId = profileId.profile.id;
      try {
        var allimages = await Images.findAll({
          where: {
            profileId: profileId,
          },
          order: [["updatedAt", "DESC"]],
        });
        res.json({ result: allimages });
      } catch (err) {
        console.log(err);
      }
    } else {
      res.json({
        message: "no user exists",
      });
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
