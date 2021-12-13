import { Config } from '@pulumi/pulumi'

import { MAX_PROJECT_NAME_LENGTH, PROJECT_NAME_SEPARATOR } from './constants'

export function getProjectStackNamePrefix(): string {
  const config = new Config()
  return generateProjectStackNamePrefix(
    config.get('projectName') as string,
    config.get('stackName') as string
  )
}

export function generateProjectStackNamePrefix(
  projectName: string,
  stackName: string
): string {
  const prefix = `${projectName}${PROJECT_NAME_SEPARATOR}${stackName}`
  if (prefix.length > MAX_PROJECT_NAME_LENGTH + PROJECT_NAME_SEPARATOR.length) {
    throw new Error(
      `Provided projectName "${projectName}" and stackName "${stackName}" that combined exceed the max allowed length: ${
        prefix.length - PROJECT_NAME_SEPARATOR.length
      } / ${MAX_PROJECT_NAME_LENGTH}`
    )
  }
  return prefix
}
