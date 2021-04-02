/* eslint-disable */
import React, { Component } from "react";
import home from "./components/home";
import { BrowserRouter, Route, Switch, Link } from "react-router-dom";

class App extends Component {
  render() {
    return (
      <div>
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={home} />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
