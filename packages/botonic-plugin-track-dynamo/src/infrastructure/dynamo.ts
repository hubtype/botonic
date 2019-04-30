import { TrackWriter, Track } from '../domain';
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

export class DynamoTrackWriter implements TrackWriter {
  mapper: DataMapper;
  constructor(env: Env, conf: DynamoDB.Types.ClientConfiguration) {
    this.mapper = new DataMapper({
      client: new DynamoDB(conf),
      tableNamePrefix: Dynamo.tablePrefix(env)
    });
  }

  async write(track: Track): Promise<Track> {
    return this.mapper.put(track);
  }
}
