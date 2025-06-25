// @ts-nocheck
import { params2queryString, PROVIDER, Session } from '@botonic/core'
import axios from 'axios'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route } from 'react-router-dom'

import {
  CloseWebviewOptions,
  WebviewRequestContext,
  WebviewRequestContextType,
} from './contexts'

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
  private hubtypeApiUrl: string = ''
  private state: { session: Session; params: Record<string, string> }

  constructor(props) {
    super(props)
    this.url = new URL(window.location.href)
    this.state = {
      session: null,
      params: {},
    }
  }

  async componentDidMount() {
    try {
      const botId = this.url.searchParams.get(WebviewUrlParams.BotId)
      const chatId = this.url.searchParams.get(WebviewUrlParams.UserId)
      this.hubtypeApiUrl = this.url.searchParams.get(
        WebviewUrlParams.HubtypeApiUrl
      )
      if (botId && chatId && hubtypeApiUrl) {
        const session = await this.getBotSessionContextFromExternalApi(
          hubtypeApiUrl,
          botId,
          chatId
        )
        this.setState({
          session,
          params: this.getParamsFromUrl(),
        })
      } else {
        const session = this.getBotSessionContextFromUrl()
        this.hubtypeApiUrl = session._hubtype_api
        this.setState({
          session,
          params: this.getParamsFromUrl(),
        })
      }
    } catch (error) {
      const session = this.getBotSessionContextFromUrl()
      this.hubtypeApiUrl = session._hubtype_api
      this.setState({
        session,
        params: this.getParamsFromUrl(),
      })
    } finally {
      this.hubtypeApiUrl = this.hubtypeApiUrl || 'https://api.hubtype.com'
    }
  }

  async getBotSessionContextFromExternalApi(
    hubtypeApiUrl: string = 'https://api.hubtype.com',
    botId: string,
    userId: string
  ) {
    const url = `${hubtypeApiUrl}/external/v2/conversational_apps/${botId}/users/${userId}/context/`
    const response = await axios.get(url)
    return response.data
  }

  getBotSessionContextFromUrl() {
    const urlContext = this.url.searchParams.get(WebviewUrlParams.Context)
    const session = JSON.parse(urlContext || '{}')
    return session
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
        const url = `${this.hubtypeApiUrl}/v1/bots/${session.bot.id}/send_postback/`
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const data = { payload: payload, chat_id: session.user.id }
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

    const webviewRequestContext: WebviewRequestContextType = {
      params: this.state.params,
      session: this.state.session,
      getUserCountry: () => this.state.session.user.country,
      getUserLocale: () => this.state.session.user.locale,
      getSystemLocale: () => this.state.session.system_locale,
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
