import { INPUT, Input as CoreInput } from '@botonic/core'
import { useContext, useEffect, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { WEBCHAT } from '../../../constants'
import { WebchatContext } from '../../../contexts'

export const useTextarea = onUserInput => {
  const { sendInput, webchatState } = useContext(WebchatContext)

  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useAutosizeTextArea(textareaRef.current, value)

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
    await sendInput(input as CoreInput)
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

// Updates the height of a <textarea> when the value changes.
const useAutosizeTextArea = (
  textarea: HTMLTextAreaElement | null,
  value: string
) => {
  useEffect(() => {
    if (textarea) {
      // We need to reset the height momentarily to get the correct scrollHeight for the textarea
      textarea.style.height = '0px'
      const scrollHeight = textarea.scrollHeight
      // We then set the height directly, outside of the render loop
      // Trying to set this with state or a ref will product an incorrect value.
      textarea.style.height = scrollHeight + 'px'
    }
  }, [textarea, value])
}
