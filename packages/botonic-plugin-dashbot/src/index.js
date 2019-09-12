var dashbot = require('dashbot')

export default class BotonicPluginDashbot {
  constructor(options) {
    this.options = options
    dashbot = dashbot(this.options.apiKey).webchat
  }

  async pre({ input, session, lastRoutePath }) {}

  async post({ input, session, lastRoutePath, response }) {
    let href = 'undefined'
    try {
      href = window.location.href
    } catch (e) {}
    const messageInDashbot = {
      text: input.data,
      platformJson: { ref: href, intent: input.intent },
      userId: session.user.id
    }
    await dashbot.logIncoming(messageInDashbot)

    const messageOutDashbot = {
      text: response,
      platformJson: { ref: href, intent: input.intent },
      userId: session.user.id
    }
    await dashbot.logOutgoing(messageOutDashbot)
  }
}
