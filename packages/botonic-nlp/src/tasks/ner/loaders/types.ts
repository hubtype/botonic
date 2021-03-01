import { ModelConfig } from '../../../loaders/types'

export type NerModelConfig = ModelConfig & { entities: string[] }
