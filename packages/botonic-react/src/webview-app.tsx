// @ts-nocheck
import { params2queryString, PROVIDER } from '@botonic/core'
import axios from 'axios'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route } from 'react-router-dom'

import { CloseWebviewOptions, WebviewRequestContext } from './contexts'

class App extends React.Component {
  private url: URL
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
      const botId = this.url.searchParams.get('bot_id')
      const chatId = this.url.searchParams.get('chat_id')
      if (botId && chatId) {
        this.getBotSessionContextFromExternalApi(botId, chatId)
      } else {
        this.getBotSessionContextFromUrl()
      }
    } catch (error) {
      this.getBotSessionContextFromUrl()
    }
  }

  async getBotSessionContextFromExternalApi(botId: string, chatId: string) {
    // const baseUrl = session._hubtype_api || 'https://api.hubtype.com'
    const baseUrl = 'https://api.hubtype.com' // TODO: How to retrieve here the api url to request?
    const url = `${baseUrl}/external/v2/conversational_apps/${botId}/users/${chatId}/context/`

    const response = await axios.get(url)
    const session = response.data

    this.setState({
      session,
      // TODO: Are we currently using botonic webviews api for params?
    })
  }

  getBotSessionContextFromUrl() {
    const params = Array.from(this.url.searchParams.entries())
      .filter(([key, value]) => key !== 'context')
      .reduce((o, [key, value]) => {
        o[key] = value
        return o
      }, {})

    const urlContext = this.url.searchParams.get('context')
    const session = JSON.parse(urlContext || '{}')

    this.setState({
      session,
      params,
    })
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
        const baseUrl = session._hubtype_api || 'https://api.hubtype.com'
        const url = `${baseUrl}/v1/bots/${session.bot.id}/send_postback/`
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
    const webviewRequestContext = {
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
