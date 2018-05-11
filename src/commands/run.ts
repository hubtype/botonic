import { resolve } from 'path'
import { Command, flags } from '@oclif/command'
import { load } from 'cheerio'
import * as Table from 'cli-table2'
import { Question, prompt } from 'inquirer'
import * as colors from 'colors'
const ora = require('ora')

const util = require('util')
const exec = util.promisify(require('child_process').exec)

import { Botonic } from '../botonic'
import { track } from '../utils'

export default class Run extends Command {
  static description = 'Start interactive session'

  static examples = [
    `$ botonic run
Your bot is ready, start talking:
[you] > Hi
[bot] > Bye!
`,
  ]

  static flags = {
    path: flags.string({char: 'p', description: 'Path to botonic project. Defaults to current dir.'})
  }

  static args = [{name: 'input', parse: JSON.parse}]

  private botonic: any
  private context: any = {
    'last_session': '0',
    'user': {
        'id': '000001',
        'username': 'John',
        'name': 'Doe',
        'provider': 'Provider',
        'provider_id': '0000000',
        'extra_data': ''
    },
    'organization': 'Organization',
    'bot': {
        'id': '0000000',
        'name': 'botName'
    }
  }
  private helpText: String = 'This is an interactive chat session with your bot.\n\n\
Type anything and press enter to get a response\n\
Use ! to send a payload message\n\
Examples:\n\
[user]> hi || this will send a message of type \'text\' and content \'hi\'\n\
[user]> !button_click_1 || this will send a message of type \'postback\' and payload \'button_click_1\'\n\n\
Use / to use special commands:\n\
/quit | /q --> Exit interactive session\n\
/help | /h --> Show this help\n'

  async run() {
    track('botonic_run')
    const {args, flags} = this.parse(Run)
    const path = flags.path? resolve(flags.path) : process.cwd()

    //Build project
    let spinner = new ora({
      text: 'Building...',
      spinner: 'bouncingBar'
    }).start()
    let build_out = await exec('npm run build')
    spinner.succeed()

    this.botonic = new Botonic(path)
    console.log(this.helpText)
    this.chat_loop()
  }

  chat_loop() {
    prompt([{
      type: 'input',
      name: 'input',
      message: '[user]>'
    }]).then((inp: any) => {
      let input: any = {type: 'text', 'data': inp.input}
      if(inp.input.startsWith('!'))
        input = {type: 'postback', 'payload': inp.input.slice(1)}
      this.botonic.processInput(input, null, this.context).then((response: string) => {
        if(['/q', '/quit'].indexOf(input.data)>=0)
          return
        if(['/help', '/h'].indexOf(input.data)>=0){
          console.log(this.helpText)
          this.chat_loop()
          return
        }
        this.parseOutput(response)
        this.chat_loop()
      })
    })
  }

  parseOutput(output: string) {
    let soruceData = '[type=image], [type=video], [type=audio], [type=document]'
    let nextData = JSON.parse(output.split('__NEXT_DATA__ =')[1].split('module')[0])
    this.context = nextData.props.context || {}
    let html = load(output)
      let outputs = html('[type=text], [type=carrousel], [type=image], [type=video], [type=audio],\
        [type=document], [type=location], [type=button]')
        .map((i, elem) => {
          let el = html(elem)
          let out = ''
          let short = (v: string) => v.length > 20? v.substring(0, 17) + '...' : v
          if(el.is('[type=text]')) {
            out = el.contents().filter(e => el.contents()[e].type === 'text').text().trim()
          } else if(el.is('[type=carrousel]')) {
            const c = new Table({
              style: { head: [], border: [] },
              wordWrap: false }) as Table.HorizontalTable
            let cards: any[] = []
            el.find('element').slice(0, 3).each((j, e) => {
              let te = new Table({style: { head: [], border: [] }}) as Table.HorizontalTable
              let el = html(e)
              let buttons = el.find('button')
                .map((k, b) => { return {
                  title: html(b).text(),
                  desc: html(b).attr('url') || html(b).attr('payload')}
                })
                .get()
                .map(b => Object.values(b).map(short))
                .map(([title, desc]) => `${title}\n(${desc})`)
              te.push([short(el.find('title').text()) + '\n\n' + short(el.find('desc').text())], buttons)
              cards.push(te.toString())
            })
            if(el.find('element').length > 3)
              cards.push({
                content: '...\n(' + (el.find('element').length - 3) + ' more elements)',
                vAlign: 'center',
                hAlign: 'center'})
            c.push(cards)
            out = 'carrousel:\n' + c.toString()
          } else if(el.is(soruceData)) {
            out = `${el.attr('type')}: ${el.attr('src')}`;
          } else if(el.is('[type=location]')) {
            const lat = el.find('lat')[0].children[0].data
            const long = el.find('long')[0].children[0].data
            out = `${el.attr('type')}: https://www.google.com/maps?q=${lat},${long}`;
          }
          let keyboard = ''
          if(el.find('button').length > 0 && !el.is('[type=carrousel]')) {
            let kt = new Table({style: { head: [], border: [] }}) as Table.HorizontalTable
            let buttons = el.find('button')
              .map((i, e) => {
                let button_data = e.attribs
                let elem = html(e)
                let data:any = null
                if(button_data['url']){
                  return [elem.text() + '\n(' + button_data['url'] + ')']
                } else if(button_data['href']){
                  return [elem.text() + '\n(' + button_data['href'] + ')']
                } else{
                  return [elem.text() + '\n(' + button_data['payload'] + ')']
                }
              })
              .get()
            kt.push(buttons)
            keyboard = '\nbuttons:\n' + kt.toString()
          }
          if(el.find('reply').length > 0) {
            let kt = new Table({style: { head: [], border: [] }}) as Table.HorizontalTable
            let keys = el.find('reply')
              .map((i, e) => html(e).text() + '\n(' + html(e).attr('payload') + ')')
              .get()
            kt.push(keys)
            keyboard = '\nquickreplies:\n' + kt.toString()
          }
          if(out) return '  [bot]> ' + out + keyboard
        })
        .get()
      console.log(colors.magenta(outputs.join('\n')))
  }
}
