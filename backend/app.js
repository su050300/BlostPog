var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var session = require("express-session");
var logger = require("morgan");
var cors = require("cors");
require("dotenv").config();
var indexRouter = require("./routes/index");
var registerRouter = require("./routes/register");
var loginRouter = require("./routes/login");
var logoutRouter = require("./routes/logout");
var emailVerifyRouter = require("./routes/emailVerify");
var resetPassRouter = require("./routes/resetpass");
var forgetPassRouter = require("./routes/forgetpass");
var changePassRouter = require("./routes/resetpass");
var profileRouter = require("./routes/profile");
var createBolgRouter = require("./routes/cblog");
var ahomeRouter = require("./routes/ahome");
var alogoutRouter = require("./routes/alogout");
var aregisterRouter = require("./routes/aregister");
var aloginRouter = require("./routes/alogin");
var getTagRouter = require("./routes/getTags");
var getCategoryRouter = require("./routes/getCatgeories");
var uploadImageRouter = require("./routes/uploadImage");
var getBlogRouter = require("./routes/blog");
var getQueryRouter = require("./routes/query");
var getCommentRouter = require("./routes/comment");
var getLikeRouter = require("./routes/like");
var getSearchRouter = require("./routes/search");
var { sequelize } = require("./models");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    name: "user",
    resave: false,
    saveUninitialized: false,
    secret: "secret",
    cookie: {
      maxAge: 200000000,
      sameSite: true,
    },
  })
);

app.use("/", indexRouter);
app.use("/login", loginRouter);
app.use("/register", registerRouter);
app.use("/logout", logoutRouter);
app.use("/verify/:token", emailVerifyRouter);
app.use("/reset/:token", resetPassRouter);
app.use("/reset", forgetPassRouter);
app.use("/changepass", changePassRouter);
app.use("/profile", profileRouter);
app.use("/save/blogs", createBolgRouter);
app.use("/save/image", uploadImageRouter);
app.use("/getblog", getBlogRouter);
app.use("/user", getQueryRouter);
app.use("/comment", getCommentRouter);
app.use("/like", getLikeRouter);
app.use("/search", getSearchRouter);

app.use("/admin", ahomeRouter);
app.use("/admin/getTags", getTagRouter);
app.use("/admin/getCategories", getCategoryRouter);
app.use("/admin/register", aregisterRouter);
app.use("/admin/login", aloginRouter);
app.use("/admin/logout", alogoutRouter);

async function init() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}
init();

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
