import React, { useRef } from 'react'

import AttachmentIcon from '../../assets/attachment-icon.svg'
import { ROLES } from '../../constants'
import { Icon, IconContainer } from './common'

export const Attachment = ({ onChange, accept }) => {
  const inputRef = useRef(null);

  const showInputModal = (e) => {
    if (inputRef.current) {
      e.stopPropagation();
      inputRef.current.value = '';
      inputRef.current.click();
    }
  };

  return (
    <IconContainer role={ROLES.ATTACHMENT_ICON} onClick={showInputModal}>
      <label style={{ marginTop: 4 }}>
        <Icon src={AttachmentIcon} />
      </label>
      <input
        ref={inputRef}
        type='file'
        name='file'
        id='attachment'
        style={{ display: 'none' }}
        onChange={onChange}
        accept={accept}
      ></input>
    </IconContainer>
  )
}
