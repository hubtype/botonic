// @ts-nocheck
import { getString, params2queryString, PROVIDER } from '@botonic/core'
import axios from 'axios'
import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter, Route } from 'react-router-dom'

import { CloseWebviewOptions, WebviewRequestContext } from './contexts'

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

  async close(options?: CloseWebviewOptions) {
    let payload = options ? options.payload : null
    if (options?.path) payload = `__PATH_PAYLOAD__${options.path}`
    if (payload) {
      if (options?.params) {
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
    const provider = this.state.session.user.provider
    const impId = this.state.session.user.imp_id
    if (provider === PROVIDER.WHATSAPP) {
      const phone_number = this.state.session.user.unformatted_phone_number
      location.href = 'https://wa.me/' + phone_number
    }
    if (provider === PROVIDER.TELEGRAM) {
      location.href = 'https://t.me/' + impId
    }
    if (provider === PROVIDER.APPLE) {
      location.href = 'https://bcrw.apple.com/urn:biz:' + impId
    }
    if (provider === PROVIDER.TWITTER) {
      location.href =
        'https://twitter.com/messages/compose?recipient_id=' + impId
    }
    if (provider === PROVIDER.INSTAGRAM) {
      window.close()
    }
    if (provider === PROVIDER.FACEBOOK) {
      try {
        window.MessengerExtensions.requestCloseBrowser(
          () => undefined,
          err => console.log(err)
        )
      } catch (e) {}
    }
    if (provider === PROVIDER.WEBCHAT) {
      try {
        await parent.postMessage('botonicCloseWebview', '*')
      } catch (e) {}
    }
  }

  render() {
    const webviewRequestContext = {
      getString: (stringId: string) =>
        getString(this.props.locales, this.state.session.__locale, stringId),
      session: this.state.session || {},
      params: this.state.params || {},
      closeWebview: this.close.bind(this),
    }

    return (
      <WebviewRequestContext.Provider value={webviewRequestContext}>
        {this.props.webviews.map((Webview, i) => (
          <Route key={i} path={`/${Webview.name}`} component={Webview} />
        ))}
      </WebviewRequestContext.Provider>
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
