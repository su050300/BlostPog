const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const {
  User,
  blogs,
  Profile,
  Tag,
  Category,
  BlogTag,
  BlogCategory,
  Like,
  Comment,
  Query,
} = require("../models");
var redirectUserLogin = require("../middlewares/check").checkUserLogin;

router.post("/query",redirectUserLogin, async function (req, res) {
  var content = req.body.content;
  var authorId = req.body.authorId;
  var blogId = req.body.blogId;
  try {
    var profile = await Profile.findOne({
      where: { id: authorId },
      include: [
        {
          as: "user",
          model: User,
        },
      ],
    });
    if (profile) {
      try {
        var query = await Query.create({
          comment: content,
          sender: profile.user.username,
          blogId: blogId,
          profileId: authorId,
        });
        if (query) {
          res.json({ success: true });
        } else {
          res.json({ succes: false, message: "failed to add comments" });
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      console.log("!error user does not exist");
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/getquery",redirectUserLogin, async function (req, res) {
  var authorId = req.body.authorId;
  var blogId = req.body.blogId;
  try {
    var query = await Query.findAll({
      where: {
        blogId: blogId,
        profileId: authorId,
      },
      order: [["updatedAt", "ASC"]],
    });
    if (query) {
      res.json({ success: true, result: query });
    } else {
      res.json({ success: false, message: "failed to load comments" });
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/delquery",redirectUserLogin, async function (req, res) {
  var id = req.body.id;
  try {
    var query = await Query.destroy({
      where: {
        id: id,
      },
    });
    res.json({ message: "success" });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
