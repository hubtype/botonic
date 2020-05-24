import { Command } from '@oclif/command'

import { track } from '../utils'
import colors from 'colors'

import { spawn } from 'child_process'

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
      const serve = spawn('npm', ['run', 'start'])
      console.log(colors.blue('\nServing Botonic...'))
      serve.stdout.on('data', out => {
        console.log(`${out}`)
      })
      serve.stderr.on('data', stderr => {
        console.log(colors.red(`${stderr}`))
      })
      serve.on('close', code => {
        console.log(colors.red(`child process exited with code ${code}`))
      })
    } catch (e) {
      console.log(e)
    }
    return Promise.resolve()
  }
}
