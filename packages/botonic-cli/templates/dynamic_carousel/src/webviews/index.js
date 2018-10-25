import React from "react";
import { render } from "react-dom";
import { BrowserRouter, Route } from "react-router-dom";
import MyWebview from "./components/MyWebview.js";
import "./styles.scss";

class App extends React.Component {
  constructor(props) {
    super(props);
    var url_string = window.location.href;
    var url = new URL(url_string);
    var context = JSON.parse(url.searchParams.get("context"));

    this.state = {
      context: context
    };
  }

  render() {
    return (
      <React.Fragment>
        <Route
          path="/my_webview"
          render={() => <MyWebview context={this.state.context} />}
        />        
      </React.Fragment>
    );
  }
}

render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("app")
);
