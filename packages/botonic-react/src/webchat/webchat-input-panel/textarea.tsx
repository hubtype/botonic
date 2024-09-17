import React, { useContext } from 'react'
import TextareaAutosize from 'react-textarea-autosize'

import { PersistentMenuTheme } from '../../components/index-types'
import { WEBCHAT } from '../../constants'
import { WebchatContext } from '../../contexts'
import { Typing } from '../../index-types'
import { useDeviceAdapter } from '../hooks'
import { TextAreaContainer } from './styles'

interface TextareaProps {
  host: HTMLElement
  persistentMenu: PersistentMenuTheme
  textareaRef: React.MutableRefObject<HTMLTextAreaElement>
  sendChatEvent: (event: string) => Promise<void>
  sendTextAreaText: () => Promise<void>
}

export const Textarea = ({
  host,
  persistentMenu,
  textareaRef,
  sendChatEvent,
  sendTextAreaText,
}: TextareaProps) => {
  const { getThemeProperty, webchatState } = useContext(WebchatContext)
  const { onFocus, onBlur } = useDeviceAdapter(host, webchatState.isWebchatOpen)

  let isTyping = false
  let typingTimeout

  const persistentMenuOptions = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.persistentMenu,
    persistentMenu
  )

  const onKeyDown = event => {
    if (event.keyCode === 13 && event.shiftKey === false) {
      event.preventDefault()
      sendTextAreaText()
      stopTyping()
    }
  }

  const onKeyUp = () => {
    if (textareaRef.current.value === '') {
      stopTyping()
      return
    }
    if (!isTyping) {
      startTyping()
    }
    clearTimeoutWithReset(true)
  }

  const clearTimeoutWithReset = (reset: boolean) => {
    const waitTime = 20 * 1000
    if (typingTimeout) clearTimeout(typingTimeout)
    if (reset) typingTimeout = setTimeout(stopTyping, waitTime)
  }

  const startTyping = () => {
    isTyping = true
    sendChatEvent(Typing.On)
  }

  const stopTyping = () => {
    clearTimeoutWithReset(false)
    isTyping = false
    sendChatEvent(Typing.Off)
  }

  return (
    <TextAreaContainer>
      <TextareaAutosize
        ref={(ref: HTMLTextAreaElement) => (textareaRef.current = ref)}
        name='text'
        onFocus={onFocus}
        onBlur={onBlur}
        maxRows={4}
        wrap='soft'
        maxLength={1000}
        placeholder={getThemeProperty(
          WEBCHAT.CUSTOM_PROPERTIES.textPlaceholder,
          WEBCHAT.DEFAULTS.PLACEHOLDER
        )}
        autoFocus={false}
        onKeyDown={e => onKeyDown(e)}
        onKeyUp={onKeyUp}
        style={{
          display: 'flex',
          fontSize: 16,
          width: '100%',
          border: 'none',
          resize: 'none',
          overflow: 'auto',
          outline: 'none',
          flex: '1 1 auto',
          padding: 10,
          paddingLeft: persistentMenuOptions ? 0 : 10,
          fontFamily: 'inherit',
          ...getThemeProperty(WEBCHAT.CUSTOM_PROPERTIES.userInputBoxStyle),
        }}
      />
    </TextAreaContainer>
  )
}
