import { Command, flags } from '@oclif/command'
import colors from 'colors'
import { existsSync } from 'fs'
import { join } from 'path'

import { Telemetry } from '../analytics/telemetry'
import { spawnNpmScript } from '../util/system'

enum TASKS {
  NER = 'ner',
  TEXT_CLASSIFICATION = 'text-classification',
}

export default class Run extends Command {
  static description = 'Train your bot with NLP'

  static examples = [
    `$ botonic train [--task=<${Object.values(TASKS).join('|')}>]
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
    const task = flags.task
    if (task) {
      this.runSpecificTask(task)
    } else {
      this.runAllTasks()
    }
  }

  private runAllTasks(): void {
    this.runNerTask()
    this.runTextClassificationTask()
  }

  private runSpecificTask(task: string): void {
    switch (task) {
      case TASKS.NER:
        this.runNerTask()
        break
      case TASKS.TEXT_CLASSIFICATION:
        this.runTextClassificationTask()
        break
      default:
        this.logInvalidTask(task)
        break
    }
  }

  private runNerTask(): void {
    const packageName = `plugin-${TASKS.NER}`
    if (this.isPackageInstalled(packageName)) {
      track(`Trained with Botonic train:${TASKS.NER}`)
      spawnNpmScript(`train:${TASKS.NER}`, () => `Finished training `)
    } else {
      this.logPackageNotInstalled(packageName)
    }
  }

  private runTextClassificationTask(): void {
    const packageName = `plugin-${TASKS.TEXT_CLASSIFICATION}`
    if (this.isPackageInstalled(packageName)) {
      track(`Trained with Botonic train:${TASKS.TEXT_CLASSIFICATION}`)
      spawnNpmScript(
        `train:${TASKS.TEXT_CLASSIFICATION}`,
        () => `Finished training `
      )
    } else {
      this.logPackageNotInstalled(packageName)
    }
  }

  private logInvalidTask(task: string): void {
    console.log(
      colors.red(
        `Unsupported task '${task}'. Available tasks: '${Object.values(
          TASKS
        ).join("', '")}'.`
      )
    )
  }

  private isPackageInstalled(packageName: string): boolean {
    const path = join(process.cwd(), 'node_modules', '@botonic', packageName)
    return existsSync(path)
  }

  private logPackageNotInstalled(packageName: string): void {
    console.log(
      colors.red(
        `Training process has been stopped because you don't have @botonic/${packageName} installed.\nPlease, install it with the following command:`
      )
    )
    console.log(`$ npm install @botonic/${packageName}`)
  }
}
