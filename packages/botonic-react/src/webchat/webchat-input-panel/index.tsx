import { INPUT } from '@botonic/core'
import React, { useContext } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { WEBCHAT } from '../../constants'
import { WebchatContext } from '../../contexts'
import { getFullMimeWhitelist } from '../../message-utils'
import { DeviceAdapter } from '../devices/device-adapter'
import { Attachment } from './attachment'
import { EmojiPicker } from './emoji-picker'
import { OpenedEmojiPicker } from './opened-emoji-picker'
import { PersistentMenu } from './persistent-menu'
import { SendButton } from './send-button'
import { UserInputContainer } from './styles'
import { Textarea } from './textarea'

interface WebchatInputPanelProps {
  persistentMenu: any
  enableEmojiPicker: boolean
  enableAttachments: boolean
  handleAttachment: (event: any) => void
  textareaRef: React.MutableRefObject<HTMLTextAreaElement>
  deviceAdapter: DeviceAdapter
  onUserInput?: (event: any) => Promise<void>
}

export const WebchatInputPanel = ({
  persistentMenu,
  enableEmojiPicker,
  enableAttachments,
  handleAttachment,
  textareaRef,
  deviceAdapter,
  onUserInput,
}: WebchatInputPanelProps) => {
  const {
    getThemeProperty,
    sendText,
    togglePersistentMenu,
    toggleEmojiPicker,
    webchatState,
  } = useContext(WebchatContext)

  const handleSelectedEmoji = event => {
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
    await sendText(textareaRef.current.value)
    textareaRef.current.value = ''
  }

  const sendChatEvent = async chatEvent => {
    const chatEventInput = {
      id: uuidv4(),
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
      style={{
        ...getThemeProperty(WEBCHAT.CUSTOM_PROPERTIES.userInputStyle),
      }}
      className='user-input-container'
    >
      {webchatState.isEmojiPickerOpen && (
        <OpenedEmojiPicker
          // height={webchatState.theme.style.height} // Revisar si es necessari, en el WebchatStateTheme no hi ha style.height, pero en el Theme props style es any.
          onEmojiClick={handleSelectedEmoji}
          onClick={handleEmojiClick}
        />
      )}

      <PersistentMenu onClick={handleMenu} persistentMenu={persistentMenu} />

      <Textarea
        deviceAdapter={deviceAdapter}
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
