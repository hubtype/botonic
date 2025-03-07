import React, { useContext, useRef } from 'react'

import AttachmentIcon from '../../assets/attachment-icon.svg'
import { ROLES, WEBCHAT } from '../../constants'
import { WebchatContext } from '../../webchat/context'
import { Icon } from '../components/common'
import { ConditionalAnimation } from '../components/conditional-animation'

interface AttachmentProps {
  accept: string
  onChange: (event: any) => void
}

export const Attachment = ({ accept, onChange }: AttachmentProps) => {
  const { webchatState } = useContext(WebchatContext)

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const CustomAttachments = webchatState.theme.userInput?.attachments?.custom

  const isAttachmentsEnabled = () => {
    const hasCustomAttachments = !!CustomAttachments
    return (
      webchatState.theme.userInput?.attachments?.enable || hasCustomAttachments
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
