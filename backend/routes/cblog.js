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
// router.get('/',async function(req,res){
//     var userId = req.session.userid;
//     try{
//         var user = await User.findOne({
//             where:{
//                 id:userId,
//             },include:[
//                 {
//                     as:'profile',
//                     model:Profile,
//                 }
//             ]
//         })
//         authorId = user.profile.id;
//         try
//         {
//             var blog = await blogs.findAll({
//                 where:{
//                     authorId:authorId,
//                 },
//             })
//             var result = [];
//             var tags = [];
//             blog.forEach(element => {
//                 result.push(JSON.parse(element.content));
//                 tags.push(element.tags);
//             });
//             res.json({
//                 blogs:result,
//                 tags:tags,
//             });
//         }catch(err){
//             console.log(err);
//         }
//     }catch(err){
//         console.log(err);
//     }

// })
router.post("/", async function (req, res) {
  var content = JSON.stringify(req.body.data);
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
            message:"success",
          })
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
