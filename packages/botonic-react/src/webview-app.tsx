// @ts-nocheck
import { params2queryString, PROVIDER, Session } from '@botonic/core'
import axios from 'axios'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route } from 'react-router-dom'

import { CloseWebviewOptions, WebviewRequestContext } from './contexts'

enum WebviewUrlParams {
  Context = 'context',
  BotId = 'bot_id',
  UserId = 'user_id',
  HubtypeApiUrl = 'hubtype_api_url',
}

class App extends React.Component {
  private url: URL
  private botId: string
  private userId: string
  private hubtypeApiUrl: string
  private state: { session: Session; params: Record<string, string> }

  constructor(props) {
    super(props)
    this.url = new URL(window.location.href)
    this.botId = this.url.searchParams.get(WebviewUrlParams.BotId)
    this.userId = this.url.searchParams.get(WebviewUrlParams.UserId)
    this.hubtypeApiUrl =
      this.url.searchParams.get(WebviewUrlParams.HubtypeApiUrl) ||
      'https://api.hubtype.com'
    this.state = {
      session: null,
      params: {},
    }
  }

  async componentDidMount() {
    try {
      const session = await this.getSessionFromUrl()
      const params = this.getParamsFromUrl()
      this.setState({ session, params })
    } catch (error) {
      console.error('Error getting bot session context from url', error)
    }
  }

  async getSessionFromUrl() {
    const url = `${this.hubtypeApiUrl}/external/v2/conversational_apps/${this.botId}/users/${this.userId}/context/`
    const response = await axios.get(url)
    return response.data
  }

  getParamsFromUrl() {
    const keysToExclude = [
      WebviewUrlParams.Context,
      WebviewUrlParams.BotId,
      WebviewUrlParams.UserId,
      WebviewUrlParams.HubtypeApiUrl,
    ]
    const params = Array.from(this.url.searchParams.entries())
      .filter(([key, _]) => !keysToExclude.includes(key))
      .reduce((o, [key, value]) => {
        o[key] = value
        return o
      }, {})
    return params
  }

  async close(options?: CloseWebviewOptions) {
    let payload = options ? options.payload : null

    if (options?.path) {
      payload = `__PATH_PAYLOAD__${options.path}`
    }

    if (payload) {
      if (options?.params) {
        payload = `${payload}?${params2queryString(options.params)}`
      }

      const session = this.state.session
      try {
        const url = `${this.hubtypeApiUrl}/v1/bots/${this.botId}/send_postback/`
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const data = { payload: payload, chat_id: this.userId }
        await axios.post(url, data)
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
          function success() {},
          function error(err) {
            window.close()
          }
        )
      } catch (e) {
        window.close()
      }
    }
    if (provider === PROVIDER.WEBCHAT) {
      try {
        await parent.postMessage('botonicCloseWebview', '*')
      } catch (e) {}
    }
  }

  render() {
    if (!this.state.session) {
      return null
    }
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
    const component = (
      <BrowserRouter>
        <App webviews={this.webviews} locales={this.locales} />
      </BrowserRouter>
    )
    const container = dest
    const reactRoot = createRoot(container)
    reactRoot.render(component)
  }
}
