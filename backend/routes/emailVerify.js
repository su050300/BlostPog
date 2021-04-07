var express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require("../models/User");

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
    res.redirect('http://localhost:3000');
})
module.exports = router;
