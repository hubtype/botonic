import { Command } from '@oclif/command'
import { resolve, join } from 'path'
import { copySync, moveSync } from 'fs-extra'
import { prompt } from 'inquirer'
import * as colors from 'colors'

import { BotonicAPIService } from '../botonicapiservice'
import { track } from '../utils'

import * as util from 'util'
import * as ora from 'ora'
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
    { name: 'name', description: 'name of the bot folder', required: true },
    {
      name: 'templateName',
      description: 'OPTIONAL name of the bot template',
      required: false,
    },
  ]
  //private templates: any = ['introduction_bot', 'basic_bot', 'basic_actions', 'AI_bot']
  private templates: any = [
    {
      name: 'tutorial',
      description:
        'Tutorial: A template with different examples that help you get started fast',
    },
    {
      name: 'blank',
      description: 'Blank: A minimal template to start from scratch',
    },
    {
      name: 'childs',
      description: 'Childs: Understand how childRoutes works',
    },
    {
      name: 'dynamic-carousel',
      description: 'Dynamic Carousel: See a dynamic carousel for Facebook',
    },
    {
      name: 'handoff',
      description:
        'Handoff: Test how to transfer a conversation into Hubtype Desk',
    },
    {
      name: 'intent',
      description: 'Intent: Integrate NLU and see the magic!',
    },
    {
      name: 'custom-webchat',
      description: 'Custom Webchat: See how it looks like a custom webchat',
    },
    {
      name: 'nlu',
      description: 'NLU: Train with your own intents with @botonic/plugin-nlu!',
    },
  ]

  private botonicApiService: BotonicAPIService = new BotonicAPIService()

  async run() {
    track('Created Botonic Bot CLI')
    const { args, flags } = this.parse(Run)
    let template = ''
    if (!args.templateName) {
      await this.selectBotName().then((resp: any) => {
        template = this.templates.filter(
          (t: any) => t.description === resp.botName
        )[0].name
      })
    } else {
      const botExists = this.templates.filter(
        (t: any) => t.name === args.templateName
      )
      if (botExists.length) {
        template = args.templateName
      } else {
        const template_names = this.templates.map((t: any) => t.name)
        console.log(
          colors.red(
            `Template ${args.templateName} does not exist, please choose one of ${template_names}.`
          )
        )
        return
      }
    }
    const botPath = resolve(template)
    const templatePath = join(__dirname, '..', '..', 'templates', template)
    let spinner = ora({
      text: 'Copying files...',
      spinner: 'bouncingBar',
    }).start()
    copySync(templatePath, args.name)
    spinner.succeed()
    process.chdir(args.name)
    spinner = ora({
      text: 'Installing dependencies...',
      spinner: 'bouncingBar',
    }).start()
    const dependencyCommand = `npm install`
    const dependency = await exec(dependencyCommand)
    spinner.succeed()
    await this.botonicApiService.buildIfChanged(false)
    this.botonicApiService.beforeExit()
    moveSync(join('..', '.botonic.json'), join(process.cwd(), '.botonic.json'))
    const cd_cmd = colors.bold(`cd ${args.name}`)
    const run_cmd = colors.bold('botonic serve')
    const deploy_cmd = colors.bold('botonic deploy')
    console.log(
      `\n✨  Bot ${colors.bold(
        args.name
      )} was successfully created!\n\nNext steps:\n${cd_cmd}\n${run_cmd} (test your bot locally from the browser)\n${deploy_cmd} (publish your bot to the world!)`
    )
  }

  async selectBotName() {
    return prompt([
      {
        type: 'list',
        name: 'botName',
        message: 'Select a bot template',
        choices: this.templates.map((t: any) => t.description),
      },
    ])
  }
}
