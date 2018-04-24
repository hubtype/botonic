import { Command, flags } from '@oclif/command'
import { resolve } from 'path'
import { prompt } from 'inquirer'
import * as colors from 'colors'

import * as fs from 'fs'

import { track } from '../utils'

const util = require('util')
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
    if(!fs.existsSync(args.name))
      fs.mkdir(args.name, err => { if (err) console.log(err) })
    let botPath = resolve(template)
    let templatePath = `${__dirname}/../../templates/${template}`
    console.log('Copying files...')
    let copyFolderCommand = `cp -a ${templatePath}/* ${args.name}`
    let copy_out = await exec(copyFolderCommand)
    console.log('Installing dependencies...')
    let dependencyCommand = `cd ${args.name}; npm install`
    let dependency = await exec(dependencyCommand)
    console.log('Compiling...')
    let compileCommand = `cd ${args.name}; npm run build`;
    let compile = await exec(compileCommand)
    let run_cmd = 'botonic run'.bold
    let deploy_cmd = 'botonic deploy'.bold
    console.log(`✨ ${args.name.bold} was successfully created!\nNow test it with ${run_cmd}, and then, deploy it with ${deploy_cmd}`)

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
