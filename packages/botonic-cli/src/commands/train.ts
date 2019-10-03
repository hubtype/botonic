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

    const botonicNLUPath: string = path.join(
      process.cwd(),
      'node_modules',
      '@botonic',
      'nlu'
    )

    try {
      var { BotonicNLU, CONSTANTS } = await import(botonicNLUPath)
    } catch (e) {
      console.log(
        `You don't have @botonic/nlu installed.\nPlease, install it by typing the following command:`
          .red
      )
      console.log(`  $ npm install @botonic/nlu`)
      return
    }
    track('Trained with Botonic train')
    const botonicNLU = new BotonicNLU(flags.lang && [flags.lang])
    const nluPath = path.join(process.cwd(), 'src', CONSTANTS.NLU_DIRNAME)
    console.log('Lets train')
    await botonicNLU.train({ nluPath })
  }
}
