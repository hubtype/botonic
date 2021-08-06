import * as aws from '@pulumi/aws'
import * as pulumi from '@pulumi/pulumi'

import { getProjectStackNamePrefix } from '..'
import { ProgramConfig } from '../pulumi-runner'
import { AWSProvider, getAwsProviderConfig } from '.'
import { DynamoDB } from './dynamodb'
import { NLPModelsBucket } from './nlp-models-bucket'
import { RestServer } from './rest-server'
import { StaticWebchatContents } from './static-webchat-contents'
import { WebSocketServer } from './websocket-server'

interface BackendDeployResults {
  nlpModelsUrl: pulumi.Output<string>
  websocketUrl: pulumi.Output<string>
  apiUrl: pulumi.Output<string>
}

export const deployBackendStack = async (
  config: ProgramConfig
): Promise<BackendDeployResults> => {
  const awsProvider = new aws.Provider(
    `${getProjectStackNamePrefix()}-aws-provider`,
    {
      ...getAwsProviderConfig(),
      defaultTags: { tags: config.tags || {} },
    }
  ) as AWSProvider
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
    nlpModelsUrl: nlpModelsBucket.url,
    websocketUrl: websocketServer.url,
    apiUrl: restServer.url,
  }
}

interface FrontendDeployResults {
  nlpModelsUrl: pulumi.Output<string>
  websocketUrl: pulumi.Output<string>
  apiUrl: pulumi.Output<string>
  webchatUrl: pulumi.Output<string>
  cloudfrontId: pulumi.Output<string>
}

export const deployFrontendStack = async (
  config: ProgramConfig
): Promise<FrontendDeployResults> => {
  const awsProvider = new aws.Provider(
    `${getProjectStackNamePrefix()}-aws-provider`,
    {
      ...getAwsProviderConfig(),
      defaultTags: { tags: config.tags || {} },
    }
  ) as AWSProvider
  const awsResourceOptions = { provider: awsProvider, parent: awsProvider }

  const staticWebchatContents = new StaticWebchatContents(
    {
      customDomain: config.customDomain,
      nlpModelsUrl: config.nlpModelsUrl,
      apiUrl: config.apiUrl,
      websocketUrl: config.websocketUrl,
    },
    awsResourceOptions
  )
  return {
    nlpModelsUrl: staticWebchatContents.nlpModelsUrl,
    websocketUrl: staticWebchatContents.websocketUrl,
    apiUrl: staticWebchatContents.apiUrl,
    webchatUrl: staticWebchatContents.webchatUrl,
    cloudfrontId: staticWebchatContents.cloudfrontId,
  }
}
