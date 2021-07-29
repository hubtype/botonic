import { MessageEventFrom } from '@botonic/core/lib/models/events/message'
import { EventTypes } from '@botonic/core/src/models/events'
import { ConnectionEventStatuses } from '@botonic/core/src/models/events/connections/index'
import {
  MessageEventAck,
  MessageEventTypes,
} from '@botonic/core/src/models/events/message'
import { Request } from 'express'
import {
  body,
  checkSchema,
  ParamSchema,
  Result,
  Schema,
  validationResult,
} from 'express-validator'

import {
  equals,
  getOptionalSchema,
  inBody,
  inParams,
  isBoolean,
  isDateTime,
  isIn,
  isNaturalNumber,
  isNumeric,
  isOptional,
  isRequired,
  toInt,
} from './common'

export const eventIdParamSchema: ParamSchema = { ...inParams, ...isRequired }

export const buttonsSchema: Schema = {
  buttons: {
    ...inBody,
    ...isOptional,
    isArray: true,
    errorMessage: 'buttons have to be an array',
  },
  'buttons.*.title': { ...inBody, ...isRequired },
  'buttons.*.webview': { ...inBody, ...isOptional },
  'buttons.*.params': { ...inBody, ...isOptional },
  'buttons.*.url': { ...inBody, ...isOptional },
  'buttons.*.target': { ...inBody, ...isOptional },
  'buttons.*.payload': { ...inBody, ...isOptional },
}

export const repliesSchema: Schema = {
  replies: {
    ...inBody,
    ...isOptional,
    isArray: true,
    errorMessage: 'replies have to be an array',
  },
  'replies.*.title': { ...inBody, ...isRequired },
  'replies.*.payload': { ...inBody, ...isRequired },
}

export const carouselSchema: Schema = {
  elements: {
    ...inBody,
    isArray: true,
    errorMessage: 'elements have to be an array',
  },
  'elements.*.pic': { ...inBody, ...isRequired },
  'elements.*.title': { ...inBody, ...isRequired },
  'elements.*.subtitle': { ...inBody, ...isOptional },
}

export const baseEventSchema: Schema = {
  eventId: { ...inBody, ...isRequired },
  eventType: { ...inBody, ...isRequired, ...isIn(Object.values(EventTypes)) },
  createdAt: { ...inBody, ...isRequired, ...isDateTime },
  modifiedAt: { ...inBody, ...isOptional, ...isDateTime },
}

export const botonicMessageEventSchema: Schema = {
  ...baseEventSchema,
  ack: { ...inBody, ...isRequired, ...isIn(Object.values(MessageEventAck)) },
  from: { ...inBody, ...isRequired, ...isIn(Object.values(MessageEventFrom)) },
  type: { ...inBody, ...isRequired, ...isIn(Object.values(MessageEventTypes)) },
  typing: { ...inBody, ...isOptional, ...isNaturalNumber, ...toInt },
  delay: { ...inBody, ...isOptional, ...isNaturalNumber, ...toInt },
}

export const mediaMessageEventSchema: Schema = {
  ...botonicMessageEventSchema,
  ...buttonsSchema,
  src: { ...inBody, ...isRequired },
}

export const textMessageEventSchema: Schema = {
  ...botonicMessageEventSchema,
  ...buttonsSchema,
  ...repliesSchema,
  type: {
    ...inBody,
    ...isRequired,
    ...equals(MessageEventTypes.TEXT),
  },
  markdown: { ...inBody, ...isRequired, ...isBoolean },
  text: { ...inBody, ...isRequired },
}
export const postbackMessageEventSchema: Schema = {
  ...botonicMessageEventSchema,
  payload: { ...inBody, ...isRequired },
}
export const audioMessageEventSchema: Schema = {
  ...mediaMessageEventSchema,
  type: { ...inBody, ...isRequired, ...equals(MessageEventTypes.AUDIO) },
}
export const imageMessageEventSchema: Schema = {
  ...mediaMessageEventSchema,
  type: { ...inBody, ...isRequired, ...equals(MessageEventTypes.IMAGE) },
}
export const documentMessageEventSchema: Schema = {
  ...mediaMessageEventSchema,
  type: { ...inBody, ...isRequired, ...equals(MessageEventTypes.DOCUMENT) },
}
export const videoMessageEventSchema: Schema = {
  ...mediaMessageEventSchema,
  type: { ...inBody, ...isRequired, ...equals(MessageEventTypes.VIDEO) },
}
export const locationMessageEventSchema: Schema = {
  ...botonicMessageEventSchema,
  type: { ...inBody, ...isRequired, ...equals(MessageEventTypes.LOCATION) },
  lat: { ...inBody, ...isRequired, ...isNumeric, ...toInt },
  long: { ...inBody, ...isRequired, ...isNumeric, ...toInt },
}
export const carouselMessageEventSchema: Schema = {
  ...botonicMessageEventSchema,
  ...carouselSchema,
  type: { ...inBody, ...isRequired, ...equals(MessageEventTypes.CAROUSEL) },
}
export const customMessageEventSchema: Schema = {
  ...botonicMessageEventSchema,
  ...repliesSchema,
  type: { ...inBody, ...isRequired, ...equals(MessageEventTypes.CUSTOM) },
  customTypeName: { ...inBody, ...isRequired },
}
export const connectionEventSchema: Schema = {
  ...baseEventSchema,
  eventType: { ...inBody, ...isRequired, ...equals(EventTypes.CONNECTION) },
  status: {
    ...inBody,
    ...isRequired,
    ...isIn(Object.values(ConnectionEventStatuses)),
  },
}

export const botonicEventValidationChains = [
  checkSchema(textMessageEventSchema),
  checkSchema(postbackMessageEventSchema),
  checkSchema(audioMessageEventSchema),
  checkSchema(documentMessageEventSchema),
  checkSchema(imageMessageEventSchema),
  checkSchema(videoMessageEventSchema),
  checkSchema(locationMessageEventSchema),
  checkSchema(carouselMessageEventSchema),
  checkSchema(customMessageEventSchema),
  checkSchema(connectionEventSchema),
]

export async function validateBotonicEventData(
  req: Request,
  allFieldsOptional = false,
  withParamEventId = false
): Promise<Result> {
  const opt = allFieldsOptional
  const e = withParamEventId
  await checkSchema(getSchema(baseEventSchema, opt, e)).run(req)
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return errors
  }

  let schema
  if (req.body.eventType === EventTypes.CONNECTION) {
    schema = getSchema(connectionEventSchema, opt, e)
  } else {
    switch (req.body.type) {
      case MessageEventTypes.TEXT:
        schema = getSchema(textMessageEventSchema, opt, e)
        break
      case MessageEventTypes.POSTBACK:
        schema = getSchema(postbackMessageEventSchema, opt, e)
        break
      case MessageEventTypes.AUDIO:
        schema = getSchema(audioMessageEventSchema, opt, e)
        break
      case MessageEventTypes.DOCUMENT:
        schema = getSchema(documentMessageEventSchema, opt, e)
        break
      case MessageEventTypes.IMAGE:
        schema = getSchema(imageMessageEventSchema, opt, e)
        break
      case MessageEventTypes.VIDEO:
        schema = getSchema(videoMessageEventSchema, opt, e)
        break
      case MessageEventTypes.LOCATION:
        schema = getSchema(locationMessageEventSchema, opt, e)
        break
      case MessageEventTypes.CAROUSEL:
        schema = getSchema(carouselMessageEventSchema, opt, e)
        break
      case MessageEventTypes.CUSTOM:
        schema = getSchema(customMessageEventSchema, opt, e)
        break
      default:
        schema = getSchema(botonicMessageEventSchema, opt, e)
        break
    }
  }
  await checkSchema(schema).run(req)
  return validationResult(req)
}

export async function validateEventType(req: Request): Promise<Result> {
  await body('eventType').equals(EventTypes.CONNECTION).run(req)
  return validationResult(req)
}

export async function validateType(req: Request): Promise<Result> {
  const messageEventTypes = Object.values(MessageEventTypes)
  await body('type')
    .isIn(messageEventTypes)
    .withMessage(`Invalid value. Allowed values: ${messageEventTypes}`)
    .run(req)
  return validationResult(req)
}

function getSchema(
  schema: Schema,
  allFieldsOptional = false,
  withParamEventId = false
): Schema {
  if (withParamEventId) {
    schema = { eventId: eventIdParamSchema, ...schema }
  }
  if (allFieldsOptional) {
    schema = getOptionalSchema(schema)
  }
  return schema
}
