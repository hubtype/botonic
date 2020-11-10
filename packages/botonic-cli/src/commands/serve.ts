import { Command } from '@oclif/command'
import colors from 'colors'

import { spawnNpmScript, track } from '../utils'

export default class Run extends Command {
  static description = 'Serve your bot in your localhost'

  static examples = [
    `$ botonic serve\n> Project is running at http://localhost:8080/`,
  ]

  static flags = {}

  static args = []

  run(): Promise<void> {
    track('Served Botonic CLI')
    this.parse(Run)
    try {
      console.log(colors.blue('\nServing Botonic...'))
      spawnNpmScript('start')
    } catch (e) {
      console.log(e)
    }
    return Promise.resolve()
  }
}
