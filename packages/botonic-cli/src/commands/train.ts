import { Command, flags } from '@oclif/command'
import { track, getGlobalNodeModulesPath } from '../utils'
import * as colors from 'colors'
const path = require('path')

export default class Run extends Command {
  static description = 'Serve your bot in your localhost'

  static examples = [
    `$ botonic train
    TRAINING MODEL FOR {LANGUAGE}...
    `
  ]

  static flags = {
    lang: flags.string()
  }

  static args = []

  async run() {
    const { args, flags } = this.parse(Run)

    const globalNodeModulesPath = await getGlobalNodeModulesPath()
    const botonicNLUPath: string = path.join(
      globalNodeModulesPath,
      '@botonic',
      'nlu'
    )
    try {
      const { BotonicNLU, CONSTANTS } = await import(botonicNLUPath)
      process.argv.push(CONSTANTS.LANG_FLAG)
      if (flags.lang) {
        process.argv.push(flags.lang)
      }
      track('Trained with Botonic train')
      const botonicNLU = new BotonicNLU()
      const nluPath = path.join(process.cwd(), 'src', CONSTANTS.NLU_DIRNAME)
      await botonicNLU.train({ nluPath })
    } catch (e) {
      console.log(
        `You don't have @botonic/nlu installed.\nPlease, install it by typing the following command:`
          .red
      )
      console.log(`  $ npm install -g @botonic/nlu`)
    }
  }
}
