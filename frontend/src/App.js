/* eslint-disable */
import React, { Component } from "react";
import home from "./components/home";
import register from "./components/register";
import forgetPassword from "./components/forgetPassword";
import resetPassword from "./components/resetPassword";
import profile from "./components/profile";
import editor from "./components/editor";
import admin from "./components/admin";
import blog from "./components/blog";
import blogAdmin from "./components/blogadmin";
import blogUser from "./components/bloguser";
import blogTag from "./components/blogtag";
import history from "./components/history";
import { BrowserRouter, Route, Switch, Link } from "react-router-dom";

class App extends Component {
  render() {
    return (
      <div>
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={home} />
            <Route exact path="/register" component={register} />
            <Route exact path="/forgetpassword" component={forgetPassword} />
            <Route exact path="/resetpass/:id" component={resetPassword} />
            <Route exact path="/profile/:id" component={profile} />
            <Route exact path="/editor" component={editor} />
            <Route exact path="/admin" component={admin} />
            <Route exact path="/blog/:slug" component={blog} />
            <Route exact path="/admin/:slug" component={blogAdmin} />
            <Route exact path="/myblog/:slug" component={blogUser} />
            <Route exact path="/tag/:id" component={blogTag} />
            <Route exact path="/history" component={history} />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
