import { NlpConfig } from '../../../storage/types'

export type TextClassificationConfig = NlpConfig & { classes: string[] }
