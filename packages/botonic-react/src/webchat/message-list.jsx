import React, { useContext } from 'react'
import { WebchatContext } from '../contexts'
import { StyledScrollbar } from './components/styled-scrollbar'
import { resolveImage, ConditionalWrapper } from '../utils'
import Fade from 'react-reveal/Fade'
import styled from 'styled-components'

const StyledMessages = styled.div`
  display: flex;
  overflow-x: hidden;
  flex-direction: column;
  flex: none;
  white-space: pre;
  word-wrap: break-word;
`

const DefaultIntroImage = styled.img`
  max-height: 50%;
  width: 100%;
`

export const WebchatMessageList = props => {
  const { webchatState, getThemeProperty } = useContext(WebchatContext)
  const animationsEnabled = getThemeProperty('animations.enable', true)
  const CustomIntro = getThemeProperty('intro.custom')
  const introImage = getThemeProperty('intro.image')
  const introStyle = getThemeProperty('intro.style')

  const scrollbarOptions = {
    ...{ enable: true, autoHide: true },
    ...getThemeProperty('scrollbar'),
  }

  const DefaultIntro = introImage && (
    <DefaultIntroImage
      style={{
        ...introStyle,
      }}
      src={resolveImage(introImage)}
    />
  )

  return (
    <StyledScrollbar
      // TODO: Distinguis between multiple instances of webchat, e.g. `${uniqueId}-botonic-scrollable`
      id='botonic-scrollable-content'
      scrollbar={scrollbarOptions}
      autoHide={scrollbarOptions.autoHide}
      ismessagescontainer='true'
      style={{
        ...props.style,
      }}
    >
      {(CustomIntro || DefaultIntro) && (
        <ConditionalWrapper
          condition={animationsEnabled}
          wrapper={children => <Fade>{children}</Fade>}
        >
          {CustomIntro ? <CustomIntro /> : DefaultIntro}
        </ConditionalWrapper>
      )}
      {webchatState.messagesComponents.map((e, i) => (
        <StyledMessages key={i}>{e}</StyledMessages>
      ))}
      {props.children}
    </StyledScrollbar>
  )
}
