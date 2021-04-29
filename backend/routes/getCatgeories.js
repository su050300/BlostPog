const express = require("express");
const router = express.Router();
const { Category } = require("../models");

router.get("/", async function (req, res) {
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
module.exports = router;

