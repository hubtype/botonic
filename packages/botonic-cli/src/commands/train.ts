import { Command, flags } from '@oclif/command'
import colors from 'colors'
import { existsSync } from 'fs'
import { join } from 'path'

import { Telemetry } from '../analytics/telemetry'
import { spawnNpmScript } from '../util/system'

class Task {
  constructor(readonly name: string) {}

  run(): void {
    if (this.isTaskPluginInstalled()) {
      track(`Trained with Botonic train:${this.name}`)
      spawnNpmScript(`train:${this.name}`, () => `Finished training `)
    } else {
      this.logTaskPluginNotInstalled()
    }
  }

  private isTaskPluginInstalled(): boolean {
    const path = join(
      process.cwd(),
      'node_modules',
      '@botonic',
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

const TASK_NAMES = ['ner', 'text-classification']

export default class Run extends Command {
  static description = 'Train your bot with NLP'

  static examples = [
    `$ botonic train [--task=<${TASK_NAMES.join('|')}>]
    TRAINING MODEL...
    `,
  ]

  static flags = {
    task: flags.string(),
  }

  static args = []

  private telemetry = new Telemetry()

  async run(): Promise<void> {
    const { flags } = this.parse(Run)
    flags.task ? this.runSpecificTask(flags.task) : this.runAllTasks()
  }

  private runAllTasks(): void {
    TASK_NAMES.forEach(name => new Task(name).run())
  }

  private runSpecificTask(taskName: string): void {
    if (this.isInvalidTask(taskName)) {
      this.logInvalidTask(taskName)
    } else {
      new Task(taskName).run()
    }
  }

  private isInvalidTask(taskName: string): boolean {
    return !TASK_NAMES.includes(taskName)
  }

  private logInvalidTask(task: string): void {
    console.error(
      colors.red(
        `Unsupported task '${task}'. Available tasks: '${Object.values(
          TASK_NAMES
        ).join("', '")}'.`
      )
    )
  }
}
