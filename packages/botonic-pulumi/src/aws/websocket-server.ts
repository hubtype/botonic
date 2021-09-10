import * as aws from '@pulumi/aws'
import * as pulumi from '@pulumi/pulumi'
import { existsSync } from 'fs'

import { WEBSOCKET_ENDPOINT_PATH_NAME, WEBSOCKET_SERVER_PATH } from '..'
import { AWSComponentResource, AWSResourceOptions } from '.'
import { DynamoDB } from './dynamodb'
import { NLPModelsBucket } from './nlp-models-bucket'
import { getManageConnectionsPolicy } from './policies'
import {
  WebsocketServerLambda,
  WebSocketServerLambdaArgs,
} from './websocket-server-lambda'

export interface WebSocketServerArgs {
  database: DynamoDB
  nlpModelsBucket: NLPModelsBucket
  dynamodbCrudPolicy: pulumi.Input<string>
  websocketLambdaPath?: string
}
export class WebSocketServer extends AWSComponentResource<WebSocketServerArgs> {
  manageConnectionsPolicy: pulumi.Output<string>
  url: pulumi.Output<string>
  apiGateway: aws.apigatewayv2.Api
  constructor(args: WebSocketServerArgs, opts: AWSResourceOptions) {
    super('websocket-server', args, opts)

    const callerIdentity = aws.getCallerIdentity({ provider: opts.provider })
    const accountId = callerIdentity.then(identity => identity.accountId)
    const websocketLambdaPath =
      args.websocketLambdaPath || WEBSOCKET_SERVER_PATH

    // Check that path exists so pulumi do not throw an exception in runtime when previewing the update
    if (existsSync(websocketLambdaPath)) {
      const websocketApiGateway = new aws.apigatewayv2.Api(
        `${this.namePrefix}-ws-api`,
        {
          name: `${this.namePrefix}-ws-api`,
          protocolType: 'WEBSOCKET',
          routeSelectionExpression: '$request.body.action',
        },
        { ...opts, parent: this }
      )

      const MANAGE_CONNECTIONS_POLICY = getManageConnectionsPolicy(
        this.provider.region,
        accountId,
        websocketApiGateway.id
      )
      this.manageConnectionsPolicy = MANAGE_CONNECTIONS_POLICY

      const wsLambdaCommonArgs: Partial<WebSocketServerLambdaArgs> = {
        lambdaPath: websocketLambdaPath,
        apiId: websocketApiGateway.id,
        environmentVariables: {
          MODELS_BASE_URL: args.nlpModelsBucket.url,
          DATA_PROVIDER_URL: args.database.url,
        },
      }

      const lambdaAWSResourceOptions = {
        ...opts,
        parent: this,
        dependsOn: [...(opts.dependsOn as any), websocketApiGateway],
      }

      const WEBSOCKET_ONCONNECT_LAMBDA_NAME = 'onConnect'
      const onConnectLambda = new WebsocketServerLambda(
        {
          name: WEBSOCKET_ONCONNECT_LAMBDA_NAME,
          routeKey: '$connect',
          inlinePolicies: [
            {
              name: `${WEBSOCKET_ONCONNECT_LAMBDA_NAME}-dynamodb-crud-inline-policy`,
              policy: args.dynamodbCrudPolicy,
            },
          ],
          ...wsLambdaCommonArgs,
        } as WebSocketServerLambdaArgs,
        lambdaAWSResourceOptions
      )

      const WEBSOCKET_ONAUTH_LAMBDA_NAME = 'onAuth'
      const onAuthLambda = new WebsocketServerLambda(
        {
          name: WEBSOCKET_ONAUTH_LAMBDA_NAME,
          routeKey: '$default',
          inlinePolicies: [
            {
              policy: args.dynamodbCrudPolicy,
              name: `${WEBSOCKET_ONAUTH_LAMBDA_NAME}-dynamodb-crud-inline-policy`,
            },
            {
              policy: MANAGE_CONNECTIONS_POLICY,
              name: `${WEBSOCKET_ONAUTH_LAMBDA_NAME}-manage-connections-inline-policy`,
            },
          ],
          ...wsLambdaCommonArgs,
        } as WebSocketServerLambdaArgs,
        lambdaAWSResourceOptions
      )

      const WEBSOCKET_ONDISCONNECT_LAMBDA_NAME = 'onDisconnect'
      const onDisconnectLambda = new WebsocketServerLambda(
        {
          name: WEBSOCKET_ONDISCONNECT_LAMBDA_NAME,
          routeKey: '$disconnect',
          inlinePolicies: [
            {
              policy: args.dynamodbCrudPolicy,
              name: `${WEBSOCKET_ONDISCONNECT_LAMBDA_NAME}-dynamodb-crud-inline-policy`,
            },
          ],
          ...wsLambdaCommonArgs,
        } as WebSocketServerLambdaArgs,
        lambdaAWSResourceOptions
      )

      const deployment = new aws.apigatewayv2.Deployment(
        `${this.namePrefix}-api-gateway-deployment`,
        {
          apiId: websocketApiGateway.id,
        },
        {
          dependsOn: [
            ...(opts.dependsOn as any),
            onConnectLambda.route,
            onAuthLambda.route,
            onDisconnectLambda.route,
          ],
          parent: this,
        }
      )
      const prodStage = new aws.apigatewayv2.Stage(
        `${this.namePrefix}-stage`,
        {
          name: WEBSOCKET_ENDPOINT_PATH_NAME, // TODO: Make it configurable?
          deploymentId: deployment.id,
          apiId: websocketApiGateway.id,
        },
        { ...opts, parent: this }
      )
      this.url = pulumi.interpolate`${websocketApiGateway.apiEndpoint}/${prodStage.name}/`
      this.apiGateway = websocketApiGateway
      this.registerOutputs({
        url: this.url,
        apiGateway: websocketApiGateway,
        manageConnectionsPolicy: this.manageConnectionsPolicy,
      })
    }
  }
}
