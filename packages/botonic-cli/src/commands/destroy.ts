import { Command } from '@oclif/command'

import { Telemetry } from '../analytics/telemetry'
import { CLOUD_PROVIDERS } from '../constants'

export default class Run extends Command {
  static description = 'Destroy Botonic project from cloud provider'

  static examples = [
    `$ botonic destroy aws
Destroying AWS stack...
`,
  ]
  static flags = {}

  static args = [{ name: 'provider', options: Object.values(CLOUD_PROVIDERS) }]

  private telemetry = new Telemetry()

  /* istanbul ignore next */
  async run(): Promise<void> {
    const { args } = this.parse(Run)
    const provider: string = args.provider || CLOUD_PROVIDERS.HUBTYPE
    this.telemetry.trackDestroy1_0({ provider })
    console.log(`Destroying ${provider} stack...`)
    console.log('This can take a while, do not cancel this process.')

    if (provider === CLOUD_PROVIDERS.HUBTYPE) await this.destroyHubtype()
  }

  async destroyHubtype(): Promise<void> {
    // TODO: Implement logic to destroy Hubtype bots
  }
}
