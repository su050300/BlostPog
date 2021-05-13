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
router.post("/", async function (req, res) {
  var slug = req.body.slug;
  try {
    var blog = await blogs.findOne({
      where: {
        slug: slug,
        status: true,
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
          likes: [],
          comments: [],
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
        var like = await getLikes(blog.id);
        var comment = await getComments(blog.id);
        if (category) {
          data.category.push(category);
          if (tag) {
            data.tag.push(tag);
            if (like) {
              data.likes.push(like);
              if (comment) {
                data.comments.push(comment);
                res.json({ data: data, success: true });
              }
            }
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

router.get("/all", async function (req, res) {
  try {
    var blog = await blogs.findAll({
      where: {
        status: true,
      },
      include:[
        {
          as:'profile',
          model:Profile,
        }
      ],
      order: [["updatedAt", "DESC"]],
    });
    res.json({
      blogs: blog,
    });
  } catch (err) {
    console.log(err);
  }
});

var getLikes = async (id) => {
  try {
    var result = [];
    var likes = await Like.findAll({
      where: {
        blogId: id,
      },
      attributes: ["profileId"],
    });
    likes.forEach((element) => {
      result.push(element.profileId);
    });
    return result;
  } catch (err) {
    console.log(err);
  }
};

var getComments = async (id) => {
  try {
    var result = [];
    var comments = await Comment.findAll({
      where: {
        blogId: id,
      },
      attributes: ["profileId"],
    });
    comments.forEach((element) => {
      result.push(element.profileId);
    });
    return result;
  } catch (err) {
    console.log(err);
  }
};

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
