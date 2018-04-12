import { join, resolve } from 'path'
import * as next from 'next'
import axios from 'axios'

export class Botonic {
  public path: string
  public conf: any
  private app: any
  private df_session_id: number = Math.random()

  constructor(config_path: string) {
    this.path = config_path
    this.conf = require(join(this.path, '/.next/botonic.config.js'))
    process.chdir(this.path)
    this.app = next({ dev: false })
  }

  getAction(input: any) {
    let route = this.conf.routes.find((r: object) => Object.entries(r)
      .filter(([key, value]) => key != 'action')
      .every(([key, value]) => this.matchRoute(key, value, input)))

    return route? route.action : '404'
  }

  matchRoute(prop: string, matcher: any, input: any): boolean {
    /*
      prop: ('text' | 'payload' | 'intent')
      matcher: (string: exact match | regex: regular expression match | function: return true)
      input: user input object, ex: {type: 'text', data: 'Hi'}
    */
    let value: string = ''
    if(prop in input)
      value = input[prop]
    else if(prop == 'text')
      value = input.data
    if(typeof matcher === 'string')
      return value == matcher
    if(matcher instanceof RegExp)
      return matcher.test(value)
    if(typeof matcher === 'function')
      return matcher(value)
    return false
  }

  async processInput(input: any) {
    if(input.type == 'text') {
      let intent: any = await this.getIntent(input)
      if(intent)
        input.intent = intent.data.result.action
    }
    let component = 'actions/' + this.getAction(input)
    const req = {headers: {}, method: 'GET', url: component}
    const res = {}
    const pathname = component
    const query = {}
    return this.app.renderToHTML(req, res, pathname, query, {})
  }

  async getIntent(input: any): Promise<any> {
    if(this.conf.integrations && this.conf.integrations.dialogflow) {
      return axios({
          headers: {
            Authorization: 'Bearer ' + this.conf.integrations.dialogflow.token
          },
          url: 'https://api.dialogflow.com/v1/query',
          params: {
            query: input.data, lang: 'en', sessionId: this.df_session_id
          }
        })
      }
  }
}
