let dashbot = require('dashbot')

export default class BotonicPluginDashbot {
  constructor(options) {
    this.options = options
    dashbot = dashbot(this.options.apiKey).webchat
  }

  async pre({ input, session, lastRoutePath }) {}

  async post({ input, session, lastRoutePath, response }) {
    const messageInDashbot = {
      text: input.data,
      userId: session.user.id,
    }
    await dashbot.logIncoming(messageInDashbot)

    const messageOutDashbot = {
      text: response,
      userId: session.user.id,
    }
    await dashbot.logOutgoing(messageOutDashbot)
  }
}
