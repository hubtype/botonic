import * as aws from '@pulumi/aws'
import * as pulumi from '@pulumi/pulumi'
import { join } from 'path'

import {
  BOT_EXECUTOR_LAMBDA_NAME,
  getHandlersPath,
  getNlpModelsPath,
  getPathToWebchatContents,
  getProjectStackNamePrefix,
  getRestServerPath,
  getWebsocketServerPath,
  SENDER_LAMBDA_NAME,
} from '..'
import { ProgramConfig } from '../pulumi-runner'
import { AWSProvider, getAwsProviderConfig } from '.'
import { DynamoDB } from './dynamodb'
import { NLPModelsBucket } from './nlp-models-bucket'
import { getDynamoDbCrudPolicy } from './policies'
import { RestServer } from './rest-server'
import { SQSLambdaMapping } from './sqs-lambda-mapping'
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

  const workingDirectory = config.workingDirectory as string

  const nlpModelsBucket = new NLPModelsBucket(
    { nlpModelsPath: getNlpModelsPath(workingDirectory) },
    awsResourceOptions
  )

  const database = new DynamoDB(
    { tableName: config.tableName },
    awsResourceOptions
  )

  const callerIdentity = aws.getCallerIdentity({ provider: awsProvider })
  const accountId = callerIdentity.then(identity => identity.accountId)

  const DYNAMODB_CRUD_POLICY = getDynamoDbCrudPolicy(
    awsProvider.region,
    accountId,
    database.table.name
  )

  const websocketServer = new WebSocketServer(
    {
      websocketLambdaPath: getWebsocketServerPath(workingDirectory),
      database,
      nlpModelsBucket,
      dynamodbCrudPolicy: DYNAMODB_CRUD_POLICY,
    },
    {
      ...awsResourceOptions,
      dependsOn: [nlpModelsBucket, database],
    }
  )

  const senderLambdaPath = join(
    getHandlersPath(workingDirectory),
    SENDER_LAMBDA_NAME
  )
  const sender = new SQSLambdaMapping(
    {
      lambdaName: SENDER_LAMBDA_NAME,
      queueName: `${SENDER_LAMBDA_NAME}-queue`,
      sqsLambdaPath: senderLambdaPath,
      handler: 'index.default',
      inlinePolicies: [
        {
          name: `${SENDER_LAMBDA_NAME}-dynamodb-crud-inline-policy`,
          policy: DYNAMODB_CRUD_POLICY,
        },
        {
          name: `${SENDER_LAMBDA_NAME}-execute-connections`,
          policy: websocketServer.manageConnectionsPolicy,
        },
      ],
      environmentVariables: {
        WEBSOCKET_URL: websocketServer.url,
        DATA_PROVIDER_URL: database.url,
      },
    },
    awsResourceOptions
  )

  const botExecutorLambdaPath = join(
    getHandlersPath(workingDirectory),
    BOT_EXECUTOR_LAMBDA_NAME
  )
  const botExecutor = new SQSLambdaMapping(
    {
      lambdaName: BOT_EXECUTOR_LAMBDA_NAME,
      queueName: `${BOT_EXECUTOR_LAMBDA_NAME}-queue`,
      sqsLambdaPath: botExecutorLambdaPath,
      handler: 'index.default',
      inlinePolicies: [
        {
          name: `${BOT_EXECUTOR_LAMBDA_NAME}-dynamodb-crud-inline-policy`,
          policy: DYNAMODB_CRUD_POLICY,
        },
      ],
      environmentVariables: {
        DATA_PROVIDER_URL: database.url,
        [`${SENDER_LAMBDA_NAME}_QUEUE_URL`]: sender.queueUrl,
      },
    },
    awsResourceOptions
  )

  const restServer = new RestServer(
    {
      restServerLambdaPath: getRestServerPath(workingDirectory),
      nlpModelsBucket,
      database,
      dynamodbCrudPolicy: DYNAMODB_CRUD_POLICY,
      websocketServer,
      botExecutorQueueUrl: botExecutor.queueUrl,
      senderQueueUrl: sender.queueUrl,
    },
    awsResourceOptions
  )

  // return {
  //   nlpModelsUrl: pulumi.output('nlpModelsBucket.url'),
  //   websocketUrl: pulumi.output('websocketServer.url'),
  //   apiUrl: pulumi.output('restServer.url'),
  // }
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

  const workingDirectory = config.workingDirectory as string

  const staticWebchatContents = new StaticWebchatContents(
    {
      pathToWebchatContents: getPathToWebchatContents(workingDirectory),
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
