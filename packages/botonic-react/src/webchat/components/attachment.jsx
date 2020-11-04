import React from 'react'
import AttachmentIcon from '../../assets/attachment-icon.svg'
import { ROLES } from '../../constants'
import { Icon, IconContainer } from './common'

export const Attachment = ({ onChange, accept }) => (
  <IconContainer role={ROLES.ATTACHMENT_ICON}>
    <label htmlFor='attachment' style={{ marginTop: 4 }}>
      <Icon src={AttachmentIcon} />
    </label>
    <input
      type='file'
      name='file'
      id='attachment'
      style={{ display: 'none' }}
      onChange={onChange}
      accept={accept}
    ></input>
  </IconContainer>
)
