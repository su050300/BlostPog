var express = require("express");
var router = express.Router();
var jwt = require('jsonwebtoken');
const User = require("../models/User");

router.get("/", async function (req, res) {
    var token = req.baseUrl.split("/");
    token = token[2];
    var result = jwt.verify(token, process.env.EMAIL_SECRET);
    userId = result.userId;
    User.update({
        isVerified: true
    }, {
        where: {
            id: userId
        }
    });
    res.redirect('http://localhost:3000');
})
module.exports = router;
