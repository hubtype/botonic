import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter, Route } from 'react-router-dom'
import MyWebview from './components/MyWebview.js'
import InteractionWithBot from './components/InteractionWithBot.js'
import './styles.scss'

class App extends React.Component {
  constructor(props) {
    super(props)
    /*
    Sometimes we will want to transfer data from our bot to a webview, 
    so this below piece of code is quite important in order to get the bot's context in our webviews.
    */
    var url_string = window.location.href
    var url = new URL(url_string)
    var context = JSON.parse(url.searchParams.get('context'))
    //Then we can store the bot's context in our state variable
    this.state = {
      context: context
    }
  }

  render() {
    //We can define a path for our components, we suggest you to follow this syntax notation.
    //After having our bot's context, we can pass it to components through the props 'context'
    return (
      <React.Fragment>
        <Route
          path='/my_webview'
          render={() => <MyWebview context={this.state.context} />}
        />
        <Route
          path='/interaction_with_bot'
          render={() => <InteractionWithBot context={this.state.context} />}
        />
      </React.Fragment>
    )
  }
}

render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('app')
)
