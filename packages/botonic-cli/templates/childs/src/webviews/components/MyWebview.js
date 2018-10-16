import React from "react";
import { BotonicWebview } from "@botonic/react"


class MyWebview extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };

  }

  componentDidMount() {
    document.title = "MyBot | MyWebview";
  }

  close() {
    BotonicWebview.close()
  }

  render() {
    return (
      <div>
        <div className="my-webview">
          <h1>This is a Botonic Webview!</h1>
        </div>
      </div>
    );
  }
}

export default MyWebview;
