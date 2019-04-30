import { UpdateItemInput } from 'aws-sdk/clients/dynamodb';
import { TrackStorage, Track, TABLE_NAME, TrackFields } from '../domain';
import { DataMapper } from '@aws/dynamodb-data-mapper';
import {
  UpdateExpression,
  FunctionExpression,
  AttributePath
} from '@aws/dynamodb-expressions';
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

export class DynamoTrackStorage implements TrackStorage {
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

  // DOES NOT Work: ValidationException: Invalid UpdateExpression: Incorrect operand type for operator or function; operator or function: list_append, operand type: M
  async writeKO(track: Track): Promise<Track> {
    //https://github.com/awslabs/dynamodb-data-mapper-js/issues/150
    let expr = new UpdateExpression();
    let append = new FunctionExpression(
      'list_append',
      new FunctionExpression(
        'if_not_exists',
        new AttributePath(TrackFields.EVENTS),
        []
      ),
      ['bar']
    );

    expr.toSet.set(new AttributePath(TrackFields.EVENTS), append);
    return this.mapper.executeUpdateExpression(
      expr,
      {
        bot: track.bot,
        time: track.time
      },
      Track
    );
  }

  async write(track: Track): Promise<Track | undefined> {
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
    return req.promise().then(r => {
      return Promise.resolve(undefined);
    });
  }
}
