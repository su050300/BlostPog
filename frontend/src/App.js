/* eslint-disable */
import React, { Component } from "react";
import home from "./components/home";
import register from "./components/register";
import forgetPassword from "./components/forgetPassword";
import resetPassword from "./components/resetPassword";
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
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
