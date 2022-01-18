import * as aws from '@pulumi/aws'
import * as pulumi from '@pulumi/pulumi'
import { existsSync } from 'fs'

import { REST_SERVER_ENDPOINT_PATH_NAME } from '../constants'
import { AWSComponentResource, AWSResourceOptions } from './aws-resource'
import { getManageConnectionsPolicy } from './policies'

export interface RestServerArgs {
  restServerLambdaPath: string
  environmentVariables: pulumi.Input<{
    [key: string]: pulumi.Input<string>
  }>
  inlinePolicies: pulumi.Input<
    pulumi.Input<aws.types.input.iam.RoleInlinePolicy>[]
  >
}
export class RestServer extends AWSComponentResource<RestServerArgs> {
  url: pulumi.Output<string>
  constructor(args: RestServerArgs, opts: AWSResourceOptions) {
    super('rest-api-server', args, opts)

    const { restServerLambdaPath } = args

    if (existsSync(restServerLambdaPath)) {
      const callerIdentity = aws.getCallerIdentity({ provider: opts.provider })
      const accountId = callerIdentity.then(identity => identity.accountId)
      // Give our Lambda access to the Dynamo DB table, CloudWatch Logs and Metrics.
      const lambdaFunctionRole = new aws.iam.Role(
        `${this.namePrefix}-rest-api-lambda-role`,
        {
          name: `${this.namePrefix}-rest-api-lambda-role`,
          assumeRolePolicy: aws.iam.assumeRolePolicyForPrincipal({
            Service: 'lambda.amazonaws.com',
          }),
          inlinePolicies: args.inlinePolicies,
        },
        { parent: this }
      )

      const lambdaFunctionRoleAttachmentExRole = new aws.iam.RolePolicyAttachment(
        `${this.namePrefix}-rest-api-execution-role`,
        {
          role: lambdaFunctionRole,
          policyArn: aws.iam.ManagedPolicy.AWSLambdaBasicExecutionRole,
        },
        { ...opts, parent: this }
      )

      // TODO: Do it more explicit with inline policy?
      const sqsExecutionRoleAttachment = new aws.iam.RolePolicyAttachment(
        `${this.namePrefix}-rest-api-sqs-execution-role`,
        {
          role: lambdaFunctionRole,
          policyArn: aws.iam.ManagedPolicy.AmazonSQSFullAccess,
        },
        { ...opts, parent: this }
      )

      console.log(
        `Syncing rest-server api lambda contents from local disk at`,
        restServerLambdaPath
      )
      const lambdaFunction = new aws.lambda.Function(
        `${this.namePrefix}-rest-api-lambda`,
        {
          name: `${this.namePrefix}-rest-api-lambda`,
          runtime: 'nodejs14.x',
          code: new pulumi.asset.AssetArchive({
            '.': new pulumi.asset.FileArchive(restServerLambdaPath),
          }),
          timeout: 6,
          handler: 'server.default',
          role: lambdaFunctionRole.arn,
          environment: { variables: args.environmentVariables },
        },
        { ...opts, parent: this }
      )

      const API_PATH_NAME = REST_SERVER_ENDPOINT_PATH_NAME // TODO: Make it configurable?

      // Create the Swagger spec for a proxy which forwards all HTTP requests through to the Lambda function.
      // eslint-disable-next-line no-inner-declarations
      function swaggerSpec(lambdaArn: string, region: string): string {
        const swaggerSpec = {
          swagger: '2.0',
          info: { title: API_PATH_NAME, version: '1.0' },
          paths: {
            '/': swaggerRouteHandler(lambdaArn, region),
            '/{proxy+}': swaggerRouteHandler(lambdaArn, region),
          },
        }
        return JSON.stringify(swaggerSpec)
      }

      // Create a single Swagger spec route handler for a Lambda function.

      // eslint-disable-next-line no-inner-declarations
      function swaggerRouteHandler(lambdaArn: string, region: string) {
        return {
          'x-amazon-apigateway-any-method': {
            'x-amazon-apigateway-integration': {
              uri: `arn:aws:apigateway:${region}:lambda:path/2015-03-31/functions/${lambdaArn}/invocations`,
              passthroughBehavior: 'when_no_match',
              httpMethod: 'POST',
              type: 'aws_proxy',
            },
          },
        }
      }

      // Create the API Gateway Rest API, using a swagger spec.
      const restApi = new aws.apigateway.RestApi(
        `${this.namePrefix}-rest-api`,
        {
          name: `${this.namePrefix}-rest-api`,
          body: pulumi
            .all([lambdaFunction.arn, this.provider.region])
            .apply(([lambdaArn, region]) => swaggerSpec(lambdaArn, region)),
          endpointConfiguration: {
            types: 'REGIONAL',
          },
        },
        { ...opts, parent: this }
      )

      const deployment = new aws.apigateway.Deployment(
        `${this.namePrefix}-rest-api-deployment`,
        {
          restApi: restApi,
          // Note: Set to empty to avoid creating an implicit stage, we'll create it explicitly below instead.
          stageName: '',
        },
        { ...opts, parent: this }
      )

      // Create a stage, which is an addressable instance of the Rest API. Set it to point at the latest deployment.
      const stage = new aws.apigateway.Stage(
        `${this.namePrefix}-rest-api-stage`,
        {
          restApi: restApi,
          deployment: deployment,
          stageName: API_PATH_NAME,
        },
        { ...opts, parent: this }
      )

      // Give permissions from API Gateway to invoke the Lambda
      const invokePermission = new aws.lambda.Permission(
        `${this.namePrefix}-api-lambda-permission`,
        {
          action: 'lambda:invokeFunction',
          function: lambdaFunction,
          principal: 'apigateway.amazonaws.com',
          sourceArn: pulumi.interpolate`${deployment.executionArn}*/*`,
        },
        { ...opts, parent: this }
      )
      this.url = pulumi.interpolate`${deployment.invokeUrl}${API_PATH_NAME}/`
      this.registerOutputs({ url: this.url })
    }
  }
}
