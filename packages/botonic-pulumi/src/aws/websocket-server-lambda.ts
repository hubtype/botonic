import * as aws from '@pulumi/aws'
import * as pulumi from '@pulumi/pulumi'

import { AWSComponentResource, AWSResourceOptions } from './aws-resource'

export interface WebSocketServerLambdaArgs {
  name: string
  routeKey: string
  lambdaPath: string
  apiId: pulumi.Output<string>
  environmentVariables: pulumi.Input<{
    [key: string]: pulumi.Input<string>
  }>
  inlinePolicies: pulumi.Input<
    pulumi.Input<aws.types.input.iam.RoleInlinePolicy>[]
  >
}

export class WebsocketServerLambda extends AWSComponentResource<WebSocketServerLambdaArgs> {
  route: aws.apigatewayv2.Route

  constructor(args: WebSocketServerLambdaArgs, opts: AWSResourceOptions) {
    super(`websocket-server-lambda-${args.name}`, args, opts)
    const defaultLambdaSettings: Partial<aws.lambda.FunctionArgs> = {
      code: new pulumi.asset.AssetArchive({
        '.': new pulumi.asset.FileArchive(args.lambdaPath),
      }),
      runtime: 'nodejs14.x',
      memorySize: 256,
      environment: {
        variables: args.environmentVariables,
      },
      timeout: 6, // Increased timeout from 3s -> 6s to give enough time to nlp models to be loaded, TODO: make it dynamic?
    }
    const assumeRolePolicy = aws.iam.assumeRolePolicyForPrincipal({
      Service: 'lambda.amazonaws.com',
    })

    const lambdaFunctionRole = new aws.iam.Role(
      `${this.namePrefix}-${args.name}-function-role`,
      {
        name: `${this.namePrefix}-${args.name}-function-role`,
        assumeRolePolicy,
        inlinePolicies: args.inlinePolicies,
      },
      { ...opts, parent: this }
    )

    const lambdaFunctionRoleAttachmentExRole = new aws.iam.RolePolicyAttachment(
      `${this.namePrefix}-${args.name}-execution-role`,
      {
        role: lambdaFunctionRole,
        policyArn: aws.iam.ManagedPolicy.AWSLambdaBasicExecutionRole,
      },
      { ...opts, parent: this }
    )

    console.log(
      `Syncing ${args.name} lambda contents from local disk at`,
      args.lambdaPath
    )
    const lambdaFunction = new aws.lambda.Function(
      `${this.namePrefix}-${args.name}-lambda-function`,
      {
        name: `${this.namePrefix}-${args.name}-lambda-function`,
        handler: `server.default.${args.name}`,
        role: lambdaFunctionRole.arn,
        ...defaultLambdaSettings,
      },
      { ...opts, parent: this }
    )

    const lambdaFunctionPermission = new aws.lambda.Permission(
      `${this.namePrefix}-${args.name}-permission`,
      {
        action: 'lambda:InvokeFunction',
        function: lambdaFunction.name,
        principal: 'apigateway.amazonaws.com',
      },
      { ...opts, parent: this }
    )

    const integration = new aws.apigatewayv2.Integration(
      `${this.namePrefix}-${args.name}-integration`,
      {
        apiId: args.apiId,
        integrationType: 'AWS_PROXY',
        integrationUri: pulumi.interpolate`arn:aws:apigateway:${this.provider.region}:lambda:path/2015-03-31/functions/${lambdaFunction.arn}/invocations`,
      },
      { ...opts, parent: this }
    )

    const route = new aws.apigatewayv2.Route(
      `${this.namePrefix}-${args.name}-route`,
      {
        apiId: args.apiId,
        routeKey: args.routeKey,
        authorizationType: 'NONE',
        target: pulumi.interpolate`integrations/${integration.id}`,
        operationName: `${args.name}Route`,
      },
      { ...opts, parent: this }
    )
    this.route = route
    this.registerOutputs({ route: this.route })
  }
}
