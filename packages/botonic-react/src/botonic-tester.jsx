import { INPUT } from '@botonic/core'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import decode from 'unescape'

import { Reply } from './components/reply'
import { Text } from './components/text'

export class BotonicInputTester {
  constructor(bot) {
    this.bot = bot
  }
  async text(inp, session = { user: { id: '123' } }, lastRoutePath = '') {
    const res = await this.bot.input({
      input: { type: INPUT.TEXT, data: inp },
      session: session,
      lastRoutePath: lastRoutePath,
    })
    return decode(res.response)
  }

  async payload(inp, session = { user: { id: '123' } }, lastRoutePath = '') {
    const res = await this.bot.input({
      input: { type: INPUT.POSTBACK, payload: inp },
      session: session,
      lastRoutePath: lastRoutePath,
    })
    return decode(res.response)
  }

  async path(inp, session = { user: { id: '123' } }, lastRoutePath = '') {
    const res = await this.bot.input({
      input: { type: INPUT.TEXT, payload: `__PATH_PAYLOAD__${inp}` },
      session: session,
      lastRoutePath: lastRoutePath,
    })
    return decode(res.response)
  }
}

export class BotonicOutputTester {
  constructor(bot) {
    this.bot = bot
  }

  text(out, replies = null) {
    return decode(
      ReactDOMServer.renderToStaticMarkup(
        !replies ? (
          <Text>{out}</Text>
        ) : (
          <Text>
            {out}
            {replies}
          </Text>
        )
      )
    )
  }

  reply({ text, payload = null, path = null }) {
    if (payload) {
      return decode(
        ReactDOMServer.renderToStaticMarkup(
          <Reply payload={payload}>{text}</Reply>
        )
      )
    }
    if (path) {
      return decode(
        ReactDOMServer.renderToStaticMarkup(<Reply path={path}>{text}</Reply>)
      )
    }
    throw new Error('reply should contain a payload or a path')
  }

  replies(...args) {
    const replies = []
    for (let i = 0; i < args.length; i++) {
      const r = args[i]
      replies.push(
        this.reply({ text: r.text, payload: r.payload, path: r.path })
      )
    }
    return replies
  }
}
