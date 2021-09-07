import * as aws from '@pulumi/aws'
import * as pulumi from '@pulumi/pulumi'

import { AWSComponentResource, AWSResourceOptions } from '.'
import { DynamoDB } from './dynamodb'

interface SQSLambdaPolicy {
  name: string
  arn: pulumi.Input<string>
}

export interface SQSLambdaFunctionArgs {
  name: string
  sqsLambdaPath: string
  handler: pulumi.Input<string>
  policies: SQSLambdaPolicy[]
  inlinePolicies: pulumi.Input<
    pulumi.Input<aws.types.input.iam.RoleInlinePolicy>[]
  >
  environmentVariables?: pulumi.Input<{
    [key: string]: pulumi.Input<string>
  }>
}

export class SQSLambdaFunction extends AWSComponentResource<SQSLambdaFunctionArgs> {
  lambaFunction: aws.lambda.Function

  constructor(args: SQSLambdaFunctionArgs, opts: AWSResourceOptions) {
    super(`sqs-lambda-${args.name}`, args, opts)

    const { name, sqsLambdaPath, policies, handler } = args
    const inlinePolicies = args.inlinePolicies || []
    const environmentVariables = args.environmentVariables
      ? {
          environment: {
            variables: args.environmentVariables,
          },
        }
      : {}

    const roleName = `${name}-role`
    const role = new aws.iam.Role(
      roleName,
      {
        name: roleName,
        assumeRolePolicy: aws.iam.assumeRolePolicyForPrincipal({
          Service: 'lambda.amazonaws.com',
        }),
        inlinePolicies,
      },
      opts
    )
    policies.forEach(policy => {
      new aws.iam.RolePolicyAttachment(`${name}-${policy.name}`, {
        role,
        policyArn: policy.arn,
      })
    }, opts)
    const functionName = `${name}-function`
    this.lambaFunction = new aws.lambda.Function(
      functionName,
      {
        name: functionName,
        runtime: 'nodejs14.x',
        code: new pulumi.asset.AssetArchive({
          '.': new pulumi.asset.FileArchive(sqsLambdaPath),
        }),
        handler,
        role: role.arn,
        // timeout: 6,
        ...environmentVariables,
      },
      opts
    )
  }
  getLambdaFunction(): aws.lambda.Function {
    return this.lambaFunction
  }
}

export interface SQSLambdaMappingArgs {
  queueName: string
  lambdaName: string
  handler: pulumi.Input<string>
  sqsLambdaPath: string
  inlinePolicies?: pulumi.Input<
    pulumi.Input<aws.types.input.iam.RoleInlinePolicy>[]
  >
  environmentVariables?: pulumi.Input<{
    [key: string]: pulumi.Input<string>
  }>
}
export class SQSLambdaMapping extends AWSComponentResource<SQSLambdaMappingArgs> {
  queueUrl: pulumi.Output<string>
  constructor(args: SQSLambdaMappingArgs, opts: AWSResourceOptions) {
    const {
      queueName,
      lambdaName,
      sqsLambdaPath,
      handler,
      environmentVariables,
    } = args
    super(`${queueName}<>${lambdaName}`, args, opts)

    const queue = new aws.sqs.Queue(`${this.namePrefix}-${queueName}`, {
      name: `${lambdaName}.fifo`,
      fifoQueue: true,
    })
    this.queueUrl = queue.url
    const policies = [
      {
        name: `${this.namePrefix}-sqs-${queueName}-${lambdaName}-execution-role`,
        arn: aws.iam.ManagedPolicy.AWSLambdaSQSQueueExecutionRole,
      },
      {
        name: `${this.namePrefix}-sqs-${queueName}-${lambdaName}-sqs-full-access-role`,
        arn: aws.iam.ManagedPolicy.AmazonSQSFullAccess,
      },
    ]

    const inlinePolicies = args?.inlinePolicies || []

    const sqsLambda = new SQSLambdaFunction(
      {
        name: `${this.namePrefix}-${lambdaName}-lambda`,
        policies,
        inlinePolicies,
        handler,
        sqsLambdaPath,
        environmentVariables,
      },
      opts
    )
    new aws.lambda.EventSourceMapping(
      `${this.namePrefix}-${lambdaName}<>${queueName}`,
      {
        eventSourceArn: queue.arn,
        functionName: sqsLambda.getLambdaFunction().arn,
        batchSize: 1,
      }
    )
    this.registerOutputs({ queueUrl: this.queueUrl })
  }
}
