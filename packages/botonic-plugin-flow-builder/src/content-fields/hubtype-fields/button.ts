import type { HtNodeLink, HtTextLocale, HtUrlLocale } from './common'

export interface HtButton {
  id: string
  text: HtTextLocale[]
  url: HtUrlLocale[]
  target?: HtNodeLink
  hidden: string[]
}
