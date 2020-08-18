import React, { Component } from "react";
import { Route, Router, Redirect } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import "./App.css";
import history from "./history";
import Product from "./components/Product";
import Auth from "./Auth";
class App extends Component {
  render() {
    return (
      <Router history={history}>
        <div className="">
          <Route exact path="/" component={Login} />
          <Route path="/register" component={Register} />
          <this.PrivateRoute path="/product" component={Product} />
        </div>
      </Router>
    );
  }

  PrivateRoute = ({ component: Component, ...rest }) => (
    <Route
      {...rest}
      render={(props) =>
        Auth.getAuth() ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/",
            }}
          />
        )
      }
    />
  );
}

export default App;
