import btoa from 'btoa'

import { segmentAPI } from './utils'

export default class BotonicPluginSegment {
  constructor(options) {
    this.options = options
    this.headers = {
      headers: {
        Authorization: `Basic ${btoa(this.options.writeKey)}`,
        'Content-Type': 'application/json',
      },
    }
  }

  async pre({ input, session, lastRoutePath }) {}

  async post({ input, session, lastRoutePath, response }) {
    if (!this.options.trackManually) {
      if (session.is_first_interaction) {
        this.identify({ input, session })
      }
      this.page({ input, session, lastRoutePath })
    }
  }

  async identify({ input, session, userId, traits }) {
    const t = traits || { user: session.user }
    try {
      await segmentAPI('identify', this.headers, {
        userId: userId || session.user.id,
        traits: t,
        input: input || '',
      })
    } catch (e) {
      console.log(e)
    }
  }

  async track({ input, session, userId, event, properties }) {
    const p = properties || { user: session.user }
    try {
      await segmentAPI('track', this.headers, {
        userId: userId || session.user.id,
        event: event || session.bot.id,
        properties: p,
        input: input || '',
      })
    } catch (e) {
      console.log(e)
    }
  }

  async page({ input, session, lastRoutePath, userId, event, properties }) {
    const p = properties || { user: session.user }
    try {
      await segmentAPI('page', this.headers, {
        userId: userId || session.user.id,
        category: lastRoutePath,
        name: session.bot.name,
        properties: p,
        input: input || '',
      })
    } catch (e) {
      console.log(e)
    }
  }
}
