import { Command, flags } from '@oclif/command'
import colors from 'colors'
import * as path from 'path'

import { Telemetry } from '../analytics/telemetry'
import { spawnNpmScript } from '../util/processes'

export default class Run extends Command {
  static description = 'Train your bot with NLU'

  static examples = [
    `$ botonic train
    TRAINING MODEL FOR {LANGUAGE}...
    `,
  ]

  static flags = {
    lang: flags.string(),
  }

  static args = []

  private telemetry = new Telemetry()

  async run(): Promise<void> {
    this.telemetry.trackTrained()
    const botonicNLUPath: string = path.join(
      process.cwd(),
      'node_modules',
      '@botonic',
      'nlu'
    )
    try {
      await import(botonicNLUPath)
    } catch (e) {
      const error = String(e)
      this.telemetry.trackError(`Running botonic train: ${error}`)
      console.log(e)
      console.log(
        colors.red(
          `You don't have @botonic/plugin-nlu installed.\nPlease, install it with the following command:`
        )
      )
      console.log(`$ npm install @botonic/plugin-nlu`)
      return
    }
    spawnNpmScript('train', () => 'Finished training')
  }
}
