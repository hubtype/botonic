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

const DEFAULT_HUBTYPE_API_URL = 'https://api.hubtype.com'

class App extends React.Component {
  private url: URL
  private hubtypeApiUrl: string = DEFAULT_HUBTYPE_API_URL

  constructor(props) {
    super(props)
    this.url = new URL(window.location.href)
    this.state = {
      session: null,
      params: {},
    }
  }

  async componentDidMount() {
    await this.initializeApp()
  }

  private async initializeApp() {
    try {
      const botId = this.url.searchParams.get(WebviewUrlParams.BotId)
      const chatId = this.url.searchParams.get(WebviewUrlParams.UserId)
      const hubtypeApiUrl = this.url.searchParams.get(
        WebviewUrlParams.HubtypeApiUrl
      )

      if (botId && chatId && hubtypeApiUrl) {
        const session = await this.getBotSessionContextFromExternalApi(
          hubtypeApiUrl,
          botId,
          chatId
        )
        this.hubtypeApiUrl = hubtypeApiUrl
        this.setState({
          session,
          params: this.getParamsFromUrl(),
        })
      } else {
        const session = this.getBotSessionContextFromUrl()
        this.hubtypeApiUrl = session._hubtype_api || DEFAULT_HUBTYPE_API_URL
        this.setState({
          session,
          params: this.getParamsFromUrl(),
        })
      }
    } catch (error) {
      console.error('Failed to initialize app:', error)
      const session = this.getBotSessionContextFromUrl()
      this.hubtypeApiUrl = session._hubtype_api || DEFAULT_HUBTYPE_API_URL
      this.setState({
        session,
        params: this.getParamsFromUrl(),
      })
    }
  }

  private async getBotSessionContextFromExternalApi(
    hubtypeApiUrl: string,
    botId: string,
    userId: string
  ) {
    const url = `${hubtypeApiUrl}/external/v2/conversational_apps/${botId}/users/${userId}/context/`
    const response = await axios.get(url)
    return response.data
  }

  private getBotSessionContextFromUrl() {
    const urlContext = this.url.searchParams.get(WebviewUrlParams.Context)
    try {
      return JSON.parse(urlContext || '{}')
    } catch (error) {
      console.error('Failed to parse session context from URL:', error)
      return {}
    }
  }

  private getParamsFromUrl() {
    const keysToExclude = [
      WebviewUrlParams.Context,
      WebviewUrlParams.BotId,
      WebviewUrlParams.UserId,
      WebviewUrlParams.HubtypeApiUrl,
    ]
    return Array.from(this.url.searchParams.entries())
      .filter(([key]) => !keysToExclude.includes(key))
      .reduce((params, [key, value]) => {
        params[key] = value
        return params
      }, {})
  }

  private async closeWebviewForProvider(
    provider: string,
    session: Session,
    payload?: string
  ) {
    const { user } = session

    switch (provider) {
      case PROVIDER.WHATSAPP:
        location.href = `https://wa.me/${user.unformatted_phone_number}`
        break
      case PROVIDER.TELEGRAM:
        location.href = `https://t.me/${user.imp_id}`
        break
      case PROVIDER.APPLE:
        location.href = `https://bcrw.apple.com/urn:biz:${user.imp_id}`
        break
      case PROVIDER.TWITTER:
        location.href = `https://twitter.com/messages/compose?recipient_id=${user.imp_id}`
        break
      case PROVIDER.INSTAGRAM:
        window.close()
        break
      case PROVIDER.FACEBOOK:
        try {
          window.MessengerExtensions.requestCloseBrowser(
            () => {}, // success callback
            () => window.close() // error callback
          )
        } catch (error) {
          window.close()
        }
        break
      case PROVIDER.WEBCHAT:
        try {
          await parent.postMessage('botonicCloseWebview', '*')
        } catch (error) {
          console.error('Failed to send close message to parent:', error)
        }
        break
      default:
        console.warn(`Unknown provider: ${provider}`)
    }
  }

  async close(options?: CloseWebviewOptions) {
    if (!this.state.session) {
      console.error('No session available for closing webview')
      return
    }

    let payload = options?.payload || null

    if (options?.path) {
      payload = `__PATH_PAYLOAD__${options.path}`
    }

    if (payload) {
      if (options?.params) {
        payload = `${payload}?${params2queryString(options.params)}`
      }

      try {
        const url = `${this.hubtypeApiUrl}/v1/bots/${this.state.session.bot.id}/send_postback/`
        const data = {
          payload,
          chat_id: this.state.session.user.id,
        }
        await axios.post(url, data)
      } catch (error) {
        console.error('Failed to send postback:', error)
      }
    }

    await this.closeWebviewForProvider(
      this.state.session.user.provider,
      this.state.session,
      payload
    )
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
      getSystemLocale: () => this.state.session.user.system_locale,
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
    const reactRoot = createRoot(dest)
    reactRoot.render(component)
  }
}
