import * as aws from '@pulumi/aws'
import * as pulumi from '@pulumi/pulumi'

import { getNamePrefix } from '..'

// DynamoDB
export const DYNAMODB_TABLE_NAME = 'user_events'

// Websocket Server
export const WEBSOCKET_LAMBDA_HANDLER_NAME = 'server.default'
export const WEBSOCKET_ONCONNECT_LAMBDA_NAME = 'onConnect'
export const WEBSOCKET_ONCONNECT_ROUTE_KEY = '$connect'
export const WEBSOCKET_ONMESSAGE_LAMBDA_NAME = 'onMessage'
export const WEBSOCKET_ONMESSAGE_ROUTE_KEY = '$default'
export const WEBSOCKET_ONDISCONNECT_LAMBDA_NAME = 'onDisconnect'
export const WEBSOCKET_ONDISCONNECT_ROUTE_KEY = '$disconnect'

// Rest Server
export const REST_SERVER_LAMBDA_HANDLER_NAME = 'server.default'

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
    super(type, `${getNamePrefix()}-${type}`, args, opts)
    this.provider = opts.provider
    this.namePrefix = getNamePrefix()
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
