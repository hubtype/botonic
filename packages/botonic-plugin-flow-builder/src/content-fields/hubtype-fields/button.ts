import {
  HtNodeLink,
  HtPayloadLocale,
  HtTextLocale,
  HtUrlLocale,
} from './common'

export interface HtButton {
  id: string
  text: HtTextLocale[]
  url: HtUrlLocale[]
  payload: HtPayloadLocale[]
  target?: HtNodeLink
  hidden: string[]
}
