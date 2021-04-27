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

router.get("/allTag", async function (req, res) {
  try {
    var tags = await Tag.findAll();
    var result = [];
    tags.forEach((element) => {
      var obj = {};
      obj[element.id] = element.tag;
      result.push(obj);
    });
    res.json({
      tags: result,
    });
  } catch (err) {
    console.log(err);
  }
});

router.get("/allCategories", async function (req, res) {
  try {
    var categories = await Category.findAll();
    var result = [];
    categories.forEach((element) => {
      var obj = {};
      obj[element.id] = element.category;
      result.push(obj);
    });
    res.json({
      categories: result,
    });
  } catch (err) {
    console.log(err);
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

router.post("/deleteCategory", async function (req, res) {
  var category_id = req.body.categoryId;
  try {
    var category = Category.destroy({
      where: {
        id: category_id,
      },
    });
    res.json({ message: "successfully deleted" });
  } catch (err) {
    console.log(err);
  }
});

router.post("/deleteTag", async function (req, res) {
  var tag_id = req.body.tagId;
  try {
    var tag = Tag.destroy({
      where: {
        id: tag_id,
      },
    });
    res.json({ message: "successfully deleted" });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
