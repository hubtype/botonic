import { Command, flags } from '@oclif/command'
import * as fs from 'fs'

import { track } from '../utils'

export default class Run extends Command {
  static description = 'Create a new Botonic project'

  static examples = [
    `$ botonic new test_bot
Creating...
  💫 test_bot was successfully created!
`,
  ]

  static args = [{name: 'bot_name'}]

  async run() {
    track('botonic_new');
    const {args, flags} = this.parse(Run)
    fs.mkdir(args.bot_name, err => { if (err) console.log(err) });
  }
}