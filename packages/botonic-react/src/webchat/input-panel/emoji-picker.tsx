/** biome-ignore-all lint/a11y/noStaticElementInteractions: we need to use static elements for the emoji picker */
/** biome-ignore-all lint/a11y/useKeyWithClickEvents: we need to use key with click events for the emoji picker */
import { useContext } from 'react'

import LogoEmoji from '../../assets/emojiButton.svg'
import { ROLES } from '../../constants'
import { WebchatContext } from '../../webchat/context'
import { Icon } from '../components/common'
import { ConditionalAnimation } from '../components/conditional-animation'

interface EmojiPickerProps {
  onClick: () => void
}

export const EmojiPicker = ({ onClick }: EmojiPickerProps) => {
  const { webchatState } = useContext(WebchatContext)

  const CustomEmojiPicker = webchatState.theme.userInput?.emojiPicker?.custom

  const isEmojiPickerEnabled = () => {
    const hasCustomEmojiPicker = !!CustomEmojiPicker
    return (
      webchatState.theme.userInput?.emojiPicker?.enable ?? hasCustomEmojiPicker
    )
  }
  const emojiPickerEnabled = isEmojiPickerEnabled()

  const handleClick = (event: any) => {
    onClick()
    event.stopPropagation()
  }

  return (
    <>
      {emojiPickerEnabled ? (
        <ConditionalAnimation>
          <div role={ROLES.EMOJI_PICKER_ICON} onClick={handleClick}>
            {CustomEmojiPicker ? (
              <CustomEmojiPicker />
            ) : (
              <Icon src={LogoEmoji} />
            )}
          </div>
        </ConditionalAnimation>
      ) : null}
    </>
  )
}
