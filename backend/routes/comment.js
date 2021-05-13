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
  var comment = req.body.content;
  var blogId = req.body.blogId;
  var profileId = req.body.authorId;
  try {
    var comment = await Comment.create({
      comment: comment,
      blogId: blogId,
      profileId: profileId,
    });
    if (comment) {
      res.json({ success: true });
    } else {
      console.log("!error failed to add comment");
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/delete", redirectUserLogin, async function (req, res) {
  var id = req.body.id;
  try {
    await Comment.destroy({
      where: {
        id: id,
      },
    });
    res.json({ success: true });
  } catch (err) {
    console.log(err);
  }
});

router.post("/getComments", redirectUserLogin, async function (req, res) {
  var blogId = req.body.blogId;
  try {
    var comments = await Comment.findAll({
      where: {
        blogId: blogId,
      },
      include:[{
        as:'profileComment',
        model:Profile,
      }]
    });
    res.json({ success:true, result: comments });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
