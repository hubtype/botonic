import { ParamSchema, Schema } from 'express-validator'

import {
  inBody,
  inParams,
  isBoolean,
  isDateTime,
  isOptional,
  isRequired,
} from './common'

export const userIdParamSchema: ParamSchema = { ...inParams, ...isRequired }

export const userSchema: Schema = {
  id: { ...inBody, ...isRequired },
  websocketId: { ...inBody, ...isOptional },
  providerId: { ...inBody, ...isOptional },
  //TODO: determine session schema
  session: { ...inBody, ...isRequired },
  route: { ...inBody, ...isRequired },
  isOnline: { ...inBody, ...isRequired, ...isBoolean },
  locationInfo: { ...inBody, ...isOptional },
}

export const userWithUserIdParamSchema: Schema = {
  userId: userIdParamSchema,
  ...userSchema,
}
