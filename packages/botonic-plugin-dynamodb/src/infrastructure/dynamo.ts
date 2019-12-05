import { UpdateItemInput } from 'aws-sdk/clients/dynamodb'
import * as domain from '../domain'
import { Track, TABLE_NAME } from './track'
import { DataMapper } from '@aws/dynamodb-data-mapper'
import DynamoDB = require('aws-sdk/clients/dynamodb')

/**
 * Env affects the name of the table were the tracks will be stored
 */
export enum Env {
  PRO = 'pro',
  DEV = 'dev',
}

export class Dynamo {
  static tableName(name: string, env: Env): string {
    return Dynamo.tablePrefix(env) + name
  }
  static tablePrefix(env: Env): string {
    if (env == Env.PRO) {
      return ''
    }
    return env + '_'
  }
}

export class DynamoTrackStorage implements domain.TrackStorage {
  readonly mapper: DataMapper
  readonly tableName: string
  private readonly client: DynamoDB

  constructor(env: Env, conf: DynamoDB.Types.ClientConfiguration) {
    this.client = new DynamoDB(conf)
    this.mapper = new DataMapper({
      client: this.client,
      tableNamePrefix: Dynamo.tablePrefix(env),
    })
    this.tableName = Dynamo.tableName(TABLE_NAME, env)
  }

  async write(domTrack: domain.Track): Promise<void> {
    const track = Track.fromDomain(domTrack)
    // from https://stackoverflow.com/questions/34951043/is-it-possible-to-combine-if-not-exists-and-list-append-in-update-item
    const input: UpdateItemInput = {
      Key: track.marshallKey(),
      TableName: this.tableName,
      UpdateExpression:
        'SET events=list_append(if_not_exists(events,:empty), :newEvents)',
      ExpressionAttributeValues: {
        ':empty': { L: [] },
        ':newEvents': track.marshallEvents(),
      },
    }
    const req = this.client.updateItem(input)
    await req.promise()
  }

  /**
   * If {@link UserEvent.args} contains numeric fields, they will be wrapped in DynamoDB's value/type structure
   */
  async read(bot: string, time: Date): Promise<domain.Track> {
    const request = Track.fromKey(bot, time)
    const track = await this.mapper.get(request)
    return track.toDomain()
  }

  async remove(bot: string, time: Date): Promise<void> {
    const request = Track.fromKey(bot, time)
    await this.mapper.delete(request)
  }
}
