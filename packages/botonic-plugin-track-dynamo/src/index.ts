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

export default class BotonicPluginTrackDynamo {
  readonly storage: TrackStorage;

  constructor(options: any) {
    if (options.storage) {
      this.storage = options.storage;
    } else {
      let conf: DynamoDB.ClientConfiguration = {
        accessKeyId: options['accessKeyId'],
        secretAccessKey: options['secretAccessKey'],
        region: options['region']
      };
      this.storage = new DynamoTrackStorage(options['env'], conf);
    }
    this.storage = new ErrorReportingTrackStorage(this.storage);
  }

  async track(botId: string, user: string, event: string): Promise<undefined> {
    let userEvent = new UserEvent(user, event);
    let track = new Track(botId, time.now(), [userEvent]);
    return this.storage.write(track);
  }

  // @ts-ignore
  async pre({ input, session, lastRoutePath }) {
    return { input, session, lastRoutePath };
  }

  // @ts-ignore
  async post({ input, session, lastRoutePath, response }) {
    return { input, session, lastRoutePath, response };
  }
}
