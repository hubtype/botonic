import * as React from 'react'

import { Language } from '../../../../shared/locales'
import { TriggerButton } from '../shared/button'
import { WebchatOptions } from '../shared/types'

export const InitialTriggerButton = (
  opt: WebchatOptions
): React.ReactElement => {
  return <TriggerButton language={opt.language as Language} />
}
