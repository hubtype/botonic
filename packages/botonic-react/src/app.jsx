import React from 'react'
import ReactDOM from 'react-dom'
import ReactDOMServer from 'react-dom/server'

import { isBrowser, isNode, getNLU } from '@botonic/core'
import { Router, getString } from '@botonic/core'
import { Webchat, WebchatDev } from './webchat'
import { RequestContext } from './contexts'
import { Text } from './components/text'

import { isFunction, loadPlugins, runPlugins, isDev } from './utils'

export class App {
  constructor({
    routes,
    locales,
    integrations,
    theme,
    plugins,
    appId,
    defaultTyping,
    defaultDelay
  }) {
    if (appId) {
      this.appId = appId
      return
    }
    this.rootElement = null
    this.routes = routes
    this.defaultRoutes = {
      path: '404',
      action: () => <Text>I don't understand you</Text>
    }
    this.locales = locales
    this.integrations = integrations
    this.router = isFunction(this.routes)
      ? null
      : new Router([...this.routes, this.defaultRoutes])
    this.plugins = loadPlugins(plugins)
    this.theme = theme
    this.defaultTyping = defaultTyping || 0
    this.defaultDelay = defaultDelay || 0
  }

  getString(stringID, session) {
    return getString(this.locales, session.__locale, stringID)
  }

  setLocale(locale, session) {
    session.__locale = locale
  }

  webchat(themeOptions) {
    if (!themeOptions && this.theme) themeOptions = this.theme
    if (this.theme && themeOptions)
      themeOptions = { ...this.theme, ...themeOptions }
    if (isDev()) return <WebchatDev botonicApp={this} theme={themeOptions} />
    else return <Webchat botonicApp={this} theme={themeOptions} />
  }

  render(dest, webchatOptions, appId = null) {
    if (appId) this.appId = appId
    if (webchatOptions && webchatOptions.theme)
      ReactDOM.render(this.webchat(webchatOptions.theme), dest)
    else ReactDOM.render(this.webchat(null), dest)
  }

  async input({ input, session, lastRoutePath }) {
    session = session || {}
    if (!session.__locale) session.__locale = 'en'

    if (this.plugins) {
      await runPlugins(this.plugins, 'pre', input, session, lastRoutePath)
    } else if (this.integrations && input.type == 'text') {
      try {
        let nlu = await getNLU(input, this.integrations)
        Object.assign(input, nlu)
      } catch (e) {}
    }

    if (isFunction(this.routes)) {
      this.router = new Router([
        ...this.routes({ input, session }),
        this.defaultRoutes
      ])
    }

    let output = this.router.processInput(input, session, lastRoutePath)
    let Action = output.action
    let RetryAction = output.retryAction
    let DefaultAction = output.defaultAction
    let props = {}
    let req = {
      input,
      session,
      params: output.params,
      lastRoutePath,
      plugins: this.plugins
    }
    if (Action.botonicInit) {
      props = await Action.botonicInit(req)
    }
    let retryProps = {}
    if (RetryAction && RetryAction.botonicInit) {
      retryProps = await RetryAction.botonicInit(req)
    }
    let defaultProps = {}
    if (DefaultAction && DefaultAction.botonicInit) {
      defaultProps = await DefaultAction.botonicInit(req)
    }

    let request = {
      getString: stringId => this.getString(stringId, session),
      setLocale: locale => this.setLocale(locale, session),
      session: session || {},
      params: output.params || {},
      input: input,
      plugins: this.plugins,
      defaultTyping: this.defaultTyping,
      defaultDelay: this.defaultDelay
    }

    let component = (
      <RequestContext.Provider value={request}>
        <Action {...props} />
        {RetryAction && <RetryAction {...retryProps} />}
        {DefaultAction && <DefaultAction {...defaultProps} />}
      </RequestContext.Provider>
    )

    let response = null
    if (isBrowser()) response = component
    else response = ReactDOMServer.renderToStaticMarkup(component)

    lastRoutePath = output.lastRoutePath

    if (this.plugins) {
      await runPlugins(
        this.plugins,
        'post',
        input,
        session,
        lastRoutePath,
        response
      )
    }
    session.is_first_interaction = false
    return { input, response, session, lastRoutePath }
  }
}
