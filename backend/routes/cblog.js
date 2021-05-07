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
} = require("../models");
const slugify = require("./slug");
const { uuid } = require("uuidv4");
router.get("/", async function (req, res) {
  var userId = req.session.userid;
  try {
    var user = await User.findOne({
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
    if (user) authorId = user.profile.id;
    else res.json({ message: "user do not exist" });
    try {
      var blog = await blogs.findAll({
        where: {
          authorId: authorId,
        },
        order: [["updatedAt", "DESC"]],
      });
      var data = {
        content: [],
        categories: [],
        tags: [],
        message: "",
        title: [],
        slug: [],
        pubdate: [],
      };
      for (var i = 0; i < blog.length; i++) {
        var element = blog[i];
        data.content.push(JSON.parse(element.content));
        data.title.push(element.title);
        data.slug.push(element.slug);
        data.pubdate.push(element.updatedAt);
        data.message = "Success";
        var tag = await getTags(element.id);
        var category = await getCategory(element.id);
        if (tag) {
          data.tags.push(tag);
        }
        if (category) {
          data.categories.push(category);
        }
      }
      res.json({data:data});
    } catch (err) {
      console.log(err);
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/", async function (req, res) {
  var content = JSON.stringify(req.body.data);
  console.log(content.length);
  var tags = req.body.tags;
  var categories = req.body.categories;
  var title = req.body.title;
  var userId = req.session.userid;
  var tagMap = await getTagId();
  var categoryMap = await getCategoryId();
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
      var tagId = [];
      var categoryId = [];
      tags.forEach((tag) => {
        tagId.push(tagMap[tag]);
      });
      categories.forEach(async (category) => {
        categoryId.push(categoryMap[category]);
      });
      try {
        var slug = slugify(title + " " + uuid());
        var blog = await blogs.create({
          title: title,
          content: content,
          authorId: profileId,
          slug: slug,
        });
        try {
          var blogid = await blogs.findOne({
            where: {
              slug: slug,
            },
          });
          var blogid = blogid.id;
          tagId.forEach(async (tagid) => {
            try {
              await BlogTag.create({
                blogId: blogid,
                tagId: tagid,
              });
            } catch (err) {
              console.log(err);
            }
          });
          categoryId.forEach(async (categoryid) => {
            try {
              await BlogCategory.create({
                blogId: blogid,
                categoryId: categoryid,
              });
            } catch (err) {
              console.log(err);
            }
          });
          res.json({
            message: "success",
          });
        } catch (err) {
          console.log(err);
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      res.json({ message: "user not found" });
    }
  } catch (err) {
    console.log(err);
  }
});

var getTags = async (id) => {
  try {
    var result = [];
    var tag = await BlogTag.findAll({
      where: {
        blogId: id,
      },
      attributes: ["tagId"],
      include: [
        {
          as: "tag",
          model: Tag,
        },
      ],
    });
    tag.forEach((element) => {
      result.push(element.tag.tag);
    });
    return result;
  } catch (err) {
    console.log(err);
  }
};

var getCategory = async (id) => {
  try {
    var result = [];
    var category = await BlogCategory.findAll({
      where: {
        blogId: id,
      },
      attributes: ["categoryId"],
      include: [
        {
          as: "category",
          model: Category,
        },
      ],
    });
    category.forEach((element) => {
      result.push(element.category.category);
    });
    return result;
  } catch (err) {
    console.log(err);
  }
};



var getTagId = async () => {
  try {
    var tags = await Tag.findAll();
    var tagMap = new Map();
    tags.forEach((tag) => {
      tagMap[tag.tag] = tag.id;
    });
    return tagMap;
  } catch (err) {
    console.log(err);
  }
};


var getCategoryId = async () => {
  try {
    var categories = await Category.findAll();
    var categoryMap = new Map();
    categories.forEach((category) => {
      categoryMap[category.category] = category.id;
    });
    return categoryMap;
  } catch (err) {
    console.log(err);
  }
};

module.exports = router;
