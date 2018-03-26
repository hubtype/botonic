import { join, resolve } from 'path'
import { Command, flags } from '@oclif/command'
//const next = require('next')
import * as next from 'next'
//import dynamic from 'next/dynamic'
import { load } from 'cheerio'
import * as Table from 'cli-table2'
import { Question, prompt } from 'inquirer'
import * as colors from 'colors'
import axios from 'axios'

export default class Run extends Command {
  static description = 'describe the command here'

  static examples = [
    `$ botonic run
Your bot is ready, start talking:
[you] > Hi
[bot] > Bye!
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
    this.conf = require(join(path, '/.next/botonic.config.js'))
    //process.chdir(resolve(path));
    process.chdir('/Users/eric/Documents/metis/nextjs');
    //this.df = new ApiAiClient({accessToken: this.conf.integrations.dialogflow.token})
    this.app = next({ dev: false })
    this.chat_loop()
  }

  chat_loop() {
    prompt([{
      type: 'input',
      name: 'input',
      message: '[user]>'
    }]).then((inp: any) => {
      let input: any = {type: 'text', 'data': inp.input}
      if(inp.input.startsWith('!')) {
        input = {type: 'postback', 'payload': inp.input.slice(1)}
        this.processInput(input)
      }
      else {
        axios({
          headers: {
            Authorization: 'Bearer ' + this.conf.integrations.dialogflow.token
          },
          url: 'https://api.dialogflow.com/v1/query',
          params: {
            query: inp.input, lang: 'en', sessionId: this.df_session_id
          }
        }).then((r: any) => {
          input.intent = r.data.result.action
          this.processInput(input)
        }, (err: any) => console.log(err))
      }
    })
  }

  processInput(input: any) {
    let component = this.getRoute(input)
    const req = {headers: {}, method: 'GET', url: component}
    const res = {}
    const pathname = component
    const query = {}
    this.app.renderToHTML(req, res, pathname, query, {}).then((html: string) => {
      this.parseOutput(html)
      this.chat_loop()
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

  parseOutput(output: string) {
    let html = load(output);
      let outputs = html('[type=text], [type=carrousel]')
        .map((i, elem) => {
          let el = html(elem);
          let out = '';
          if(el.is('[type=text]')) {
            out = el.contents().filter(e => el.contents()[e].type === 'text').text().trim();
          } else if(el.is('[type=carrousel]')) {
            const c = new Table({
              style: { head: [], border: [] },
              wordWrap: false }) as Table.HorizontalTable;
            let cards = [];
            el.find('element').slice(0, 3).each((j, e) => {
              let te = new Table({style: { head: [], border: [] }}) as Table.HorizontalTable;
              let el = html(e);
              let buttons = el.find('button')
                .map((k, b) => html(b).text() + '\n(' + html(b).attr('href') + ')')
                .get();
              te.push([el.find('title').text() + '\n\n' + el.find('desc').text()], buttons);
              cards.push(te.toString());
            })
            if(el.find('element').length > 3)
              cards.push({
                content: '...\n(' + (el.find('element').length - 3) + ' more elements)',
                vAlign: 'center',
                hAlign: 'center'});
            c.push(cards);
            out = '\n' + c.toString();
          }
          let keyboard = '';
          if(el.find('reply').length > 0) {
            let kt = new Table({style: { head: [], border: [] }}) as Table.HorizontalTable;
            let keys = el.find('reply')
              .map((i, e) => html(e).text() + '\n(' + html(e).attr('payload') + ')')
              .get();
            kt.push(keys);
            keyboard = '\n' + kt.toString();
          }
          if(out) return '  [bot]> ' + out + keyboard;
        })
        .get();
      console.log(colors.magenta(outputs.join('\n')));
  }
}