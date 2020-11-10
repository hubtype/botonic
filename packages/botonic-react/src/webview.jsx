import { getString, params2queryString, PROVIDER } from '@botonic/core'
import axios from 'axios'
import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter, Route } from 'react-router-dom'

import { RequestContext } from './contexts'

class App extends React.Component {
  constructor(props) {
    super(props)
    const url = new URL(window.location.href)
    const params = Array.from(url.searchParams.entries())
      .filter(([key, value]) => key != 'context')
      .reduce((o, [key, value]) => {
        o[key] = value
        return o
      }, {})
    const session = JSON.parse(url.searchParams.get('context') || {})
    this.state = { session, params }
  }

  async close(options) {
    let payload = options ? options.payload : null
    if (options.path) payload = `__PATH_PAYLOAD__${options.path}`
    if (payload) {
      if (options.params) {
        payload = `${payload}?${params2queryString(options.params)}`
      }
      const s = this.state.session
      try {
        const baseUrl = s._hubtype_api || 'https://api.hubtype.com'
        const resp = await axios({
          method: 'post',
          url: `${baseUrl}/v1/bots/${s.bot.id}/send_postback/`,
          // eslint-disable-next-line @typescript-eslint/naming-convention
          data: { payload: payload, chat_id: s.user.id },
        })
      } catch (e) {
        console.log(e)
      }
    }
    if (this.state.session.user.provider === PROVIDER.WHATSAPP) {
      location.href = 'https://wa.me/' + this.state.session.user.imp_id
    } else {
      try {
        window.MessengerExtensions.requestCloseBrowser(
          () => undefined,
          err => console.log(err)
        )
      } catch (e) {}
      try {
        await parent.postMessage('botonicCloseWebview', '*')
      } catch (e) {}
    }
  }

  render() {
    const requestContext = {
      getString: stringId =>
        getString(this.props.locales, this.state.session.__locale, stringId),
      session: this.state.session || {},
      params: this.state.params || {},
      closeWebview: this.close.bind(this),
    }

    return (
      <RequestContext.Provider value={requestContext}>
        {this.props.webviews.map((Webview, i) => (
          <Route key={i} path={`/${Webview.name}`} component={Webview} />
        ))}
      </RequestContext.Provider>
    )
  }
}

export class WebviewApp {
  constructor({ webviews, locales }) {
    this.webviews = webviews
    this.locales = locales
  }

  render(dest) {
    render(
      <BrowserRouter>
        <App webviews={this.webviews} locales={this.locales} />
      </BrowserRouter>,
      dest
    )
  }
}
