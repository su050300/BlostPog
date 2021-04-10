var express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require("../models/User");
const Profile = require("../models/Profile");

router.get("/", async function (req, res) {
    var token = req.baseUrl.split("/");
    token = token[2];
    var result = jwt.verify(token, process.env.EMAIL_SECRET);
    const userId = result.userId;
    await User.update({
        isVerified: true
    }, {
        where: {
            id: userId
        }
    });
    await Profile.create({
        userId:userId,
        avatar:'https://firebasestorage.googleapis.com/v0/b/blostpog.appspot.com/o/image%2Fdefault.png?alt=media&token=2ab563d9-f8f1-4619-ab63-af66ee54ce20',
    })
    res.redirect('http://localhost:3000');
})
module.exports = router;
