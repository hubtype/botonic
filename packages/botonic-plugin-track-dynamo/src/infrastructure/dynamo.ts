import { UpdateItemInput } from 'aws-sdk/clients/dynamodb';
import * as domain from '../domain';
import { Track, TABLE_NAME } from './track';
import { DataMapper } from '@aws/dynamodb-data-mapper';
import DynamoDB = require('aws-sdk/clients/dynamodb');

export enum Env {
  PRO = 'pro',
  DEV = 'dev'
}

export class Dynamo {
  static tableName(name: string, env: Env): string {
    return Dynamo.tablePrefix(env) + name;
  }
  static tablePrefix(env: Env): string {
    if (env == Env.PRO) {
      return '';
    }
    return env + '_';
  }
}

export class DynamoTrackStorage implements domain.TrackStorage {
  readonly mapper: DataMapper;
  readonly tableName: string;
  private readonly client: DynamoDB;

  constructor(env: Env, conf: DynamoDB.Types.ClientConfiguration) {
    this.client = new DynamoDB(conf);
    this.mapper = new DataMapper({
      client: this.client,
      tableNamePrefix: Dynamo.tablePrefix(env)
    });
    this.tableName = Dynamo.tableName(TABLE_NAME, env);
  }

  async write(domTrack: domain.Track): Promise<undefined> {
    let track = Track.fromDomain(domTrack);
    // from https://stackoverflow.com/questions/34951043/is-it-possible-to-combine-if-not-exists-and-list-append-in-update-item
    let input: UpdateItemInput = {
      Key: track.marshallKey(),
      TableName: this.tableName,
      UpdateExpression:
        'SET events=list_append(if_not_exists(events,:empty), :newEvents)',
      ExpressionAttributeValues: {
        ':empty': { L: [] },
        ':newEvents': track.marshallEvents()
      }
    };
    let req = this.client.updateItem(input);
    return req.promise().then(({}) => {
      return Promise.resolve(undefined);
    });
  }

  async read(bot: string, time: Date): Promise<domain.Track> {
    let request = Track.fromKey(bot, time);
    let track = await this.mapper.get(request);
    return track.toDomain();
  }

  async remove(bot: string, time: Date): Promise<undefined> {
    let request = Track.fromKey(bot, time);
    await this.mapper.delete(request);
    return Promise.resolve(undefined);
  }
}
