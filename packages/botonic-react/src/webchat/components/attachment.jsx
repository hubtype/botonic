import React, { useContext } from 'react'

import AttachmentIcon from '../../assets/attachment-icon.svg'
import { ROLES, WEBCHAT } from '../../constants'
import { WebchatContext } from '../../contexts'
import { Icon, IconContainer } from './common'

export const Attachment = ({ onChange, accept, customAttacments }) => {
  const { getThemeProperty } = useContext(WebchatContext)

  const CustomAttachments = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.customAttachments,
    undefined
  )
  return (
    <IconContainer role={ROLES.ATTACHMENT_ICON}>
      <label htmlFor='attachment' style={{ marginTop: 4 }}>
        {CustomAttachments ? (
          <CustomAttachments />
        ) : (
          <Icon src={AttachmentIcon} />
        )}
      </label>
      <input
        type='file'
        name='file'
        id='attachment'
        style={{ display: 'none' }}
        onChange={onChange}
        accept={accept}
      />
    </IconContainer>
  )
}
