import { Command, flags } from '@oclif/command'
import colors from 'colors'
import { existsSync } from 'fs'
import { join } from 'path'

import { Telemetry } from '../analytics/telemetry'
import { BOTONIC_NPM_NAMESPACE, BOTONIC_PROJECT_PATH } from '../constants'
import { spawnNpmScript } from '../util/system'

class Task {
  constructor(readonly name: string) {}

  run(): void {
    if (this.isTaskPluginInstalled()) {
      spawnNpmScript(`train:${this.name}`, () => `Finished training `)
    } else {
      this.logTaskPluginNotInstalled()
    }
  }

  private isTaskPluginInstalled(): boolean {
    const path = join(
      BOTONIC_PROJECT_PATH,
      'node_modules',
      BOTONIC_NPM_NAMESPACE,
      `plugin-${this.name}`
    )
    return existsSync(path)
  }

  private logTaskPluginNotInstalled(): void {
    console.error(
      colors.red(
        `Training process has been stopped because you don't have @botonic/plugin-${this.name} installed.\nPlease, install it with the following command:`
      )
    )
    console.log(colors.bold(`$ npm install @botonic/plugin-${this.name}`))
  }
}

class Tasks {
  static tasks = {
    ner: new Task('ner'),
    'text-classification': new Task('text-classification'),
  }

  static getByName(taskName: string): Task {
    if (this.isInvalidTask(taskName)) {
      throw new Error(this.getInvalidTaskMessage(taskName))
    }
    return this.tasks[taskName]
  }

  private static isInvalidTask(taskName: string): boolean {
    return !Object.keys(this.tasks).includes(taskName)
  }

  private static getInvalidTaskMessage(taskName: string): string {
    return `Unsupported task '${taskName}'. Available tasks: '${Object.keys(
      this.tasks
    ).join("', '")}'.`
  }
}

export default class Run extends Command {
  static description = 'Train your bot with NLP'

  static examples = [
    `$ botonic train [--task=<${Object.keys(Tasks.tasks).join('|')}>]
    TRAINING MODEL...
    `,
  ]

  static flags = {
    task: flags.string(),
  }

  static args = []

  private telemetry = new Telemetry()

  async run(): Promise<void> {
    try {
      this.telemetry.trackTrain()
      const { flags } = this.parse(Run)
      const tasks = this.getTasks(flags.task)
      tasks.forEach(task => task.run())
    } catch (e) {
      console.error(e)
    }
  }

  private getTasks(taskName: string | undefined): Task[] {
    return taskName ? [Tasks.getByName(taskName)] : Object.values(Tasks.tasks)
  }
}
