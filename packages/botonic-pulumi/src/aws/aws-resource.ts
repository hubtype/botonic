import * as aws from '@pulumi/aws'
import * as pulumi from '@pulumi/pulumi'

import { getProjectStackNamePrefix } from '../pulumi'

export type AWSProvider = aws.Provider & { region: pulumi.Output<aws.Region> }

export interface AWSResourceOptions extends pulumi.CustomResourceOptions {
  provider: AWSProvider
}

export class AWSComponentResource<
  ComponentArgs
> extends pulumi.ComponentResource {
  namePrefix: string
  provider: AWSProvider
  constructor(type: string, args: ComponentArgs, opts: AWSResourceOptions) {
    super(type, `${getProjectStackNamePrefix()}-${type}`, args, opts)
    this.provider = opts.provider
    this.namePrefix = getProjectStackNamePrefix()
  }
}

export const getAwsProviderConfig = (): aws.ProviderArgs => {
  const awsConfig = new pulumi.Config('aws')
  return {
    region: awsConfig.get('region') as aws.Region,
    profile: awsConfig.get('profile'),
    accessKey: awsConfig.get('accesKey'),
    secretKey: awsConfig.get('secretKey'),
    token: awsConfig.get('token'),
  }
}
