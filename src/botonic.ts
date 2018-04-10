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
    for (var i = 0; i < this.conf.routes.length; i++) {
      let r = this.conf.routes[i]
      if((input.type == 'text' && r.text == input.data) ||
        ((input.type == 'text' || input.type == 'postback') && input.payload && r.payload == input.payload) ||
        (input.intent && r.intent == input.intent)) {
          return this.conf.routes[i].action
      }
    }
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
