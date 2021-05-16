const express = require("express");
const router = express.Router();
require("@tensorflow/tfjs");
// to run model faster using gpu and cpu
require("@tensorflow/tfjs-node");
// require("@tensorflow/tfjs-node-gpu");
const use = require("@tensorflow-models/universal-sentence-encoder");
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
  Embeddings,
} = require("../models");
const { initializers } = require("@tensorflow/tfjs");
const { Op } = require("sequelize");
// title searc
router.post("/title", async function (req, res) {
  var text = req.body.text;
  var model = await use.load();
  var textvec = await model.embed([text]);
  try {
    var blog = await Embeddings.findAll({
      include: [
        {
          as: "embedd",
          model: blogs,
        },
      ],
    });
    var result = [];
    for (var i = 0; i < blog.length; i++) {
      var title = JSON.parse(blog[i].embedding);
      if (textvec) {
        var similarity = cosinesim(title, textvec.arraySync());
        result.push([similarity, blog[i].embedd.slug, blog[i].embedd.title]);
      }
    }

    if (result) {
      result.sort(comp);
      if (result.length > 10) {
        result = result.slice(0, 11);
      }
      res.json({ results: result });
    }
  } catch (err) {
    console.log(err);
  }
});

// tag search
router.post("/tag", async function (req, res) {
  var text = req.body.text;
  try {
    var tags = await Tag.findAll({
      where: {
        tag: {
          [Op.like]: "%" + text + "%",
        },
      },
    });
    if (tags.length > 10) {
      tags = tags.slice(0, 11);
    }
    if (tags) {
      res.json({ tags: tags });
    } else {
      res.json({ empty: true });
    }
  } catch (err) {
    console.log(err);
  }
});

var comp = (a, b) => {
  return a[0] < b[0];
};

var cosinesim = (arr1, arr2) => {
  (arr1 = arr1[0]), (arr2 = arr2[0]);
  var dotproduct = 0;
  var res1 = 0;
  var res2 = 0;
  for (i = 0; i < arr1.length; i++) {
    dotproduct += arr1[i] * arr2[i];
    res1 += arr1[i] * arr1[i];
    res2 += arr2[i] * arr2[i];
  }
  res1 = Math.sqrt(res1);
  res2 = Math.sqrt(res2);
  var similarity = dotproduct / (res1 * res2);
  return similarity;
};
module.exports = router;
