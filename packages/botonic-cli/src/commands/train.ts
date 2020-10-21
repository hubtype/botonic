import { Command, flags } from '@oclif/command'
import { spawn } from 'child_process'
import * as path from 'path'
import { track } from '../utils'

export default class Run extends Command {
  static description = 'Serve your bot in your localhost'

  static examples = [
    `$ botonic train
    TRAINING MODEL FOR {LANGUAGE}...
    `,
  ]

  static flags = {
    lang: flags.string(),
  }

  static args = []

  async run() {
    const botonicNLUPath: string = path.join(
      process.cwd(),
      'node_modules',
      '@botonic',
      'nlu'
    )
    try {
      await import(botonicNLUPath)
    } catch (e) {
      console.log(
        `You don't have @botonic/plugin-nlu installed.\nPlease, install it by typing the following command:`
          .red
      )
      console.log(`$ npm install @botonic/plugin-nlu`)
      return
    }
    track('Trained with Botonic train')
    const trainProcess = spawn('npm', ['run', 'train'])
    trainProcess.stdout.on('data', out => {
      process.stdout.write(out)
    })
    trainProcess.stderr.on('data', stderr => {
      console.log(`${stderr}`)
    })
    trainProcess.on('close', code => {
      console.log('Finished training')
      console.log(`Training process exited with code ${code}`)
    })
  }
}
