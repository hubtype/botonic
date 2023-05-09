import React, { useContext, useRef } from 'react'

import AttachmentIcon from '../../assets/attachment-icon.svg'
import { ROLES, WEBCHAT } from '../../constants'
import { WebchatContext } from '../../contexts'
import { ConditionalAnimation } from '../components/conditional-animation'
import { Icon } from './common'

export const Attachment = ({ onChange, accept, enableAttachments }) => {
  const { getThemeProperty } = useContext(WebchatContext)

  const fileInputRef = useRef(null)

  const CustomAttachments = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.customAttachments,
    undefined
  )

  const isAttachmentsEnabled = () => {
    const hasCustomAttachments = !!CustomAttachments
    return (
      getThemeProperty(
        WEBCHAT.CUSTOM_PROPERTIES.enableAttachments,
        enableAttachments
      ) ?? hasCustomAttachments
    )
  }
  const attachmentsEnabled = isAttachmentsEnabled()

  const handleOnChange = event => {
    onChange(event)
    fileInputRef.current.value = null
  }

  return (
    <>
      {attachmentsEnabled ? (
        <ConditionalAnimation>
          <div role={ROLES.ATTACHMENT_ICON}>
            <label htmlFor='attachment' style={{ marginTop: 4 }}>
              {CustomAttachments ? (
                <CustomAttachments />
              ) : (
                <Icon src={AttachmentIcon} />
              )}
            </label>
            <input
              ref={fileInputRef}
              type='file'
              name='file'
              id='attachment'
              style={{ display: 'none' }}
              onChange={handleOnChange}
              accept={accept}
            />
          </div>
        </ConditionalAnimation>
      ) : null}
    </>
  )
}
