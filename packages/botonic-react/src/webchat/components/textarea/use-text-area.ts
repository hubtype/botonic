import { INPUT } from '@botonic/core'
import { useContext, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { WEBCHAT } from '../../../constants'
import { WebchatContext } from '../../../contexts'

export const useTextarea = (onUserInput, webchatState, sendInput) => {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.target.value)
  }

  const handleAddEmoji = (emoji: string) => {
    setValue(value + emoji)
    textareaFocus()
  }

  const textareaFocus = () => {
    textareaRef.current?.focus()
  }
  const sendChatEvent = async chatEvent => {
    const chatEventInput = {
      id: uuidv4(),
      type: INPUT.CHAT_EVENT,
      data: chatEvent,
    }
    onUserInput &&
      onUserInput({
        user: webchatState.session.user,
        input: chatEventInput,
        session: webchatState.session,
        lastRoutePath: webchatState.lastRoutePath,
      })
  }
  let isTyping = false
  let typingTimeout

  const clearTimeoutWithReset = reset => {
    const waitTime = 20 * 1000
    if (typingTimeout) clearTimeout(typingTimeout)
    if (reset) typingTimeout = setTimeout(stopTyping, waitTime)
  }

  const startTyping = () => {
    isTyping = true
    sendChatEvent('typing_on')
  }

  const stopTyping = () => {
    clearTimeoutWithReset(false)
    isTyping = false
    sendChatEvent('typing_off')
  }

  const onKeyDown = event => {
    if (event.keyCode === 13 && event.shiftKey === false) {
      event.preventDefault()
      sendTextAreaText()
      stopTyping()
    }
  }

  const onKeyUp = () => {
    if (value === '') {
      stopTyping()
      return
    }
    if (!isTyping) {
      startTyping()
    }
    clearTimeoutWithReset(true)
  }

  const sendTextAreaText = async () => {
    if (!value) return
    const input = { type: INPUT.TEXT, data: value, payload: undefined }
    console.log({ input })
    await sendInput(input)
    setValue('')
  }

  const { getThemeProperty } = useContext(WebchatContext)
  const webchatCustom =
    getThemeProperty(WEBCHAT.CUSTOM_PROPERTIES.userInputBoxStyle) || {}

  return {
    handleAddEmoji,
    handleChange,
    onKeyDown,
    onKeyUp,
    sendTextAreaText,
    textareaFocus,
    textareaRef,
    value,
    webchatCustom,
  }
}
