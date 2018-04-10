import { Command, flags } from '@oclif/command'
import chalk from 'chalk'

import { track } from '../utils'

export default class Run extends Command {
  static description = 'Deploy Botonic project to botonic.io cloud'

  static examples = [
    `$ botonic deploy
Deploying...
  🚀 test_bot was successfully deployed!
`,
  ]

  static args = [{name: 'bot_name'}]

  async run() {
    track('botonic_deploy')
    const c = chalk.hex('#DEADED')
    console.log(c('Hey there, thanks for giving ')
      + c.bold('Botonic')
      + c(' a try!'))
    console.log("We're still developing the first version of Botonic, which is not available yet.")
    console.log("\nWould you like to contribute or send some feedback?\nJust drop us an email at " + chalk.bold("hi@botonic.io"));
  }
}