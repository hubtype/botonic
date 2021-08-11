import { MessageEventTypes } from '@botonic/core/src/models/events/message'
import { DynamoDB } from 'aws-sdk'
import { Entity, Table } from 'dynamodb-toolbox'
import { EntityAttributes } from 'dynamodb-toolbox/dist/classes/Entity'

// Table Definitions
export const GLOBAL_SECONDARY_INDEX_NAME = 'GSI1'
export const GLOBAL_SECONDARY_INDEX_ATTR = 'websocketId'
export const PARTITION_KEY_NAME = 'PK'
export const SORT_KEY_NAME = 'SK'

// Entities Definitions
export const USER_PREFIX = 'USR#'
export const EVENT_PREFIX = 'EVT#'

export function getUserEventsTable(tableName: string, region: string): Table {
  const documentClient = new DynamoDB.DocumentClient({
    apiVersion: '2012-08-10',
    region: region,
  })
  return new Table({
    name: tableName,
    partitionKey: PARTITION_KEY_NAME,
    sortKey: SORT_KEY_NAME,
    entityField: true,
    indexes: {
      GSI1: {
        partitionKey: GLOBAL_SECONDARY_INDEX_ATTR,
      },
    },
    DocumentClient: documentClient,
  })
}

export function getUserEntity(table: Table): Entity<any> {
  return new Entity({
    name: 'User',
    attributes: {
      id: { partitionKey: true, prefix: USER_PREFIX },
      [`${SORT_KEY_NAME}`]: {
        hidden: true,
        sortKey: true,
        prefix: USER_PREFIX,
      },
      userId: [SORT_KEY_NAME, 0],
      websocketId: 'string',
      isOnline: 'boolean',
      route: 'string',
      session: 'string',
    },
    table,
  })
}
/**
 * To associate userId with corresponding websocketId
 * @param table
 * @returns Connection Entity
 */
export function getConnectionEntity(table: Table): Entity<any> {
  return new Entity({
    name: 'Connection',
    attributes: {
      websocketId: { partitionKey: true },
      [`${SORT_KEY_NAME}`]: { hidden: true, sortKey: true },
      userId: 'string',
    },
    table,
  })
}

export function getMessageEventEntities(
  table: Table
): Record<string, Entity<any>> {
  const textAttributes: EntityAttributes = {
    text: 'string',
    markdown: 'boolean',
    buttons: 'list',
    replies: 'list',
  }

  const mediaAttributes: EntityAttributes = {
    src: 'string',
    buttons: 'list',
  }

  const locationAttributes: EntityAttributes = {
    lat: 'number',
    long: 'number',
  }

  const carouselAttributes: EntityAttributes = {
    elements: 'list',
  }

  const customAttributes: EntityAttributes = {
    json: 'map',
    replies: 'list',
  }

  const entityWithAttributes = (type: string, attributes: EntityAttributes) =>
    new Entity({
      name: `${type} Message`, // Entity Names must be unique
      attributes: {
        userId: { partitionKey: true, prefix: USER_PREFIX },
        [`${SORT_KEY_NAME}`]: {
          hidden: true,
          sortKey: true,
          prefix: EVENT_PREFIX,
        },
        eventId: [SORT_KEY_NAME, 0],
        eventType: 'string',
        createdAt: 'string',
        from: 'string',
        ack: 'string',
        typing: 'number',
        delay: 'number',
        type: 'string',
        ...attributes,
      },
      table,
    })

  return {
    text: entityWithAttributes(MessageEventTypes.TEXT, textAttributes),
    audio: entityWithAttributes(MessageEventTypes.AUDIO, mediaAttributes),
    image: entityWithAttributes(MessageEventTypes.IMAGE, mediaAttributes),
    document: entityWithAttributes(MessageEventTypes.DOCUMENT, mediaAttributes),
    video: entityWithAttributes(MessageEventTypes.VIDEO, mediaAttributes),
    location: entityWithAttributes(
      MessageEventTypes.LOCATION,
      locationAttributes
    ),
    carousel: entityWithAttributes(
      MessageEventTypes.CAROUSEL,
      carouselAttributes
    ),
    custom: entityWithAttributes(MessageEventTypes.CUSTOM, customAttributes),
  }
}
