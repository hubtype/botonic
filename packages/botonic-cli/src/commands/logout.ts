import { Command, flags } from '@oclif/command'
import { resolve } from 'path'

import { BotonicAPIService } from '../botonic-api-service'
import { track } from '../utils'

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

  run(): Promise<void> {
    track('Logged Out Botonic CLI')
    const { flags } = this.parse(Run)

    const _path = flags.path ? resolve(flags.path) : process.cwd()

    this.botonicApiService.logout()

    console.log('You have been log out!')
    return Promise.resolve()
  }
}
