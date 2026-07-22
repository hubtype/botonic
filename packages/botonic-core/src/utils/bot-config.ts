import { type ZodType, z } from 'zod'
import { type VariableConfigJSON, VariableType } from '../models/index'

const SESSION_USER_EXTRA_DATA_PREFIX = 'session.user.extra_data'

export const BASE_SESSION_VARIABLES: VariableConfigJSON[] = [
  { key_path: 'input.data', type: VariableType.String },
  { key_path: 'input.type', type: VariableType.String },
  {
    key_path: 'session.is_first_interaction',
    type: VariableType.Boolean,
  },
  {
    key_path: 'session.is_test_integration',
    type: VariableType.Boolean,
  },
  { key_path: 'session._shadowing', type: VariableType.Boolean },
  { key_path: 'session.user.locale', type: VariableType.String },
  {
    key_path: 'session.user.country',
    type: VariableType.String,
  },
  { key_path: 'session.user.system_locale', type: VariableType.String },
  { key_path: 'session.user.username', type: VariableType.String },
  {
    key_path: 'session.user.unformatted_phone_number',
    type: VariableType.String,
  },
]

export function getSessionVariables(
  extraDataSchema?: ZodType
): VariableConfigJSON[] {
  const variables = [...BASE_SESSION_VARIABLES]

  if (extraDataSchema) {
    variables.push(...getSessionVariablesFromZodSchema(extraDataSchema))
  }

  return variables
}

function getSessionVariablesFromZodSchema(
  schema: ZodType
): VariableConfigJSON[] {
  const jsonSchema = z.toJSONSchema(schema) as JsonSchemaNode

  if (!jsonSchema.properties) {
    return []
  }

  return Object.entries(jsonSchema.properties).flatMap(
    ([key, propertySchema]) =>
      getSessionVariablesFromJsonSchema(
        propertySchema,
        `${SESSION_USER_EXTRA_DATA_PREFIX}.${key}`
      )
  )
}

function getSessionVariablesFromJsonSchema(
  schema: JsonSchemaNode,
  keyPath: string
): VariableConfigJSON[] {
  const type = getJsonSchemaType(schema)

  // TODO:Arrays are not supported yet. Review in the future, how to handle them
  //  in the frontend feature-flow-builder and in the plugin-flow-builder.
  if (type === 'array') {
    return []
  }

  if (type === 'object' && schema.properties) {
    return Object.entries(schema.properties).flatMap(([key, propertySchema]) =>
      getSessionVariablesFromJsonSchema(propertySchema, `${keyPath}.${key}`)
    )
  }

  const variableType = getVariableTypeFromJsonSchema(schema)
  if (!variableType) {
    return []
  }

  return [{ key_path: keyPath, type: variableType }]
}

function getJsonSchemaType(schema: JsonSchemaNode): string | undefined {
  const resolved = resolveJsonSchemaNode(schema)
  const { type } = resolved

  if (Array.isArray(type)) {
    return type.find(candidate => candidate !== 'null')
  }

  return type
}

function getVariableTypeFromJsonSchema(
  schema: JsonSchemaNode
): VariableType | undefined {
  const resolved = resolveJsonSchemaNode(schema)
  const type = getJsonSchemaType(resolved)

  // enum is transformed to string. Review in the future, how to handle them
  if (type === 'string' || resolved.enum !== undefined) {
    return VariableType.String
  }

  if (type === 'number' || type === 'integer') {
    return VariableType.Number
  }

  if (type === 'boolean') {
    return VariableType.Boolean
  }

  return undefined
}

type JsonSchemaNode = {
  type?: string | string[]
  enum?: unknown[]
  properties?: Record<string, JsonSchemaNode>
  anyOf?: JsonSchemaNode[]
}

function resolveJsonSchemaNode(schema: JsonSchemaNode): JsonSchemaNode {
  if (schema.anyOf?.length) {
    const nonNullSchema = schema.anyOf.find(
      candidate => candidate.type !== 'null'
    )
    if (nonNullSchema) {
      return resolveJsonSchemaNode(nonNullSchema)
    }
  }

  return schema
}
