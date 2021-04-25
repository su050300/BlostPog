/* eslint-disable */
import React, { Component } from "react";
import home from "./components/home";
import register from "./components/register";
import forgetPassword from "./components/forgetPassword";
import resetPassword from "./components/resetPassword";
import profile from "./components/profile";
import editor from "./components/editor";
import blogs from "./components/blogs";
import admin from "./components/admin";
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
            <Route exact path="/profile" component={profile} />
            <Route exact path="/editor" component={editor} />
            <Route exact path="/myblogs" component={blogs} />
            <Route exact path="/admin" component={admin} />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
