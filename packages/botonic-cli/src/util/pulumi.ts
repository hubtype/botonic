import {
  ProjectConfig,
  PulumiConfig,
  PulumiCoordinator,
  PulumiDownloader,
  PulumiLocalAuthenticator,
} from '@botonic/pulumi/lib/pulumi'
import { join } from 'path'
import { cwd } from 'process'

import { PATH_TO_AWS_CONFIG } from '../constants'
import { getHomeDirectory } from './file-system'

export const PULUMI_INSTALLATION_PATH = join(getHomeDirectory(), '.botonic')
export const PULUMI_HOME = join(getHomeDirectory(), '.botonic', 'pulumi')
export const PULUMI_WORKING_DIRECTORY = cwd()
export const PULUMI_CREDENTIALS_PATH = join(getHomeDirectory(), '.pulumi')

export async function getPulumiCoordinatorInstance(): Promise<PulumiCoordinator> {
  const pulumiDownloader = new PulumiDownloader(PULUMI_INSTALLATION_PATH)
  const pulumiAuthenticator = new PulumiLocalAuthenticator()

  const pulumiConfig: PulumiConfig = {
    pulumiHome: PULUMI_HOME,
    pulumiCredentialsPath: PULUMI_CREDENTIALS_PATH,
    pulumiAccessToken: '',
    pulumiConfigPassphrase: '',
  }
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const projectConfig: ProjectConfig = require(PATH_TO_AWS_CONFIG).default
  projectConfig.workingDirectory = PULUMI_WORKING_DIRECTORY

  const pulumiCoordinator = new PulumiCoordinator(
    pulumiConfig,
    projectConfig,
    pulumiDownloader,
    pulumiAuthenticator
  )
  await pulumiCoordinator.init()
  return pulumiCoordinator
}
