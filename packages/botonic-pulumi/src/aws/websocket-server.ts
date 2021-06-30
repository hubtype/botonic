import * as aws from '@pulumi/aws'
import * as pulumi from '@pulumi/pulumi'
import { existsSync } from 'fs'

import { WEBSOCKET_ENDPOINT_PATH_NAME, WEBSOCKET_SERVER_PATH } from '..'
import {
  AWSComponentResource,
  AWSResourceOptions,
  WEBSOCKET_ONCONNECT_LAMBDA_NAME,
  WEBSOCKET_ONCONNECT_ROUTE_KEY,
  WEBSOCKET_ONDISCONNECT_LAMBDA_NAME,
  WEBSOCKET_ONDISCONNECT_ROUTE_KEY,
  WEBSOCKET_ONMESSAGE_LAMBDA_NAME,
  WEBSOCKET_ONMESSAGE_ROUTE_KEY,
} from '.'
import { DynamoDB } from './dynamodb'
import { NLPModelsBucket } from './nlp-models-bucket'
import { getDynamoDbCrudPolicy, getManageConnectionsPolicy } from './policies'
import {
  WebsocketServerLambda,
  WebSocketServerLambdaArgs,
} from './websocket-server-lambda'
export interface WebSocketServerArgs {
  database: DynamoDB
  nlpModelsBucket: NLPModelsBucket
  websocketLambdaPath?: string
}
export class WebSocketServer extends AWSComponentResource<WebSocketServerArgs> {
  endpoint: pulumi.Output<string>
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
        `${this.namePrefix}-api-gateway`,
        {
          name: `${this.namePrefix}-api-gateway`,
          protocolType: 'WEBSOCKET',
          routeSelectionExpression: '$request.body.action',
        },
        { ...opts, parent: this }
      )

      const DYNAMODB_CRUD_POLICY = getDynamoDbCrudPolicy(
        this.provider.region,
        accountId,
        args.database.table.name
      )

      const MANAGE_CONNECTIONS_POLICY = getManageConnectionsPolicy(
        this.provider.region,
        accountId,
        websocketApiGateway.id
      )

      const wsLambdaCommonArgs: Partial<WebSocketServerLambdaArgs> = {
        lambdaPath: websocketLambdaPath,
        apiId: websocketApiGateway.id,
        environmentVariables: {
          MODELS_BASE_URL: args.nlpModelsBucket.endpoint,
          DATA_PROVIDER_URL: args.database.endpoint,
        },
      }

      const lambdaAWSResourceOptions = {
        ...opts,
        parent: this,
        dependsOn: [...(opts.dependsOn as any), websocketApiGateway],
      }

      const onConnectLambda = new WebsocketServerLambda(
        {
          name: WEBSOCKET_ONCONNECT_LAMBDA_NAME,
          routeKey: WEBSOCKET_ONCONNECT_ROUTE_KEY,
          inlinePolicies: [
            {
              name: `${WEBSOCKET_ONCONNECT_LAMBDA_NAME}-dynamodb-crud-inline-policy`,
              policy: DYNAMODB_CRUD_POLICY,
            },
          ],
          ...wsLambdaCommonArgs,
        } as WebSocketServerLambdaArgs,
        lambdaAWSResourceOptions
      )

      const onMessageLambda = new WebsocketServerLambda(
        {
          name: WEBSOCKET_ONMESSAGE_LAMBDA_NAME,
          routeKey: WEBSOCKET_ONMESSAGE_ROUTE_KEY,
          inlinePolicies: [
            {
              policy: DYNAMODB_CRUD_POLICY,
              name: `${WEBSOCKET_ONMESSAGE_LAMBDA_NAME}-dynamodb-crud-inline-policy`,
            },
            {
              policy: MANAGE_CONNECTIONS_POLICY,
              name: `${WEBSOCKET_ONMESSAGE_LAMBDA_NAME}-manage-connections-inline-policy`,
            },
          ],
          ...wsLambdaCommonArgs,
        } as WebSocketServerLambdaArgs,
        lambdaAWSResourceOptions
      )

      const onDisconnectLambda = new WebsocketServerLambda(
        {
          name: WEBSOCKET_ONDISCONNECT_LAMBDA_NAME,
          routeKey: WEBSOCKET_ONDISCONNECT_ROUTE_KEY,
          inlinePolicies: [
            {
              policy: DYNAMODB_CRUD_POLICY,
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
            onMessageLambda.route,
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
      this.endpoint = pulumi.interpolate`${websocketApiGateway.apiEndpoint}/${prodStage.name}`
      this.apiGateway = websocketApiGateway
      this.registerOutputs({
        endpoint: this.endpoint,
        apiGateway: websocketApiGateway,
      })
    }
  }
}
