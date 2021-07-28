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
import { ValidatorsSchema } from 'express-validator/src/middlewares/schema'

const inQuery: ParamSchema = { in: ['query'] }
const inParams: ParamSchema = { in: ['params'] }
const inBody: ParamSchema = { in: ['body'] }
const isRequired: ValidatorsSchema = { notEmpty: true }
const isOptional: ParamSchema = { optional: { options: { nullable: true } } }
const isNaturalNumber: ParamSchema = {
  isNumeric: { options: { no_symbols: true } },
}
const isNumeric: ParamSchema = { isNumeric: true }
const isBoolean: ParamSchema = { isBoolean: true }
const isDateTime: ParamSchema = {
  isISO8601: { options: { strict: true, strictSeparator: true } },
}
const isIn = (valueList: string[]): ParamSchema => {
  return {
    isIn: { options: [valueList] },
    errorMessage: `Invalid value. Allowed values: ${valueList}`,
  }
}
const equals = (text: string): ParamSchema => {
  return {
    equals: { options: [text] },
    errorMessage: `Invalid value. Value should be '${text}'`,
  }
}
const toInt: ParamSchema = { toInt: true }

export const limitParamSchema: ParamSchema = {
  ...inQuery,
  ...isOptional,
  ...isNaturalNumber,
  ...toInt,
}
export const offsetParamSchema = limitParamSchema

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
  allFieldsOptional = false
): Promise<Result> {
  const opt = allFieldsOptional
  await checkSchema(getSchema(baseEventSchema, opt)).run(req)
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return errors
  }

  if (req.body.eventType === EventTypes.CONNECTION) {
    await checkSchema(getSchema(connectionEventSchema, opt)).run(req)
  } else {
    switch (req.body.type) {
      case MessageEventTypes.TEXT:
        await checkSchema(getSchema(textMessageEventSchema, opt)).run(req)
        break
      case MessageEventTypes.POSTBACK:
        await checkSchema(getSchema(postbackMessageEventSchema, opt)).run(req)
        break
      case MessageEventTypes.AUDIO:
        await checkSchema(getSchema(audioMessageEventSchema, opt)).run(req)
        break
      case MessageEventTypes.DOCUMENT:
        await checkSchema(getSchema(documentMessageEventSchema, opt)).run(req)
        break
      case MessageEventTypes.IMAGE:
        await checkSchema(getSchema(imageMessageEventSchema, opt)).run(req)
        break
      case MessageEventTypes.VIDEO:
        await checkSchema(getSchema(videoMessageEventSchema, opt)).run(req)
        break
      case MessageEventTypes.LOCATION:
        await checkSchema(getSchema(locationMessageEventSchema, opt)).run(req)
        break
      case MessageEventTypes.CAROUSEL:
        await checkSchema(getSchema(carouselMessageEventSchema, opt)).run(req)
        break
      case MessageEventTypes.CUSTOM:
        await checkSchema(getSchema(customMessageEventSchema, opt)).run(req)
        break
      default:
        await checkSchema(getSchema(botonicMessageEventSchema, opt)).run(req)
        break
    }
  }
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

function getSchema(schema: Schema, allFieldsOptional = false): Schema {
  if (!allFieldsOptional) {
    return schema
  }
  for (const field of Object.keys(schema)) {
    const validations = schema[field]
    delete validations.notEmpty
    if (!('optional' in validations)) {
      schema[field] = { ...validations, ...isOptional }
    }
  }
  return schema
}
