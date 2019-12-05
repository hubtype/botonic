// Exports

import { DynamoDB } from 'aws-sdk'
import {
  ErrorReportingTrackStorage,
  Track,
  TrackStorage,
  UserEvent,
} from './domain'
import { DynamoTrackStorage, Env } from './infrastructure/dynamo'
import time from './domain/time'

export * from './domain/dummy'
export * from './infrastructure'

export interface TrackOptions {
  storage: Storage
}

export interface DynamoDbOptions extends DynamoDB.ClientConfiguration {
  env: Env
  /**
   * If not specified, failing operations will be configured according to
   * DynamoDB.ClientConfiguration's httpOptions and retry fields. By default, it
   * will automatically retry with a backoff algorithm.
   * If specified, operations will fail if the first try takes longer than this
   * amount of ms
   */
  timeout?: number
}

export default class BotonicPluginDynamoDB {
  readonly storage: TrackStorage

  constructor(opt: TrackOptions | DynamoDbOptions) {
    const optionsAny = opt as any
    if (optionsAny.storage) {
      this.storage = optionsAny.storage
    } else {
      const dynamoConf = opt as DynamoDbOptions
      this.applyTimeout(dynamoConf)
      this.storage = new DynamoTrackStorage(dynamoConf.env, dynamoConf)
    }
    this.storage = new ErrorReportingTrackStorage(this.storage)
  }

  track(
    botId: string,
    user: string,
    event: string,
    args: any = undefined
  ): Promise<void> {
    const userEvent = new UserEvent(user, event, args)
    const track = new Track(botId, time.now(), [userEvent])
    return this.storage.write(track)
  }

  // @ts-ignore
  pre({ input, session, lastRoutePath }) {
    return { input, session, lastRoutePath }
  }

  // @ts-ignore
  post({ input, session, lastRoutePath, response }) {
    return { input, session, lastRoutePath, response }
  }

  private applyTimeout(pluginDynamoOpts: DynamoDbOptions): void {
    if (!pluginDynamoOpts.timeout) {
      return
    }
    pluginDynamoOpts.httpOptions = {
      timeout: pluginDynamoOpts.timeout,
      connectTimeout: pluginDynamoOpts.timeout,
    }
    pluginDynamoOpts.retryDelayOptions = { base: pluginDynamoOpts.timeout }
    pluginDynamoOpts.maxRetries = 1
  }
}
