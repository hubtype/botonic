import React, { useContext, useRef } from 'react'

import AttachmentIcon from '../../assets/attachment-icon.svg'
import { ROLES, WEBCHAT } from '../../constants'
import { WebchatContext } from '../../webchat/context'
import { Icon } from '../components/common'
import { ConditionalAnimation } from '../components/conditional-animation'

interface AttachmentProps {
  accept: string
  enableAttachments?: boolean
  onChange: (event: any) => void
}

export const Attachment = ({
  accept,
  enableAttachments,
  onChange,
}: AttachmentProps) => {
  const { getThemeProperty } = useContext(WebchatContext)

  const fileInputRef = useRef<HTMLInputElement | null>(null)

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
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
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
