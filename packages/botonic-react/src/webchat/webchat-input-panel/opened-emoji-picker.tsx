import Picker from 'emoji-picker-react'
import React, { LegacyRef } from 'react'

import { ROLES } from '../../constants'
import { useComponentVisible } from '../hooks'
import { OpenedEmojiPickerContainer } from './styles'

interface OpenedEmojiPickerProps {
  onClick: () => void
  onEmojiClick: (event: any) => void
}

export const OpenedEmojiPicker = ({
  onClick,
  onEmojiClick,
}: OpenedEmojiPickerProps) => {
  const { ref, isComponentVisible } = useComponentVisible(true, onClick)
  return (
    <div ref={ref as LegacyRef<HTMLDivElement>}>
      {isComponentVisible && (
        <OpenedEmojiPickerContainer role={ROLES.EMOJI_PICKER}>
          <Picker
            width='100%'
            height='19rem'
            previewConfig={{ showPreview: false }}
            lazyLoadEmojis={true}
            onEmojiClick={onEmojiClick}
            autoFocusSearch={false}
          />
        </OpenedEmojiPickerContainer>
      )}
    </div>
  )
}
