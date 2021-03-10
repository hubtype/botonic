import { Locale } from '../types'

export type NlpConfig = {
  locale: Locale
  maxLength: number
  vocabulary: string[]
}
