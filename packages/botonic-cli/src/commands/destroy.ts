import { PulumiRunner } from '@botonic/pulumi/lib/pulumi-runner'
import { Command } from '@oclif/command'

import { Telemetry } from '../analytics/telemetry'
import { CLOUD_PROVIDERS, PATH_TO_AWS_CONFIG } from '../constants'

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
    const provider = args.provider
    if (provider) {
      this.destroyProvider(provider)
    }
  }

  async destroyProvider(provider: string): Promise<void> {
    this.telemetry.trackDeploy({ provider })
    if (provider === CLOUD_PROVIDERS.AWS) {
      console.log(`Destroying ${CLOUD_PROVIDERS.AWS} stack...`)
      console.log('This can take a while, do not cancel this process.')
      this.telemetry.trackDestroy1_0({ provider })
      try {
        const pulumiRunner = new PulumiRunner(PATH_TO_AWS_CONFIG)
        await pulumiRunner.destroy()
      } catch (e) {
        const error = `Destroy Botonic 1.0 ${provider} Error: ${String(e)}`
        this.telemetry.trackError(error)
        throw new Error(e)
      }
    }
  }
}
