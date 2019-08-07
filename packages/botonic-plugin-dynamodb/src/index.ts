// Exports

import { DynamoDB } from 'aws-sdk';
import {
  ErrorReportingTrackStorage,
  Track,
  TrackStorage,
  UserEvent
} from './domain';
import { DynamoTrackStorage } from './infrastructure/dynamo';
import time from './domain/time';

export * from './domain/dummy';

export default class BotonicPluginDynamoDB {
  readonly storage: TrackStorage;

  constructor(options: any) {
    if (options.storage) {
      this.storage = options.storage;
    } else {
      const conf: DynamoDB.ClientConfiguration = {
        accessKeyId: options['accessKeyId'],
        secretAccessKey: options['secretAccessKey'],
        region: options['region']
      };
      this.storage = new DynamoTrackStorage(options['env'], conf);
    }
    this.storage = new ErrorReportingTrackStorage(this.storage);
  }

  track(
    botId: string,
    user: string,
    event: string,
    args: any = undefined
  ): Promise<undefined> {
    const userEvent = new UserEvent(user, event, args);
    const track = new Track(botId, time.now(), [userEvent]);
    return this.storage.write(track);
  }

  // @ts-ignore
  pre({ input, session, lastRoutePath }) {}

  // @ts-ignore
  post({ input, session, lastRoutePath, response }) {}
}
