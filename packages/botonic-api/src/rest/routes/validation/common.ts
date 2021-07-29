import { ParamSchema, Schema } from 'express-validator'

export const inQuery: ParamSchema = { in: ['query'] }
export const inParams: ParamSchema = { in: ['params'] }
export const inBody: ParamSchema = { in: ['body'] }
export const isRequired: ParamSchema = { notEmpty: true }
export const isOptional: ParamSchema = {
  optional: { options: { nullable: true } },
}
export const isNaturalNumber: ParamSchema = {
  isNumeric: { options: { no_symbols: true } },
}
export const isNumeric: ParamSchema = { isNumeric: true }
export const isBoolean: ParamSchema = { isBoolean: true }
export const isDateTime: ParamSchema = {
  isISO8601: { options: { strict: true, strictSeparator: true } },
}
export const isIn = (valueList: string[]): ParamSchema => {
  return {
    isIn: { options: [valueList] },
    errorMessage: `Invalid value. Allowed values: ${valueList}`,
  }
}
export const equals = (text: string): ParamSchema => {
  return {
    equals: { options: [text] },
    errorMessage: `Invalid value. Value should be '${text}'`,
  }
}
export const toInt: ParamSchema = { toInt: true }

export const limitParamSchema: ParamSchema = {
  ...inQuery,
  ...isOptional,
  ...isNaturalNumber,
  ...toInt,
}
export const offsetParamSchema = limitParamSchema

export function getOptionalSchema(schema: Schema): Schema {
  for (const field of Object.keys(schema)) {
    const validations = schema[field]
    delete validations.notEmpty
    if (!('optional' in validations)) {
      schema[field] = { ...validations, ...isOptional }
    }
  }
  return schema
}
