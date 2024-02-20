import { DynamoDbSchema } from '@aws/dynamodb-data-mapper'
import {
  attribute,
  hashKey,
  rangeKey,
  table,
} from '@aws/dynamodb-data-mapper-annotations'
import { marshallItem, Schema } from '@aws/dynamodb-data-marshaller'
import DynamoDB from 'aws-sdk/clients/dynamodb'

import { UserEvent } from '../domain'
import * as domain from '../domain'
import Time from '../domain/time'

export const TABLE_NAME = 'track'

export class TrackKey {
  @hashKey({ type: 'String' })
  bot = ''

  @rangeKey({
    defaultProvider: () => Time.now(),
  })
  time: Date = Time.now()

  marshallKey(): DynamoDB.Key {
    // implement with marshallItem and TrackKey's schema?
    return {
      bot: { S: this.bot },
      time: { N: String(Math.floor(this.time.getTime() / 1000)) },
    }
  }
}

export enum TrackFields {
  // get from TrackKey schema?
  EVENTS = 'events',
}

@table(TABLE_NAME)
export class Track extends TrackKey {
  /**
   * Insertions won't be idempotent. Maybe we can use instead user-time as key in a set?
   * Datamapper is not creating UserEvent instances. {@link Track.toDomain} fixes it
   */
  @attribute({
    defaultProvider: () => [] as domain.UserEvent[],
  })
  events: domain.UserEvent[] = []

  static fromKey(botId: string, time: Date): Track {
    const track = new Track()
    track.bot = botId
    track.time = time
    return track
  }
  static fromDomain(domTrack: domain.Track): Track {
    const track = new Track()
    track.bot = domTrack.botId
    track.time = domTrack.time
    track.events = domTrack.events
    return track
  }

  toDomain(): domain.Track {
    const events = this.events.map(e => {
      /** {@link Track.events} */
      if ((e as any) instanceof UserEvent) {
        return e
      }
      return new UserEvent(e.user, e.event, e.args)
    })
    return new domain.Track(this.bot, this.time, events)
  }

  marshallEvents(): DynamoDB.AttributeValue {
    const schema = this.schema()

    const marshalled = marshallItem(schema, this)
    return marshalled.events as DynamoDB.AttributeValue
  }

  private schema(): Schema {
    let schema: Schema = (this as any)[DynamoDbSchema]
    if (schema) {
      return schema
    }

    // https://metisai.atlassian.net/browse/HTYPE-1881
    const proto = Object.getPrototypeOf(this)
    const sym = Object.getOwnPropertySymbols(proto).find(function (s) {
      return String(s) === DynamoDbSchema.toString()
    }) as symbol
    schema = (proto as any)[sym]
    if (schema) {
      //console.log('Applied hack to get Dynamo schema');
      return schema
    }

    const msg =
      'Could not get DynamoDB schema. Trying deleting node_modules and package-lock.json'
    console.error(msg, DynamoDbSchema, Object.keys(this))
    throw new Error(msg)
  }

  /**
   * Useful to check from other projects that issue
   * https://metisai.atlassian.net/browse/HTYPE-1881 is not manifesting
   */
  static testSerialization(): void {
    const track = new Track()
    track.schema()
  }
}
