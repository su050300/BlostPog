const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require('jsonwebtoken');

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
    },
});

const message = {
    from: process.env.EMAIL_USERNAME,
    subject: "Reset your password",
};
router.post("/", async function (req, res) {
    const email = req.body.email;
    var user = await User.findOne({
        where: {
            email: email
        }
    });
    if (user) {
        const userId = user.id;
        message.to = user.email;
        res.json({
            message: "email send",
            isPresent: true,
        });
        jwt.sign({
                userId: userId,
            },
            process.env.EMAIL_SECRET, {
                expiresIn: '1d',
            },
            (err, emailToken) => {
                var url = `http://localhost:9000/reset/${emailToken}`;
                message.html = `Click this url to reset your password:<a href="${url}">${url}</a>`;
                transporter.sendMail(message, (err, info) => {
                    if (err) {
                        console.log("Error occurred. " + err.message);
                    }
                });
            }
        )
    } else {
        res.json({
            message: "email does not exist",
            isPresent: false,
        });
    }
});
module.exports = router;