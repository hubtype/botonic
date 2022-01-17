import * as aws from '@pulumi/aws'
import * as pulumi from '@pulumi/pulumi'
import { join } from 'path'

import { BOT_EXECUTOR_LAMBDA_NAME, SENDER_LAMBDA_NAME } from '../constants'
import {
  getHandlersPath,
  getNlpModelsPath,
  getPathToWebchatContents,
  getRestServerPath,
  getWebsocketServerPath,
} from '../paths'
import { getProjectStackNamePrefix, ProgramConfig } from '../pulumi'
import { AWSProvider, getAwsProviderConfig } from '.'
import { DynamoDB } from './dynamodb'
import { NLPModelsBucket } from './nlp-models-bucket'
import { getDynamoDbCrudPolicy, getManageConnectionsPolicy } from './policies'
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

  // Get Botonic Environment variables coming from aws.config.js
  const configEnvironmentVariables =
    config.environmentVariables &&
    Object.keys(config.environmentVariables).length > 0
      ? config.environmentVariables
      : {}

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
      environmentVariables: {
        MODELS_BASE_URL: nlpModelsBucket.url,
        DATA_PROVIDER_URL: database.url,
        ...configEnvironmentVariables,
      },
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
        ...configEnvironmentVariables,
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
        ...configEnvironmentVariables,
      },
    },
    awsResourceOptions
  )

  const MANAGE_CONNECTIONS_POLICY = getManageConnectionsPolicy(
    awsProvider.region,
    accountId,
    websocketServer.apiGateway.id
  )

  const restServer = new RestServer(
    {
      restServerLambdaPath: getRestServerPath(workingDirectory),
      inlinePolicies: [
        {
          name: 'rest-api-dynamodb-crud-inline-policy',
          policy: DYNAMODB_CRUD_POLICY,
        },
        {
          name: 'rest-api-manage-connections-inline-policy',
          policy: MANAGE_CONNECTIONS_POLICY,
        },
      ],
      // @ts-ignore
      environmentVariables: {
        MODELS_BASE_URL: nlpModelsBucket.url,
        DATA_PROVIDER_URL: database.url,
        WEBSOCKET_URL: websocketServer.url,
        [`${SENDER_LAMBDA_NAME}_QUEUE_URL`]: sender.queueUrl,
        [`${BOT_EXECUTOR_LAMBDA_NAME}_QUEUE_URL`]: botExecutor.queueUrl,
        BOTONIC_JWT_SECRET:
          configEnvironmentVariables.BOTONIC_JWT_SECRET ||
          process.env.BOTONIC_JWT_SECRET, // make aws.config to have preference over local environment
        ...configEnvironmentVariables,
      },
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

export const deployFullStack = {
  backend: deployBackendStack,
  frontend: deployFrontendStack,
}
