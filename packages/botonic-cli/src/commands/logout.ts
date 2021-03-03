import { Command, flags } from '@oclif/command'
import { resolve } from 'path'

import { Telemetry } from '../analytics/telemetry'
import { BotonicAPIService } from '../botonic-api-service'

export default class Run extends Command {
  static description = 'Log out of Botonic'

  static examples = []

  static flags = {
    path: flags.string({
      char: 'p',
      description: 'Path to botonic project. Defaults to current dir.',
    }),
  }

  static args = []

  private botonicApiService: BotonicAPIService = new BotonicAPIService()
  private telemetry = new Telemetry()

  async run(): Promise<void> {
    this.telemetry.trackLoggedOut()
    const { flags } = this.parse(Run)

    const _path = flags.path ? resolve(flags.path) : process.cwd()

    this.botonicApiService.logout()

    console.log('You have been log out!')
    return Promise.resolve()
  }
}
