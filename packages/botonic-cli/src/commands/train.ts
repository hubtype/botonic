import { Command, flags } from '@oclif/command'
import colors from 'colors'
import { join } from 'path'

import { spawnNpmScript, track } from '../utils'

const DEFAULT_TASK = 'text-classification'
const TASKS = ['text-classification', 'ner']

export default class Run extends Command {
  static description = 'Train your bot with NLP'

  static examples = [
    `$ botonic train --task={${TASKS.join('|')}}
    TRAINING MODEL FOR {TASK}...
    `,
  ]

  static flags = {
    task: flags.string(),
  }

  static args = []

  async run(): Promise<void> {
    const { flags } = this.parse(Run)
    const task = flags.task ?? DEFAULT_TASK

    if (!TASKS.includes(task)) {
      console.log(
        colors.red(
          `Unsupported task '${task}'. Available tasks: '${TASKS.join(
            "', '"
          )}'.`
        )
      )
      return
    }

    const botonicNlpPath = join(
      process.cwd(),
      'node_modules',
      '@botonic',
      `nlp`
    )

    try {
      await import(botonicNlpPath)
    } catch (e) {
      console.log(e)
      console.log(
        colors.red(
          `You don't have @botonic/plugin-${task} installed.\nPlease, install it with the following command:`
        )
      )
      console.log(`$ npm install @botonic/plugin-${task}`)
      return
    }

    track('Trained with Botonic train')
    spawnNpmScript(
      `train:${flags.task ?? DEFAULT_TASK}`,
      () => `Finished training `
    )
  }
}
