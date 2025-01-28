import { getBotonicApp } from '@botonic/react'
import * as React from 'react'

import { getLocalContents } from '../../../../shared/locales'
import { CommentSvg } from '../../svgs/comment-svg'
import {
  Container,
  ContainerTriggerButton,
  TriggerButtonImageContainer,
} from './styles'

const BASE_TRIGGER_BUTTON_ID = 'botonic-trigger'

export const TriggerButton = ({
  language,
}: TriggerButtonOptions): React.ReactElement => {
  const contents = getLocalContents(language)
  const triggerRef = React.useRef<HTMLDivElement>(null)

  return (
    <Container>
      <ContainerTriggerButton
        id={`${BASE_TRIGGER_BUTTON_ID}-button`}
        className='no-hover'
        ref={triggerRef}
        onClick={() => getBotonicApp().open()}
        text={contents.triggerButtonText}
      >
        <TriggerButtonImageContainer>
          <CommentSvg />
        </TriggerButtonImageContainer>
      </ContainerTriggerButton>
    </Container>
  )
}
