import { input, password } from '@inquirer/prompts'
import { Command, Flags } from '@oclif/core'

import { BotonicAPIService } from '../botonic-api-service.js'

export default class Login extends Command {
  static override args = {}
  static override description = 'Log in to Botonic'
  static override examples = []
  //TODO: Review path flag, currently not used
  static override flags = {
    path: Flags.string({
      char: 'p',
      description: 'Path to botonic project. Defaults to current dir.',
    }),
  }

  private botonicApiService: BotonicAPIService = new BotonicAPIService()

  public async run(): Promise<void> {
    const { flags } = await this.parse(Login)

    const userEmail = await input({ required: true, message: 'email:' })
    const userPassword = await password({ mask: true, message: 'password:' })

    await this.botonicApiService.login(userEmail, userPassword)
  }
}
