import { Command, flags } from '@oclif/command'
import * as path from 'path'
import { track } from '../utils'

export default class Run extends Command {
  static description = 'Serve your bot in your localhost'

  static examples = [
    `$ botonic train
    TRAINING MODEL FOR {LANGUAGE}...
    `,
  ]

  static flags = {
    lang: flags.string(),
  }

  static args = []

  async run() {
    const { flags } = this.parse(Run)

    const botonicNLUPath: string = path.join(
      process.cwd(),
      'node_modules',
      '@botonic',
      'nlu'
    )
    let BotonicNLU, CONSTANTS
    try {
      const nluImport = await import(botonicNLUPath)
      BotonicNLU = nluImport.BotonicNLU
      CONSTANTS = nluImport.CONSTANTS
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
    await botonicNLU.train({ nluPath })
  }
}
