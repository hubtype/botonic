import type { core } from 'zod'

// This types are used in the bot-config.ts file to load the bot config when deploy a bot.
export interface BotConfigJSON {
  tools: ToolConfigJSON[]
  payloads: string[]
  webviews: WebviewConfigJSON[]
  variables?: VariableConfigJSON[]
}

export interface ToolConfigJSON {
  name: string
  schema?: core.JSONSchema.JSONSchema
  description: string
}

export interface WebviewConfigJSON {
  name: string
}

export enum VariableType {
  String = 'string',
  Number = 'number',
  Boolean = 'boolean',
}

export interface VariableConfigJSON {
  key_path: string
  type: VariableType
}
