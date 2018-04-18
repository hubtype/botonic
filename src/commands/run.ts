import { resolve } from 'path'
import { Command, flags } from '@oclif/command'
import { load } from 'cheerio'
import * as Table from 'cli-table2'
import { Question, prompt } from 'inquirer'
import * as colors from 'colors'

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

  async run() {
    track('botonic_run')
    const {args, flags} = this.parse(Run)
    const path = flags.path? resolve(flags.path) : process.cwd()
    this.botonic = new Botonic(path)
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
      this.botonic.processInput(input).then((response: string) => {
        this.parseOutput(response)
        this.chat_loop()
      })
    })
  }

  parseOutput(output: string) {
    let soruceData = '[type=image], [type=video], [type=audio], [type=document]'
    let html = load(output)
      let outputs = html('[type=text], [type=carrousel], [type=image], [type=video], [type=audio],\
        [type=document], [type=location]')
        .map((i, elem) => {
          let el = html(elem)
          let out = ''
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
                .map((k, b) => html(b).text() + '\n(' + html(b).attr('href') + ')')
                .get()
              te.push([el.find('title').text() + '\n\n' + el.find('desc').text()], buttons)
              cards.push(te.toString())
            })
            if(el.find('element').length > 3)
              cards.push({
                content: '...\n(' + (el.find('element').length - 3) + ' more elements)',
                vAlign: 'center',
                hAlign: 'center'})
            c.push(cards)
            out = '\n' + c.toString()
          } else if(el.is(soruceData)) {
            out = `${el.attr('type')}: ${el.attr('src')}`;
          } else if(el.is('[type=location]')) {
            const lat = el.find('lat')[0].children[0].data
            const long = el.find('long')[0].children[0].data
            out = `${el.attr('type')}: https://www.google.com/maps?q=${lat},${long}`;
          }
          let keyboard = ''
          if(el.find('reply').length > 0) {
            let kt = new Table({style: { head: [], border: [] }}) as Table.HorizontalTable
            let keys = el.find('reply')
              .map((i, e) => html(e).text() + '\n(' + html(e).attr('payload') + ')')
              .get()
            kt.push(keys)
            keyboard = '\n' + kt.toString()
          }
          if(out) return '  [bot]> ' + out + keyboard
        })
        .get()
      console.log(colors.magenta(outputs.join('\n')))
  }
}
