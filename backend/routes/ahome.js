const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { Tag, Category } = require("../models");

router.get("/", function (req, res) {
  if (req.session.adminname) {
    res.send({
      loggedIn: true,
      adminname: req.session.adminname,
    });
  } else {
    res.send({
      loggedIn: false,
    });
  }
});

router.post("/addTag", async function (req, res) {
  var tag_word = req.body.tag;
  try {
    var tag = await Tag.findOne({
      where: {
        tag: tag_word,
      },
    });
    if (tag) {
      res.json({
        message: "Tag already exists",
        success: false,
      });
    } else {
      try {
        tag = await Tag.create({
          tag: tag_word,
        });
        res.json({
          message: "Tag added successfully",
          success: true,
        });
      } catch (err) {
        console.log(err);
      }
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/addCategory", async function (req, res) {
  var category_word = req.body.category;
  console.log(category_word);
  try {
    var category = await Category.findOne({
      where: {
        category: category_word,
      },
    });
    if (category) {
      res.json({
        message: "Category already exists",
        success: false,
      });
    } else {
      try {
        category = await Category.create({
          category: category_word,
        });
        res.json({
          message: "Category added successfully",
          success: true,
        });
      } catch (err) {
        console.log(err);
      }
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
