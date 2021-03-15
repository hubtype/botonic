import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { ReactBot } from './react-bot'

export class NodeApp {
  constructor(options) {
    this.bot = new ReactBot({
      renderer: args => this.renderNode(args),
      ...options,
    })
  }

  /**
   *
   * @param {(ActionRequest, Action[])} args
   * @return {Promise<string>}
   */
  async renderNode(args) {
    return (await this.bot.renderReactActions(args))
      .map(action => renderToStaticMarkup(action))
      .join('\n')
  }

  /**
   * Method called from serverless handler
   * @param {BotRequest} args
   * @return {BotResponse}
   */
  input(args) {
    return this.bot.input(args)
  }

  getConfig() {
    return Object.entries(this.bot.plugins).map(([_, plugin]) => {
      return { id: plugin.id, name: plugin.name, config: plugin.config }
    })
  }
}

/**
 * Actions are not required to subclass Action, only added in case somebody
 * decides to do it.
 */
export class Action extends React.Component {
  static botonicInit(request) {}
}
