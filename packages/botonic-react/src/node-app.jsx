import { renderToStaticMarkup } from 'react-dom/server'

import { ReactBot } from './react-bot'

export class NodeApp {
  constructor(options) {
    this.bot = new ReactBot({
      renderer: args => this.renderNode(args),
      ...options,
    })
  }

  async renderNode(args) {
    return (await this.bot.renderReactActions(args))
      .map(action => renderToStaticMarkup(action))
      .join('\n')
  }

  input(args) {
    return this.bot.input(args)
  }

  getConfig() {
    return Object.entries(this.bot.plugins).map(([_, plugin]) => {
      return { id: plugin.id, name: plugin.name, config: plugin.config }
    })
  }
}
