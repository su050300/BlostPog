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
  Embeddings,
  History,
} = require("../models");
var redirectUserLogin = require("../middlewares/check").checkUserLogin;
const { Op } = require("sequelize");
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
      if (req.session.username) {
        try {
          var user = await User.findOne({
            where: {
              id: req.session.userid,
            },
            include: [
              {
                as: "profile",
                model: Profile,
              },
            ],
          });
          if (user) {
            await History.create({
              blogId: blog.id,
              profileId: user.profile.id,
            });
          }
        } catch (err) {
          console.log(err);
        }
      }
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
          suggestions: [],
        };
        data.content.push(JSON.parse(blog.content));
        data.title.push(blog.title);
        data.slug.push(blog.slug);
        data.pubdate.push(blog.updatedAt);
        data.id.push(blog.id);
        data.author.push(blog.authorId);
        data.status.push(blog.status);
        data.message = "Success";
        var suggestions = await suggest(blog.authorId, blog.id);
        var tag = await getTags(blog.id);
        var category = await getCategory(blog.id);
        var like = await getLikes(blog.id);
        var comment = await getComments(blog.id);
        if (suggestions) {
          data.suggestions.push(suggestions);
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

router.post("/bytag", async function (req, res) {
  var id = req.body.id;
  try {
    var blog = await Tag.findAll({
      where: {
        id: id,
      },
      include: [
        {
          as: "blogs",
          model: BlogTag,
        },
      ],
    });
    if (blog) {
      var result = [];
      for (var i = 0; i < blog.length; i++) {
        try {
          var blg = await blogs.findOne({
            where: {
              id: blog[i].blogs[i].blogId,
            },
            include: [
              {
                as: "profile",
                model: Profile,
              },
            ],
          });
          if (blg) {
            result.push(blg);
          }
        } catch (err) {
          console.log(err);
        }
      }
      res.json({ success: true, result: result });
    } else {
      console.log("!error");
    }
  } catch (err) {
    console.log(err);
  }
});

router.get("/history", redirectUserLogin, async function (req, res) {
  var userid = req.session.userid;
  try {
    var user = await User.findOne({
      where: {
        id: userid,
      },
      include: [
        {
          as: "profile",
          model: Profile,
        },
      ],
    });
    if (user) {
      var hist = await History.findAll({
        where: {
          profileId: user.profile.id,
        },
      });
      var result = [];
      for (var i = 0; i < hist.length; i++) {
        var blog = await blogs.findOne({
          where: {
            id: hist[i].blogId,
          },
          include: [
            {
              as: "profile",
              model: Profile,
            },
          ],
        });
        if (blog) result.push(blog);
      }
      res.json({
        result: result,
        success: "true",
      });
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/myblog", redirectUserLogin, async function (req, res) {
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

router.get("/getCategories", redirectUserLogin, async function (req, res) {
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

router.get("/getTags", redirectUserLogin, async function (req, res) {
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

router.get("/all", async function (req, res) {
  try {
    var blog = await blogs.findAll({
      where: {
        status: true,
      },
      include: [
        {
          as: "profile",
          model: Profile,
        },
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

var suggest = async (authorid, blogid) => {
  try {
    var blogembed = await Embeddings.findOne({
      where: {
        blogId: blogid,
      },
    });
    var authorblogs = await blogs.findAll({
      where: {
        authorId: authorid,
        status: true,
        [Op.not]: [
          {
            id: [blogid],
          },
        ],
      },
      include: [
        {
          as: "embed",
          model: Embeddings,
        },
      ],
    });
    if (authorblogs) {
      var authororder = [];
      var exclude = [];
      authorblogs.forEach((element) => {
        exclude.push(element.id);
        var simscore = cosinesim(
          JSON.parse(blogembed.embedding),
          JSON.parse(element.embed.embedding)
        );
        authororder.push([simscore, element]);
      });
      authororder.sort(comp);
      exclude.push(blogid);
      var embeddings = await Embeddings.findAll({
        where: {
          [Op.not]: [
            {
              blogId: exclude,
            },
          ],
        },
        include: {
          as: "embedd",
          model: blogs,
        },
      });
      if (embeddings) {
        var blogorder = [];
        embeddings.forEach((element) => {
          var simscore = cosinesim(
            JSON.parse(blogembed.embedding),
            JSON.parse(element.embedding)
          );
          blogorder.push([simscore, element.embedd]);
        });
        blogorder.sort(comp);
        var finalorder = [];
        if (authororder.length > 0) {
          finalorder.push(authororder[0][1]);
        }
        var l = 1,
          r = 0;
        while (r < blogorder.length && l < authororder.length) {
          if (blogorder[r][0] > authororder[l][0]) {
            finalorder.push(blogorder[r][1]);
            r++;
          } else {
            finalorder.push(authororder[l][1]);
            l++;
          }
        }
        while (r < blogorder.length) {
          finalorder.push(blogorder[r][1]);
          r++;
        }
        while (l < authororder.length) {
          finalorder.push(authororder[l][1]);
          l++;
        }
        return finalorder;
      }
    }
  } catch (err) {
    console.log(err);
  }
};

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
