import { resolve } from 'path'
import { Command, flags } from '@oclif/command'

import { Botonic } from '../botonic'
import { track } from '../utils'

export default class Run extends Command {
  static description = 'Get response from a single input'

  static examples = [
    `$ botonic input "{\\"type\\": \\"text\\", \\"data\\": \\"hi\\"}"
Hello!
`,
  ]

  static flags = {
    path: flags.string({char: 'p', description: 'Path to botonic project. Defaults to current dir.'})
  }

  static args = [{name: 'input', parse: JSON.parse}]

  private botonic: any

  async run() {
    track('botonic_input')
    const {args, flags} = this.parse(Run)

    const path = flags.path? resolve(flags.path) : process.cwd()

    this.botonic = new Botonic(path)

    this.botonic.processInput(args.input).then((response: string) => {
      console.log(response)
    })
  }

}