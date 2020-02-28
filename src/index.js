import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
// 1
import { ApolloProvider } from "@apollo/react-hooks";
import ApolloClient from "apollo-boost";
import { InMemoryCache } from "apollo-cache-inmemory";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Grommet } from "grommet";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Category from "./pages/category";

// 3
const client = new ApolloClient({
  uri:
    window.location.href.indexOf("localhost") > -1
      ? "http://localhost:4001"
      : window.location.href,
  cache: new InMemoryCache()
});

const theme = {
  global: {
    font: {
      family: "Roboto",
      size: "18px",
      height: "20px"
    },

    colors: {
      focus: "#ffffff" // added focus color,
    }
  }
};

ReactDOM.render(
  <ApolloProvider client={client}>
    <Grommet theme={theme}>
      <Router>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />

          <Route
            path="/(festivals|music|sports|concerts|Club Nights|Theatre & Comedy|Vouchers & Day Out)/"
            component={Category}
          />
          <Route path="/" component={App} />
        </Switch>
      </Router>
    </Grommet>
  </ApolloProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
