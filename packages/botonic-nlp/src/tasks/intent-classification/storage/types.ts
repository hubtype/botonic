import { NlpConfig } from '../../../storage/types'

export type IntentClassificationConfig = NlpConfig & { classes: string[] }
