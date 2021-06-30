import * as aws from '@pulumi/aws'
import * as pulumi from '@pulumi/pulumi'

import { getNamePrefix } from '..'
import { ProgramConfig } from '../pulumi-runner'
import { AWSProvider, getAwsProviderConfig } from '.'
import { DynamoDB } from './dynamodb'
import { NLPModelsBucket } from './nlp-models-bucket'
import { RestServer } from './rest-server'
import { StaticWebchatContents } from './static-webchat-contents'
import { WebSocketServer } from './websocket-server'

interface BackendDeployResults {
  nlpModelsBucketEndpoint: pulumi.Output<string>
  databaseEndpoint: pulumi.Output<string>
  websocketServerEndpoint: pulumi.Output<string>
  restServerEndpoint: pulumi.Output<string>
}

export const deployBackendStack = async (
  config: ProgramConfig
): Promise<BackendDeployResults> => {
  const awsProvider = new aws.Provider(`${getNamePrefix()}-aws-provider`, {
    ...getAwsProviderConfig(),
    defaultTags: { tags: config.tags || {} },
  }) as AWSProvider
  const awsResourceOptions = { provider: awsProvider, parent: awsProvider }

  const nlpModelsBucket = new NLPModelsBucket({}, awsResourceOptions)

  const database = new DynamoDB(
    { tableName: config.tableName },
    awsResourceOptions
  )

  const websocketServer = new WebSocketServer(
    { database, nlpModelsBucket },
    {
      ...awsResourceOptions,
      dependsOn: [nlpModelsBucket, database],
    }
  )

  const restServer = new RestServer(
    {
      nlpModelsBucket,
      database,
      websocketServer,
    },
    awsResourceOptions
  )

  return {
    nlpModelsBucketEndpoint: nlpModelsBucket.endpoint,
    databaseEndpoint: database.endpoint,
    websocketServerEndpoint: websocketServer.endpoint,
    restServerEndpoint: restServer.endpoint,
  }
}

interface FrontendDeployResults {
  cloudFrontDomainEndpoint: pulumi.Output<string>
}

export const deployFrontendStack = async (
  config: ProgramConfig
): Promise<FrontendDeployResults> => {
  const awsProvider = new aws.Provider(`${getNamePrefix()}-aws-provider`, {
    ...getAwsProviderConfig(),
    defaultTags: { tags: config.tags || {} },
  }) as AWSProvider
  const awsResourceOptions = { provider: awsProvider, parent: awsProvider }

  const staticWebchatContents = new StaticWebchatContents(
    {
      customDomain: config.customDomain,
      nlpModelsBucketEndpoint: config.nlpModelsBucketEndpoint,
      restServerEndpoint: config.restServerEndpoint,
      websocketServerEndpoint: config.websocketServerEndpoint,
    },
    awsResourceOptions
  )
  return {
    cloudFrontDomainEndpoint: staticWebchatContents.cloudFrontDomainEndpoint,
  }
}
