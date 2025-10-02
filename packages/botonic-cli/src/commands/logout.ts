import { Command, flags } from '@oclif/command'

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

  async run(): Promise<void> {
    this.botonicApiService.logout()
    console.log('You have been log out!')
    return Promise.resolve()
  }
}
