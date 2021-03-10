import { NlpConfig } from '../../../storage/types'

export type NerConfig = NlpConfig & { entities: string[] }
