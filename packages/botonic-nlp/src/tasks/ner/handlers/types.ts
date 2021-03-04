import { ModelConfig } from '../../../handlers/types'

export type NerModelConfig = ModelConfig & { entities: string[] }
