import React, { useContext } from 'react'
import { WebchatContext } from '../contexts'
import { StyledScrollbar } from './styled-scrollbar'
import { staticAsset, ConditionalWrapper } from '../utils'
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

export const WebchatMessageList = props => {
  const { webchatState, getThemeProperty } = useContext(WebchatContext)
  const animationsEnabled = getThemeProperty('animations.enable', true)
  const CustomIntro = getThemeProperty('intro.custom', undefined)
  const introImage = getThemeProperty('intro.image', undefined)
  const introStyle = getThemeProperty('intro.style', {})

  const scrollbarOptions = {
    ...{ enable: true, autoHide: true },
    ...getThemeProperty('scrollbar', {}),
  }

  const DefaultIntro = introImage && (
    <img
      style={{
        maxHeight: '50%',
        width: '100%',
        ...introStyle,
      }}
      src={staticAsset(introImage)}
    />
  )

  return (
    <StyledScrollbar
      scrollbar={scrollbarOptions}
      data-simplebar-auto-hide={scrollbarOptions.autoHide}
      style={{
        ...(props.style || {}),
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        overflowX: 'hidden',
      }}
    >
      <ConditionalWrapper
        condition={animationsEnabled}
        wrapper={children => <Fade>{children}</Fade>}
      >
        {CustomIntro ? <CustomIntro /> : DefaultIntro}
      </ConditionalWrapper>
      {webchatState.messagesComponents.map((e, i) => (
        <StyledMessages key={i}>{e}</StyledMessages>
      ))}
      {props.children}
    </StyledScrollbar>
  )
}
