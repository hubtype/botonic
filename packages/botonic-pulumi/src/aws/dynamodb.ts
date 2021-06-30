import * as aws from '@pulumi/aws'
import * as pulumi from '@pulumi/pulumi'

import {
  AWSComponentResource,
  AWSResourceOptions,
  DYNAMODB_TABLE_NAME,
} from '.'

export interface DynamoDBArgs {
  tableName?: string
}
export class DynamoDB extends AWSComponentResource<DynamoDBArgs> {
  table: aws.dynamodb.Table
  endpoint: pulumi.Output<string>
  constructor(args: DynamoDBArgs, opts: AWSResourceOptions) {
    super('dynamodb', args, opts)
    const tableName = args.tableName || DYNAMODB_TABLE_NAME

    const table = new aws.dynamodb.Table(
      `${this.namePrefix}-dynamodb-table`,
      {
        name: tableName,
        hashKey: 'PK',
        rangeKey: 'SK',
        attributes: [
          { name: 'PK', type: 'S' },
          { name: 'SK', type: 'S' },
          { name: 'websocketId', type: 'S' },
        ],
        readCapacity: 1,
        writeCapacity: 1,
        globalSecondaryIndexes: [
          {
            name: 'GSI1',
            hashKey: 'websocketId',
            readCapacity: 1,
            writeCapacity: 1,
            projectionType: 'ALL',
          },
        ],
      },
      { ...opts, parent: this }
    )
    this.table = table
    this.endpoint = pulumi.interpolate`dynamodb://${this.table.name}.${this.provider.region}.aws.com`
    this.registerOutputs({
      table: this.table,
      endpoint: this.endpoint,
    })
  }
}
