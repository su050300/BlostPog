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
const slugify = require("./slug");
const { uuid } = require("uuidv4");

const jwt = require("jsonwebtoken");

const nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  port: process.env.EMAIL_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});
var message = {
  from: process.env.EMAIL_USERNAME,
  subject: "Blog under review",
  text:
    "Your blog status is pending.it will get accepted once admin verifies it.",
};

router.get("/",redirectUserLogin, async function (req, res) {
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
          status: true,
        },
        order: [["updatedAt", "DESC"]],
      });
      var data = {
        content: [],
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
      }
      res.json({ data: data });
    } catch (err) {
      console.log(err);
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/",redirectUserLogin, async function (req, res) {
  var content = JSON.stringify(req.body.data);
  var tags = req.body.tags;
  var categories = req.body.categories;
  var title = req.body.title;
  var userId = req.session.userid;
  var tagMap = await getTagId();
  var categoryMap = await getCategoryId();
  var status = false;
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
    var email = profileId.email;
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
          status: status,
        });
        if (blog) {
          message.to = email;
          transporter.sendMail(message, (err, info) => {
            if (err) {
              console.log("Error occurred. " + err.message);
            }
            console.log("mail sended");
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
        } else {
          console.log("error");
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
