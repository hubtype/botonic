import {Command, Flags} from '@oclif/core'

import {BotonicAPIService} from '../botonic-api-service.js'

export default class Logout extends Command {
  static override args = {}
  static override description = 'Log out of Botonic'
  static override examples = []
  static override flags = {
    path: Flags.string({
      char: 'p',
      description: 'Path to botonic project. Defaults to current dir.',
    }),
  }

  private botonicApiService: BotonicAPIService = new BotonicAPIService()

  public async run(): Promise<void> {
    const {flags} = await this.parse(Logout)

    this.botonicApiService.logout()
    console.log('You have been log out!')
    return Promise.resolve()
  }
}
