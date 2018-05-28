import { resolve } from 'path'
import { Command, flags } from '@oclif/command'

import { Botonic } from '../botonic'
import { track } from '../utils'

export default class Run extends Command {
  static description = 'Get response from a single input'

  static examples = [
    `$ botonic webview webview_hello"
Hello!
`,
  ]

  static flags = {
    path: flags.string({char: 'p', description: 'Path to botonic project. Defaults to current dir.'})
  }

  static args = [{name: 'webview_page', required: true}]

  private botonic: any

  async run() {
    track('botonic_webview')
    const {args, flags} = this.parse(Run)

    const path = flags.path? resolve(flags.path) : process.cwd()

    this.botonic = new Botonic(path)

    this.botonic.getWebview(args.webview_page).then((response: string) => {
      console.log(response)
    })
  }

}