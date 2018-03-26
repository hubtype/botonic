import { join, resolve } from 'path'
import { Command, flags } from '@oclif/command'
//const next = require('next')
import * as next from 'next'
//import dynamic from 'next/dynamic'
import { load } from 'cheerio'
import axios from 'axios'

export default class Run extends Command {
  static description = 'describe the command here'

  static examples = [
    `$ botonic input "{\"type\": \"text\", \"data\": \"hi\"}"
Hello!
`,
  ]

  static flags = {
    // flag with a value (-n, --name=VALUE)
    path: flags.string({char: 'p', description: 'Path to botonic project. Defaults to current dir.'})
  }

  static args = [{name: 'input', parse: JSON.parse}]

  private app: any;
  private conf: any;
  private df: any;
  private df_session_id: number = Math.random()

  async run() {
    const {args, flags} = this.parse(Run)
    const path = flags.path || '.'
    this.conf = require('/Users/eric/Documents/metis/nextjs/.next/botonic.config.js')
    //process.chdir(resolve(path));
    process.chdir('/Users/eric/Documents/metis/nextjs');
    //this.df = new ApiAiClient({accessToken: this.conf.integrations.dialogflow.token})
    this.app = next({ dev: false })
    let input = args.input
    if(input.type == 'text') {
      axios({
        headers: {
          Authorization: 'Bearer ' + this.conf.integrations.dialogflow.token
        },
        url: 'https://api.dialogflow.com/v1/query',
        params: {
          query: input.data, lang: 'en', sessionId: this.df_session_id
        }
      }).then((r: any) => {
        input.intent = r.data.result.action
        this.processInput(input)
      }, (err: any) => console.log(err))
    } else {
      this.processInput(input)
    }
  }

  processInput(input: any) {
    let component = this.getRoute(input)
    const req = {headers: {}, method: 'GET', url: component}
    const res = {}
    const pathname = component
    const query = {}
    this.app.renderToHTML(req, res, pathname, query, {}).then((html: string) => {
      console.log(html)
    })
  }

  getRoute(route: any) {
    for (var i = 0; i < this.conf.routes.length; i++) {
      let r = this.conf.routes[i]
      if((route.type == 'text' && r.text == route.data) ||
          ((route.type == 'text' || route.type == 'postback') && route.payload && r.payload == route.payload) ||
          (route.intent && r.intent == route.intent)) {
        return this.conf.routes[i].component
      }
    }
    return ''
  }
}