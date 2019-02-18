import React, { Component } from 'react';
import { Route, Switch, BrowserRouter } from "react-router-dom";

// pages
import Home from "./pages/Home";
import EditProject from './pages/EditProject';

class Router extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/users/:username" component={Home}/>
          <Route path="/projects/:id" component={EditProject}/>
          <Route path="/" component={Home}/>
        </Switch>
      </BrowserRouter>
    );
  }
}

export default Router;