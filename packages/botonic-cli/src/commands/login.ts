import { resolve } from 'path'
import { prompt } from 'inquirer'
import { Command, flags } from '@oclif/command'

import { BotonicAPIService } from '../botonicAPIService'
import { track } from '../utils'

export default class Run extends Command {
  static description = 'Log in to Botonic'

  static examples = []

  static flags = {
    path: flags.string({char: 'p', description: 'Path to botonic project. Defaults to current dir.'})
  }

  static args = []

  private botonicApiService: BotonicAPIService = new BotonicAPIService()

  async run() {
    track('botonic_log_in')
    const {args, flags} = this.parse(Run)

    const path = flags.path? resolve(flags.path) : process.cwd()

    await this.logInUser()
  }

  askLoginInfo() {
    return prompt([{
        type: 'input',
        name: 'email',
        message: 'email:'
      },
      {
        type: 'password',
        name: 'password',
        mask: '*',
        message: 'password:'
      }])
  }

  async logInUser() {
    let user_data:any = await this.askLoginInfo()
    this.botonicApiService.login(user_data.email, user_data.password)
      .then((resp)=> {
        if(resp.data.campaign && resp.data.campaign.mixpanel_id)
          this.botonicApiService.setMixpanelInfo(resp.data.campaign.mixpanel_id)
        this.botonicApiService.saveGlobalCredentials()
        console.log('Successful log in!'.green)
      },
      (err) => {
        console.log('Error: '.red, err.response.data.error_description.red)
      })
    
  }

}