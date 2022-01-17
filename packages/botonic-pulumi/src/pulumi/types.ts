import concurrently from 'concurrently'

export interface AWSCredentials {
  region?: string
  profile?: string
  accessKey?: string
  secretKey?: string
  token?: string
}

export interface ProjectConfig extends AWSCredentials {
  workingDirectory?: string
  environmentVariables?: Record<string, string>
  projectName?: string
  stackName?: string
  customDomain?: string
  tags?: Record<string, string>
  // DynamoDB
  tableName?: string
}

export interface ProgramConfig extends ProjectConfig {
  nlpModelsUrl: string
  websocketUrl: string
  apiUrl: string
}

export interface PulumiConfig {
  pulumiAccessToken: string // needed to run Pulumi Automation API in seamless mode
  pulumiCredentialsPath: string // path where credentials will be stored, needs to be defined in order to run login operations
  pulumiHome: string // path where workspaces and plugins will be saved, needed for the proper execution
  pulumiConfigPassphrase: string
  pulumiVersion?: string
  awsPluginVersion?: string
}

export type BuildCommand = concurrently.CommandObj | string
