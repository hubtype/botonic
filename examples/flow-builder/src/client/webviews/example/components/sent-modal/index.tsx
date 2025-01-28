import React from 'react'

import { CheckCircleSvg } from '../../svgs/check-circle-svg'
import { SendedModalContainer } from './styles'

export const SentModal = () => {
  return (
    <SendedModalContainer>
      <CheckCircleSvg />
      Your webview was successfuly submitted
    </SendedModalContainer>
  )
}
