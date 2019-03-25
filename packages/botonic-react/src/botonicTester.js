import React from 'react'
import ReactDOMServer from 'react-dom/server'
//var decode = require('unescape')
import decode from 'unescape'

import { Text } from './components/text'
import { Reply } from './components/reply'

export class BotonicInputTester {
  constructor(app) {
    this.app = app
  }
  async text(inp, session = {}, lastRoutePath = '') {
    let res = await this.app.input({
      input: { type: 'text', data: inp },
      session: session,
      lastRoutePath: lastRoutePath
    })
    return decode(res.response)
  }

  async payload(inp, session = {}, lastRoutePath = '') {
    let res = await this.app.input({
      input: { type: 'postback', payload: inp },
      session: session,
      lastRoutePath: lastRoutePath
    })
    return decode(res.response)
  }

  async path(inp, session = {}, lastRoutePath = '') {
    let res = await this.app.input({
      input: { type: 'text', payload: `__PATH_PAYLOAD__${inp}` },
      session: session,
      lastRoutePath: lastRoutePath
    })
    return decode(res.response)
  }
}

export class BotonicOutputTester {
  constructor(app) {
    this.app = app
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
  }

  replies() {
    let replies = []
    for (let i = 0; i < arguments.length; i++) {
      let r = arguments[i]
      replies.push(
        this.reply({ text: r.text, payload: r.payload, path: r.path })
      )
    }
    return replies
  }
}
