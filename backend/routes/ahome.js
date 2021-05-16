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
  Embeddings,
} = require("../models");
require("@tensorflow/tfjs");
// to run model faster using gpu and cpu
require("@tensorflow/tfjs-node");
// require("@tensorflow/tfjs-node-gpu");
const use = require("@tensorflow-models/universal-sentence-encoder");
var redirectAdminLogin = require("../middlewares/check").checkAdminLogin;

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
  subject: "Blog Published",
  text: "Your blog has been published.",
};

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

router.get("/allTag", redirectAdminLogin, async function (req, res) {
  try {
    var tags = await Tag.findAll({
      include: [
        {
          as: "blogs",
          model: BlogTag,
        },
      ],
    });
    if (tags) {
      var result = [];
      var count = [];
      tags.forEach((element) => {
        count.push(element.blogs.length);
        var obj = {};
        obj[element.id] = element.tag;
        result.push(obj);
      });
      res.json({
        count: count,
        tags: result,
      });
    } else {
      res.json({ message: "error fetching tags" });
    }
  } catch (err) {
    console.log(err);
  }
});

router.get("/allCategories", redirectAdminLogin, async function (req, res) {
  try {
    var categories = await Category.findAll({
      include: [
        {
          as: "blogs",
          model: BlogCategory,
        },
      ],
    });
    var result = [];
    var count = [];
    categories.forEach((element) => {
      count.push(element.blogs.length);
      var obj = {};
      obj[element.id] = element.category;
      result.push(obj);
    });
    res.json({
      count: count,
      categories: result,
    });
  } catch (err) {
    console.log(err);
  }
});

router.post("/addTag", redirectAdminLogin, async function (req, res) {
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

router.post("/addCategory", redirectAdminLogin, async function (req, res) {
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

router.post("/deleteCategory", redirectAdminLogin, async function (req, res) {
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

router.post("/deleteTag", redirectAdminLogin, async function (req, res) {
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

router.get("/pendingblogs", redirectAdminLogin, async function (req, res) {
  try {
    var blog = await blogs.findAll({
      where: {
        status: false,
      },
      include: {
        as: "profile",
        model: Profile,
      },
      order: [["updatedAt", "ASC"]],
    });
    if (blog) {
      res.json({ blogs: blog });
    } else {
      res.json({ message: "error in fetching pending blogs" });
    }
  } catch (err) {
    console.log(err);
  }
});

router.get("/acceptedblogs", redirectAdminLogin, async function (req, res) {
  try {
    var blog = await blogs.findAll({
      where: {
        status: true,
      },
      include: {
        as: "profile",
        model: Profile,
      },
      order: [["updatedAt", "DESC"]],
    });
    if (blog) {
      res.json({ blogs: blog });
    } else {
      res.json({ message: "error in fetching pending blogs" });
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/getblog", redirectAdminLogin, async function (req, res) {
  var slug = req.body.slug;
  try {
    var blog = await blogs.findOne({
      where: {
        slug: slug,
      },
    });
    if (blog) {
      try {
        var data = {
          content: [],
          id: [],
          category: [],
          tag: [],
          title: [],
          slug: [],
          pubdate: [],
          author: [],
          status: [],
        };
        data.content.push(JSON.parse(blog.content));
        data.title.push(blog.title);
        data.slug.push(blog.slug);
        data.pubdate.push(blog.updatedAt);
        data.id.push(blog.id);
        data.author.push(blog.authorId);
        data.status.push(blog.status);
        data.message = "Success";
        var tag = await getTags(blog.id);
        var category = await getCategory(blog.id);
        if (category) {
          data.category.push(category);
          if (tag) {
            data.tag.push(tag);
            res.json({ data: data, success: true });
          }
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      res.json({ success: false, message: "blog not found" });
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/query", redirectAdminLogin, async function (req, res) {
  var content = req.body.content;
  var authorId = req.body.authorId;
  var blogId = req.body.blogId;
  try {
    var query = await Query.create({
      comment: content,
      sender: "admin",
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
});

router.post("/getquery", redirectAdminLogin, async function (req, res) {
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

router.post("/delquery", redirectAdminLogin, async function (req, res) {
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

router.post("/saveblog", redirectAdminLogin, async function (req, res) {
  var id = req.body.id;
  var content = JSON.stringify(req.body.data);
  try {
    var blog = await blogs.update(
      {
        content: content,
      },
      {
        where: {
          id: id,
        },
      }
    );
    if (blog) {
      res.json({ message: "success" });
    } else {
      console.log("error");
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/publishblog", redirectAdminLogin, async function (req, res) {
  var id = req.body.id;
  var profileId = req.body.author;
  var model = await use.load();
  try {
    var blog = await blogs.update(
      {
        status: true,
      },
      {
        where: {
          id: id,
        },
      }
    );
    var vec = await model.embed([blog.title]);
    if (vec) {
      Embeddings.create({
        blogId: id,
        embedding: vec.arraySync(),
      });
    }
    if (blog) {
      try {
        blog = await blogs.findOne({
          where: { id: id },
        });
        if (blog) {
          try {
            var profile = await Profile.findOne({
              where: {
                id: profileId,
              },
              include: [
                {
                  as: "user",
                  model: User,
                },
              ],
            });
            if (profile) {
              message.to = profile.user.email;
              var url = `http://localhost:3000/blog/${blog.slug}`;
              message.html = `Click this url to visit your blog:<a href="${url}">${url}</a>`;
              transporter.sendMail(message, (err, info) => {
                if (err) {
                  console.log("Error occurred. " + err.message);
                }
              });
              res.json({ message: "success" });
            } else {
              console.log("!error user do not exist with this profile id");
            }
          } catch (err) {
            console.log(err);
          }
        } else {
          console.log("!error no blog with this id");
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      console.log("error");
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

module.exports = router;
