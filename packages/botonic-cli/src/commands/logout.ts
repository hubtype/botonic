import { resolve } from 'path'
import { prompt } from 'inquirer'
import { Command, flags } from '@oclif/command'

import { BotonicAPIService } from '../botonicAPIService'
import { track } from '../utils'

export default class Run extends Command {
  static description = 'Log out of Botonic'

  static examples = []

  static flags = {
    path: flags.string({
      char: 'p',
      description: 'Path to botonic project. Defaults to current dir.'
    })
  }

  static args = []

  private botonicApiService: BotonicAPIService = new BotonicAPIService()

  async run() {
    track('botonic_log_in')
    const { args, flags } = this.parse(Run)

    const path = flags.path ? resolve(flags.path) : process.cwd()

    await this.botonicApiService.logout()

    console.log('You have been log out!')
  }
}
