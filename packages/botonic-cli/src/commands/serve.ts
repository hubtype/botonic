import { Command } from '@oclif/command'
import colors from 'colors'

import { Telemetry } from '../analytics/telemetry'
import { spawnNpmScript } from '../util/system'

export default class Run extends Command {
  static description = 'Serve your bot in your localhost'

  static examples = [
    `$ botonic serve\n> Project is running at http://localhost:8080/`,
  ]

  static flags = {}

  static args = []

  private telemetry = new Telemetry()

  async run(): Promise<void> {
    this.telemetry.trackServe()
    try {
      console.log(colors.blue('\nServing Botonic...'))
      spawnNpmScript('start')
    } catch (e) {
      console.log(e)
    }
    return Promise.resolve()
  }
}
