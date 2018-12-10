import { resolve } from 'path'
import { Command, flags } from '@oclif/command'

import { Botonic } from '@botonic/core'
import { track } from '../utils'

export default class Run extends Command {
  static description = 'Get response from a single input'

  static examples = [
    `$ botonic input "{\\"type\\": \\"text\\", \\"data\\": \\"hi\\"}"
Hello!
`
  ]

  static flags = {
    path: flags.string({
      char: 'p',
      description: 'Path to botonic project. Defaults to current dir.'
    }),
    context: flags.string({
      char: 'c',
      description: 'Context of current session',
      parse: JSON.parse
    }),
    route: flags.string({
      char: 'r',
      description: 'Route of the current bot state.'
    })
  }

  static args = [{ name: 'input', parse: JSON.parse, required: true }]

  private botonic: any

  async run() {
    track('botonic_input')
    const { args, flags } = this.parse(Run)

    const path = flags.path ? resolve(flags.path) : process.cwd()
    const route = flags.route ? flags.route : ''
    const context = flags.context ? flags.context : ''

    this.botonic = new Botonic(path)

    this.botonic
      .processInput(args.input, route, context)
      .then((response: string) => {
        console.log(response)
      })
      .catch(err => {
        console.log('Error:', err)
      })
  }
}
