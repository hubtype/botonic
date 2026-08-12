import type React from 'react'
import { useContext } from 'react'
import TextareaAutosize from 'react-textarea-autosize'

import { WebchatContext } from '../../webchat/context'
import { useDeviceAdapter } from '../hooks'
import { TextAreaContainer } from './styles'
import type { TypingChatEvent } from './typing-network-sender'
import { useTypingSession } from './use-typing-session'

interface TextareaProps {
  host: HTMLElement
  textareaRef: React.MutableRefObject<HTMLTextAreaElement | undefined>
  sendChatEvent: (event: TypingChatEvent) => Promise<boolean>
  sendTextAreaText: () => Promise<void>
}

export { TYPING_IDLE_MS } from './use-typing-session'

export const Textarea = ({
  host,
  textareaRef,
  sendChatEvent,
  sendTextAreaText,
}: TextareaProps) => {
  const { webchatState, setIsInputFocused } = useContext(WebchatContext)
  // UI layer: decides when the user is typing. Network dedup lives in sendChatEvent.
  const { stopTyping, onTextChange } = useTypingSession(sendChatEvent)

  useDeviceAdapter(host, webchatState.isWebchatOpen)

  const persistentMenuOptions = webchatState.theme.userInput?.persistentMenu
  const placeholder = webchatState.theme.userInput?.box?.placeholder
  const userInputBoxStyle = webchatState.theme.userInput?.box?.style

  const onKeyDown = async event => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      // Run in parallel: stop typing must not wait for sendTextAreaText to finish.
      await Promise.all([stopTyping(), sendTextAreaText()])
    }
  }

  return (
    <TextAreaContainer>
      <TextareaAutosize
        ref={(ref: HTMLTextAreaElement) => {
          textareaRef.current = ref
        }}
        onFocus={() => setIsInputFocused(true)}
        onBlur={async () => {
          setIsInputFocused(false)
          await stopTyping()
        }}
        onChange={async event => {
          await onTextChange(event.target.value)
        }}
        name='text'
        maxRows={4}
        wrap='soft'
        maxLength={1000}
        placeholder={placeholder}
        autoFocus={false}
        onKeyDown={onKeyDown}
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
