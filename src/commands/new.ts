import { Command, flags } from '@oclif/command'
import { resolve } from 'path'
import { prompt } from 'inquirer'
import * as colors from 'colors'

import * as fs from 'fs'

import { BotonicAPIService } from '../botonic'
import { track } from '../utils'

const util = require('util')
const ora = require('ora')
const exec = util.promisify(require('child_process').exec)

export default class Run extends Command {
  static description = 'Create a new Botonic project'

  static examples = [
    `$ botonic new test_bot
Creating...
✨ test_bot was successfully created!
`,
  ]

  static args = [
    {name: 'name', description: 'name of the bot folder', required: true},
    {name: 'templateName', description: 'OPTIONAL name of the bot template', required: false},
  ]
  //private templates: any = ['introduction_bot', 'basic_bot', 'basic_actions', 'AI_bot']
  private templates: any = [{
    name: 'tutorial',
    description: 'Tutorial: A template with different examples that help you get started fast'
  },{
    name: 'blank',
    description: 'Blank: A minimal template to start from scratch'
  }]

  private botonicApiService: BotonicAPIService = new BotonicAPIService()

  async run() {
    track('botonic_new');
    const {args, flags} = this.parse(Run)
    let template = ''
    if(!args.templateName) {
      await this.selectBotName().then((resp:any) => {
        template = this.templates.filter((t:any) => t.description === resp.botName)[0].name
      })
    } else {
      let botExists = this.templates.filter((t:any) => t.name === args.templateName)
      if(botExists.length) {
        template = args.templateName
      } else {
        let template_names = this.templates.map((t: any) => t.name)
        console.log('Template ${args.templateName} does not exist, please choose one of ${template_names}.'.red)
        return
      }
    }
    let botPath = resolve(template)
    let templatePath = `${__dirname}/../../templates/${template}`
    let spinner = new ora({
      text: 'Copying files...',
      spinner: 'bouncingBar'
    }).start()
    let copyFolderCommand = `cp -r ${templatePath} ${args.name}`
    let copy_out = await exec(copyFolderCommand)
    spinner.succeed()
    process.chdir(args.name)
    spinner = new ora({
      text: 'Installing dependencies...',
      spinner: 'bouncingBar'
    }).start()
    let dependencyCommand = `npm install`
    let dependency = await exec(dependencyCommand)
    spinner.succeed()
    await this.botonicApiService.buildIfChanged()
    this.botonicApiService.beforeExit()
    await exec('mv ../.botonic.json .')
    let cd_cmd = `cd ${args.name.bold}`.bold
    let run_cmd = 'botonic run'.bold
    let deploy_cmd = 'botonic deploy'.bold
    console.log(`\n✨  Bot ${args.name.bold} was successfully created!\n\nNext steps:\n${cd_cmd}\n${run_cmd} (test your bot on your terminal)\n${deploy_cmd} (publish your bot to the world!)`)
  }

  async selectBotName() {
    return prompt([{
      type: 'list',
      name: 'botName',
      message: 'Select a bot template',
      choices: this.templates.map((t: any) => t.description)
    }])
  }
}
