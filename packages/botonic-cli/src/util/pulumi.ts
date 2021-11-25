import { PulumiAuthenticator } from '@botonic/pulumi/lib/pulumi/pulumi-authenticator'
import { PulumiDownloader } from '@botonic/pulumi/lib/pulumi-downloader'
import { ProjectConfig, PulumiRunner } from '@botonic/pulumi/lib/pulumi-runner'
import { execSync } from 'child_process'
import { join } from 'path'
import { env } from 'process'

import { PATH_TO_AWS_CONFIG } from '../constants'
import { getHomeDirectory } from './file-system'

class PulumiLocalAuthenticator implements PulumiAuthenticator {
  binary: string
  constructor(binary: string) {
    this.binary = binary
  }
  doLogin(): void {
    env.PULUMI_ACCESS_TOKEN = ''
    env.PULUMI_CREDENTIALS_PATH = join(getHomeDirectory(), '.pulumi')
    console.log('Logging in locally...')
    execSync(`${this.binary} login --local --non-interactive`)
  }
}

export async function getPulumiRunnerInstance(): Promise<PulumiRunner> {
  const pulumiDownloader = new PulumiDownloader(
    join(getHomeDirectory(), '.botonic')
  )
  env.PULUMI_HOME = join(getHomeDirectory(), '.botonic', 'pulumi')
  const {
    binaryPath,
    binary,
  } = await pulumiDownloader.downloadBinaryIfNotInstalled()
  new PulumiLocalAuthenticator(binary).doLogin()
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const projectConfig: ProjectConfig = require(PATH_TO_AWS_CONFIG).default
  return new PulumiRunner(projectConfig, [], binaryPath)
}
