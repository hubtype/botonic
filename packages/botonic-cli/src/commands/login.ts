import { Command, flags } from '@oclif/command'
// eslint-disable-next-line import/named
import { prompt } from 'inquirer'

import { BotonicAPIService } from '../botonic-api-service'

export default class Run extends Command {
  static description = 'Log in to Botonic'

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
    await this.logInUser()
  }

  askLoginInfo(): Promise<{ email: string; password: string }> {
    return prompt([
      { type: 'input', name: 'email', message: 'email:' },
      { type: 'password', name: 'password', mask: '*', message: 'password:' },
    ])
  }

  async logInUser(): Promise<void> {
    const userData = await this.askLoginInfo()
    await this.botonicApiService.login(userData.email, userData.password).then(
      () => {
        console.log('Successful log in!'.green)
        return
      },
      err => {
        console.log('Error: '.red, err.response.data.error_description.red)
      }
    )
  }
}
