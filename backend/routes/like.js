const express = require("express");
const router = express.Router();
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
} = require("../models");
var redirectUserLogin = require("../middlewares/check").checkUserLogin;

router.post("/add", redirectUserLogin, async function (req, res) {
  var blogId = req.body.blogId;
  var profileId = req.body.profileId;
  try {
    var like = await Like.create({
      blogId: blogId,
      profileId: profileId,
    });
    if (like) {
      res.json({ success: true });
    } else {
      console.log("!error failed to add comment");
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/getLikes", async function (req, res) {
  var blogId = req.body.blogId;
  try {
    var likes = await Like.findAll({
      where: {
        blogId: blogId,
      },
    });
    res.json({ success:true, result: likes });
  } catch (err) {
    console.log(err);
  }
});

router.post("/liked", redirectUserLogin, async function (req, res) {
  var blogId = req.body.blogId;
  var authorId = req.body.authorId;
  try {
    var liked = Like.findOne({
      where: {
        blogId: blogId,
        profileId: authorId,
      },
    });
    if (liked) {
      res.json({ success: true, like: false });
    } else {
      try {
        var creator = blogs.findOne({
          where: {
            id: blogId,
          },
        });
        if (creator.authorId == authorId) {
          res.json({ success: true, like: false });
        } else {
          res.json({ success: true, like: true });
        }
      } catch (err) {
        console.log(err);
      }
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
