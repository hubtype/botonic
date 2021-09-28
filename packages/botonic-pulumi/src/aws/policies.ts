import * as aws from '@pulumi/aws'
import * as pulumi from '@pulumi/pulumi'

export function getDynamoDbCrudPolicy(
  region: pulumi.Output<aws.Region>,
  accountId: Promise<string>,
  tableName: pulumi.Output<string>
): pulumi.Output<string> {
  return pulumi
    .all([region, accountId, tableName])
    .apply(([region, accountId, tableName]) => {
      const dynamoDbArn = `arn:aws:dynamodb:${region}:${accountId}:table/${tableName}`
      return JSON.stringify({
        Statement: [
          {
            Action: [
              'dynamodb:GetItem',
              'dynamodb:DeleteItem',
              'dynamodb:PutItem',
              'dynamodb:Scan',
              'dynamodb:Query',
              'dynamodb:UpdateItem',
              'dynamodb:BatchWriteItem',
              'dynamodb:BatchGetItem',
              'dynamodb:DescribeTable',
              'dynamodb:ConditionCheckItem',
            ],
            Resource: [dynamoDbArn, `${dynamoDbArn}/index/*`], // To allow accessing indexes, e.g.: getting user by its websocket ID (which is indexed)
            Effect: 'Allow',
          },
        ],
      })
    })
}

export function getManageConnectionsPolicy(
  region: pulumi.Output<aws.Region>,
  accountId: Promise<string>,
  apiGatewayId: pulumi.Output<string>
): pulumi.Output<string> {
  return pulumi
    .all([region, accountId, apiGatewayId])
    .apply(([region, accountId, apiGatewayId]) =>
      JSON.stringify({
        Statement: [
          {
            Action: ['execute-api:ManageConnections'],
            Resource: [
              `arn:aws:execute-api:${region}:${accountId}:${apiGatewayId}/*`,
            ],
            Effect: 'Allow',
          },
        ],
      })
    )
}

type OriginRequestPolicy =
  | 'Managed-UserAgentRefererHeaders'
  | 'Managed-AllViewer'
  | 'Managed-CORS-S3Origin'
  | 'Managed-CORS-CustomOrigin'
  | 'Managed-Elemental-MediaTailor-PersonalizedManifests'

export function getOriginRequestPolicyId(
  name: OriginRequestPolicy
): pulumi.Output<string> {
  return pulumi
    .output(
      aws.cloudfront.getOriginRequestPolicy({
        name,
      })
    )
    .apply(p => String(p.id))
}

type CachePolicy =
  | 'Managed-CachingOptimized'
  | 'Managed-CachingDisabled'
  | 'Managed-CachingOptimizedForUncompressedObjects'
  | 'Managed-Elemental-MediaPackage'

export function getCachePolicyId(name: CachePolicy): pulumi.Output<string> {
  return pulumi
    .output(
      aws.cloudfront.getCachePolicy({
        name,
      })
    )
    .apply(p => String(p.id))
}
