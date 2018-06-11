import { resolve } from 'path'
import { Command, flags } from '@oclif/command'
import { load } from 'cheerio'
import * as Table from 'cli-table3'
import { Question, prompt } from 'inquirer'
import * as colors from 'colors'

import { Botonic, BotonicAPIService } from '../botonic'
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
    'last_session': {},
    'user': {
      'id': '000001',
      'username': 'John',
      'name': 'Doe',
      'provider': 'terminal',
      'provider_id': '0000000',
      'extra_data': {}
    },
    'organization': '',
    'bot': {
      'id': '0000000',
      'name': 'botName'
    }
  }
  private helpText: string = `
This is an interactive chat session with your bot.

Type anything and press enter to get a response.
Use ! to send a payload message.

Examples:
[user]> ${colors.bold('hi')} --> this will send a message of type 'text' and content 'hi'
[user]> ${colors.bold('!button_click_1')} --> this will send a message of type 'postback' and payload 'button_click_1'

Use / for special commands:
${colors.bold('/quit')} | ${colors.bold('/q')} --> Exit interactive session
${colors.bold('/help')} | ${colors.bold('/h')} --> Show this help`

  private botonicApiService: BotonicAPIService = new BotonicAPIService()

  async run() {
    track('botonic_run')
    const {args, flags} = this.parse(Run)
    const path = flags.path? resolve(flags.path) : process.cwd()

    //Build project
    await this.botonicApiService.buildIfChanged()
    this.botonicApiService.beforeExit()

    this.botonic = new Botonic(path)
    console.log(this.helpText)
    this.chat_loop()
  }

  chat_loop() {
    console.log()
    prompt([{
      type: 'input',
      name: 'input',
      message: '[you]>'
    }]).then((inp: any) => {
      let input: any = {type: 'text', 'data': inp.input}
      if(inp.input.startsWith('!'))
        input = {type: 'postback', 'payload': inp.input.slice(1)}
      this.botonic.processInput(input, null, this.context).then((response: string) => {
        if(['/q', '/quit'].indexOf(input.data) >= 0)
          return
        if(['/help', '/h'].indexOf(input.data) >= 0) {
          console.log(this.helpText)
          this.chat_loop()
          return
        }
        console.log()
        this.parseOutput(response)
        this.chat_loop()
      })
    })
  }

  parseOutput(output: string) {
    let soruceData = '[type=image], [type=video], [type=audio], [type=document]'
    try {
      let nextData = JSON.parse(output.split('__NEXT_DATA__ =')[1].split('module')[0])
      this.context = nextData.props.context || {}
    } catch(e) {}
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
