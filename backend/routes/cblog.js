const express = require("express");
const router = express.Router();
const { User, blogs, Profile } = require("../models");

router.get('/',async function(req,res){
    var userId = req.session.userid;
    try{
        var user = await User.findOne({
            where:{
                id:userId,
            },include:[
                {
                    as:'profile',
                    model:Profile,
                }
            ]
        })
        authorId = user.profile.id;
        try
        {
            var blog = await blogs.findAll({
                where:{
                    authorId:authorId,
                },
            })
            var result = [];
            var tags = [];
            blog.forEach(element => {
                result.push(JSON.parse(element.content));
                tags.push(element.tags);
            });
            res.json({
                blogs:result,
                tags:tags,
            });
        }catch(err){
            console.log(err);
        }
    }catch(err){
        console.log(err);
    }
    
})
router.post("/", async function (req, res) {
  var content = req.body.content;
  var tags = req.body.tags;
  var userId = req.session.userid;
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
    try {
      var blog = await blogs.create({
          content: content,
          tags: tags,
          authorId: profileId.profile.id,
      });
    } catch (err) {
      console.log(err);
    }
    res.json({
        message:'created',
    })
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
