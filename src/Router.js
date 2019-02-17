import React, { Component } from 'react';
import { Route, Switch, BrowserRouter } from "react-router-dom";

// pages
import Home from "./pages/Home";

class Router extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/" component={Home}/>
        </Switch>
      </BrowserRouter>
    );
  }
}

export default Router;