import { EventAction } from '@botonic/core'

import { SplitSvg } from '../icons/split'

export interface ConditionalCountryDebugEvent {
  action: EventAction.ConditionalCountry
  country: string
}
