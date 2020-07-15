import rawDashbot from 'dashbot'

export default class BotonicPluginDashbot {
  constructor(options) {
    this.options = options
    this.dashbot = rawDashbot(this.options.apiKey).webchat
  }

  async pre({ input, session, lastRoutePath }) {}

  async post({ input, session, lastRoutePath, response }) {
    const messageInDashbot = {
      text: input.data,
      userId: session.user.id,
    }
    await this.dashbot.logIncoming(messageInDashbot)

    const messageOutDashbot = {
      text: response,
      userId: session.user.id,
    }
    await this.dashbot.logOutgoing(messageOutDashbot)
  }
}
