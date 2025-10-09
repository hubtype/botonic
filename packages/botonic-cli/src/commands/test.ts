import { Command } from '@oclif/command'
import { exec } from 'child_process'
import colors from 'colors'

export default class Run extends Command {
  static description = 'Test your Botonic components'

  static examples = [
    `PASS  tests/app.test.js
  ✓ TEST: hi.js (10ms)
  ✓ TEST: pizza.js (1ms)
  ✓ TEST: sausage.js (1ms)
  ✓ TEST: bacon.js
  ✓ TEST: pasta.js (1ms)
  ✓ TEST: cheese.js (1ms)
  ✓ TEST: tomato.js

Test Suites: 1 passed, 1 total
Tests:       7 passed, 7 total
Snapshots:   0 total
Time:        1.223s
Ran all test suites.`,
  ]

  static flags = {}

  static args = []

  async run(): Promise<void> {
    this.parse(Run)
    exec('npm run test', (error, _stdout, stderr) => {
      console.log(colors.blue('\n Executing tests...\n'))
      if (error) {
        console.error(colors.red(`${String(error)}`))
        return
      }
      console.log(colors.green(`${stderr}`))
    })
    return Promise.resolve()
  }
}
