const express = require("express");
const router = express.Router();
const { Tag } = require("../models");

router.get("/", async function (req, res) {
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
module.exports = router;

