import {Command} from '@oclif/core'
import pc from 'picocolors'

import {spawnNpmScript} from '../util/system.js'

export default class Serve extends Command {
  static override args = {}
  static override description = 'Serve your bot in your localhost'
  static override examples = ['$ botonic serve\n> Project is running at http://localhost:8080/']
  static override flags = {}

  public async run(): Promise<void> {
    try {
      console.log(pc.blue('\nServing Botonic...'))
      spawnNpmScript('start')
    } catch (e) {
      console.log(e)
    }
    return Promise.resolve()
  }
}
