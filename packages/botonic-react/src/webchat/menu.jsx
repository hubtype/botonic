import React, { useContext, useState } from 'react'
import { WebchatContext } from '../contexts'
import { Flex } from '@rebass/grid'
import { Button } from '../components/button'
import { WebchatMessageList } from './messageList'
import Textarea from 'react-textarea-autosize'

const DefaultMenu = () => {
  const { webchatState } = useContext(WebchatContext)
  return (
    <Textarea
      name='text'
      minRows={2}
      maxRows={4}
      wrap='soft'
      maxLength='1000'
      placeholder={webchatState.theme.textPlaceholder}
      autoFocus={location.hostname === 'localhost'}
      inputRef={textArea}
      onKeyDown={e => onKeyDown(e)}
      style={{
        display: 'flex',
        padding: '8px 10px',
        fontSize: 14,
        border: 'none',
        borderTop: '1px solid rgba(0, 0, 0, 0.4)',
        resize: 'none',
        overflow: 'auto',
        outline: 'none'
      }}
    />
  )
}

export const WebchatMenu = props => {
  const { webchatState } = useContext(WebchatContext)
  if (webchatState.theme.customMenu) {
    let CustomMenu = webchatState.theme.customMenu
    return <CustomMenu />
  }
  return <DefaultMenu />
}
