import { Command, flags } from '@oclif/command'
import { resolve } from 'path'
import { prompt } from 'inquirer'

import * as fs from 'fs'

import { track } from '../utils'

const util = require('util')
const exec = util.promisify(require('child_process').exec)

export default class Run extends Command {
  static description = 'Create a new Botonic project'

  static examples = [
    `$ botonic new test_bot
Creating...
  💫 test_bot was successfully created!
`,
  ]

  static args = [
    {name: 'name', description: 'name of the bot folder', required: true},
    {name: 'templateName', description: 'OPTIONAL name of the bot template', required: false},
  ]
  private botTemplates: any = ['introduction_bot', 'basic_bot', 'basic_actions', 'AI_bot']
  private botName: string = ""

  async run() {
    track('botonic_new');
    const {args, flags} = this.parse(Run)
    if(!args.templateName) {
      await this.selectBotName().then((resp:any) => {
        this.botName = resp.botName
      })
    } else {
      let botExists = this.botTemplates.filter((name:any) => name === args.templateName)[0]
      if(botExists){
        this.botName = args.templateName
      } else {
        console.log('There is no Template with this name'.red)
        return
      }
    }
    if(!fs.existsSync(args.name))
      fs.mkdir(args.name, err => { if (err) console.log(err) })
    let botPath = resolve(this.botName)
    let templatePath = `${__dirname.split('/src/')[0]}/templates/${this.botName}` //hardcored don't like it
    console.log('Copying all the files...')
    let copyFolderCommand = `cp -a ${templatePath}/* ${args.name}`
    let copy_out = await exec(copyFolderCommand)
    console.log('Installing all the dependencies...')
    let dependencyCommand = `cd ${args.name}; npm install`
    let dependency = await exec(dependencyCommand)
    console.log('Compiling your new bot...')
    let compileCommand = `cd ${args.name}; npm run build`;
    let compile = await exec(compileCommand)
    console.log('New bot created! Now test it with \'botonic run\', and then, deploy it with \'botonic deploy\'')

  }

  async selectBotName() {
    return prompt([{
      type: 'list',
      name: 'botName',
      message: 'You have to select a bot example.\nWhich one do you prefer?',
      choices: this.botTemplates
    }])
  }
}
