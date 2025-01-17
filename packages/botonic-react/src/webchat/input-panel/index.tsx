import { INPUT } from '@botonic/core'
import React, { useContext } from 'react'
import { v7 as uuidv7 } from 'uuid'

import { WEBCHAT } from '../../constants'
import { getFullMimeWhitelist } from '../../message-utils'
import { WebchatContext } from '../../webchat/context'
import { BotonicContainerId } from '../constants'
import { Attachment } from './attachment'
import { EmojiPicker } from './emoji-picker'
import { OpenedEmojiPicker } from './opened-emoji-picker'
import { PersistentMenu } from './persistent-menu'
import { SendButton } from './send-button'
import { UserInputContainer } from './styles'
import { Textarea } from './textarea'

interface InputPanelProps {
  persistentMenu: any
  enableEmojiPicker?: boolean
  enableAttachments?: boolean
  handleAttachment: (event: any) => void
  textareaRef: React.MutableRefObject<HTMLTextAreaElement | undefined>
  host: HTMLElement
  onUserInput?: (event: any) => Promise<void>
}

export const InputPanel = ({
  persistentMenu,
  enableEmojiPicker,
  enableAttachments,
  handleAttachment,
  textareaRef,
  host,
  onUserInput,
}: InputPanelProps) => {
  const {
    getThemeProperty,
    sendText,
    togglePersistentMenu,
    toggleEmojiPicker,
    webchatState,
    inputPanelRef,
  } = useContext(WebchatContext)

  const handleSelectedEmoji = event => {
    if (!textareaRef.current) return

    textareaRef.current.value += event.emoji
    textareaRef.current.focus()
  }

  const handleEmojiClick = () => {
    toggleEmojiPicker(!webchatState.isEmojiPickerOpen)
  }

  const handleMenu = () => {
    togglePersistentMenu(!webchatState.isPersistentMenuOpen)
  }

  const sendTextAreaText = async () => {
    if (!textareaRef.current) return

    await sendText(textareaRef.current?.value)
    textareaRef.current.value = ''
  }

  const sendChatEvent = async chatEvent => {
    const chatEventInput = {
      id: uuidv7(),
      type: INPUT.CHAT_EVENT,
      data: chatEvent,
    }
    if (onUserInput) {
      onUserInput({
        user: webchatState.session.user,
        input: chatEventInput,
        session: webchatState.session,
        lastRoutePath: webchatState.lastRoutePath,
      })
    }
  }

  return (
    <UserInputContainer
      id={BotonicContainerId.InputPanel}
      ref={inputPanelRef}
      style={{
        ...getThemeProperty(WEBCHAT.CUSTOM_PROPERTIES.userInputStyle),
      }}
      className='user-input-container'
    >
      {webchatState.isEmojiPickerOpen && (
        <OpenedEmojiPicker
          onEmojiClick={handleSelectedEmoji}
          onClick={handleEmojiClick}
        />
      )}

      <PersistentMenu onClick={handleMenu} persistentMenu={persistentMenu} />

      <Textarea
        host={host}
        persistentMenu={persistentMenu}
        textareaRef={textareaRef}
        sendChatEvent={sendChatEvent}
        sendTextAreaText={sendTextAreaText}
      />

      <EmojiPicker
        enableEmojiPicker={enableEmojiPicker}
        onClick={handleEmojiClick}
      />

      <Attachment
        enableAttachments={enableAttachments}
        onChange={handleAttachment}
        accept={getFullMimeWhitelist().join(',')}
      />

      <SendButton onClick={sendTextAreaText} />
    </UserInputContainer>
  )
}
