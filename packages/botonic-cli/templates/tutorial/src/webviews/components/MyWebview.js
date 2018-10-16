import React from "react";
import { Button } from "reactstrap";
import { BotonicWebview } from "@botonic/react";

class MyWebview extends React.Component {
  //for further information, see: https://reactjs.org/docs/getting-started.html
  constructor(props) {
    super(props);
    //Here you can define all the state variables you will have to deal with
    this.state = {
      counter: 0
    };

    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    document.title = "MyBot | MyWebview";
  }

  handleClick() {
    //every time setState is called, the virtual DOM will be rendered again by render() method
    this.setState({
      counter: this.state.counter + 1
    });
  }

  close() {
    /*
    Here we want to explicitly emit a message after closing a webview.
    You can also call this method with empty arguments like this: BotonicWebview.close(),
    but be aware that no data will be passed back to the bot.
    */
    BotonicWebview.close(this.props.context, "closed_webview");
  }

  render() {
    return (
      <div>
        <div className="my-webview">
          <h1>This is a Botonic Webview!</h1>
          <Button onClick={() => this.handleClick()}>Click Me</Button>
          <h2>{this.state.counter}</h2>
          <Button onClick={ () => this.close()}>Click me to close this webview</Button>
        </div>
      </div>
    );
  }
}

export default MyWebview;