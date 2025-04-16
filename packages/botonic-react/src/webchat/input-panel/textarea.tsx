import React, { useContext } from 'react'
import TextareaAutosize from 'react-textarea-autosize'

import { WEBCHAT } from '../../constants'
import { Typing } from '../../index-types'
import { WebchatContext } from '../../webchat/context'
import { useDeviceAdapter } from '../hooks'
import { TextAreaContainer } from './styles'

interface TextareaProps {
  host: HTMLElement
  textareaRef: React.MutableRefObject<HTMLTextAreaElement | undefined>
  sendChatEvent: (event: string) => Promise<void>
  sendTextAreaText: () => Promise<void>
}

export const Textarea = ({
  host,
  textareaRef,
  sendChatEvent,
  sendTextAreaText,
}: TextareaProps) => {
  const { webchatState, setIsInputFocused } = useContext(WebchatContext)

  useDeviceAdapter(host, webchatState.isWebchatOpen)

  let isTyping = false
  let typingTimeout

  const persistentMenuOptions = webchatState.theme.userInput?.persistentMenu

  const placeholder = webchatState.theme.userInput?.box?.placeholder

  const userInputBoxStyle = webchatState.theme.userInput?.box?.style

  const onKeyDown = event => {
    if (event.keyCode === 13 && event.shiftKey === false) {
      event.preventDefault()
      sendTextAreaText()
      stopTyping()
    }
  }

  const onKeyUp = () => {
    if (!textareaRef.current) return

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

  const handleFocus = () => {
    setIsInputFocused(true)
  }

  const handleBlur = () => {
    setIsInputFocused(false)
  }

  return (
    <TextAreaContainer>
      <TextareaAutosize
        ref={(ref: HTMLTextAreaElement) => (textareaRef.current = ref)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        name='text'
        maxRows={4}
        wrap='soft'
        maxLength={1000}
        placeholder={placeholder}
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
          ...userInputBoxStyle,
        }}
      />
    </TextAreaContainer>
  )
}
