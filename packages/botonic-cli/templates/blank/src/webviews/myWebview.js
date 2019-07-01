import React from "react";
import { RequestContext } from "@botonic/react";

export default class Loading extends React.Component {
  static contextType = RequestContext;
  render() {
    return (
      <div>
        <h1>This is a Botonic Webview!</h1>
        {/*<button onClick={() => this.context.closeWebview()}>Close</button>*/}
      </div>
    );
  }
}
