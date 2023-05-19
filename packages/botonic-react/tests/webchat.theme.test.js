import merge from 'lodash.merge'

import { normalizeWebchatSettings } from '../lib/cjs/components/webchat-settings'
import { WEBCHAT } from '../lib/cjs/constants'
import { getProperty } from '../lib/cjs/util/objects'
import { _getThemeProperty } from '../lib/cjs/util/webchat'

const theme = {
  message: {
    bot: {
      image: 'DefaultLogoPathNested',
      style: {
        border: 'none',
        color: 'blue',
        borderRadius: '20px',
      },
    },
  },
  botMessageImage: 'DefaultLogoPath',
}

const anotherTheme = {
  message: {
    bot: {
      image: null,
      style: {
        border: 'none',
        color: 'blue',
        borderRadius: '20px',
      },
    },
  },
  botMessageImage: null,
}

describe('getProperty', () => {
  it('founds directly the property', () => {
    expect(getProperty(theme, 'botMessageImage')).toBe('DefaultLogoPath')
  })

  it('founds the nested property', () => {
    expect(getProperty(theme, WEBCHAT.CUSTOM_PROPERTIES.botMessageImage)).toBe(
      'DefaultLogoPathNested'
    )
  })

  it("doesn't found the property", () => {
    expect(getProperty(theme, 'message.bot.imageeeeeee')).toBe(undefined)
  })

  it("returns undefined if theme doesn't exist", () => {
    expect(
      getProperty(undefined, WEBCHAT.CUSTOM_PROPERTIES.botMessageImage)
    ).toBe(undefined)
  })

  it('returns null if property is set to null', () => {
    expect(
      getProperty(anotherTheme, WEBCHAT.CUSTOM_PROPERTIES.botMessageImage)
    ).toBe(null)
  })
})

describe('getThemeProperty', () => {
  const getThemeProperty = _getThemeProperty(theme)
  it('gives preference to nested property', () => {
    expect(getThemeProperty(WEBCHAT.CUSTOM_PROPERTIES.botMessageImage)).toBe(
      'DefaultLogoPathNested'
    )
  })
})

describe('Updating webchat properties with settings', () => {
  it('normalizes correctly to nested theme properties', () => {
    const newTheme = { brand: { color: 'red' }, userInput: { enable: true } }
    const newBlockInputs = [
      {
        match: [/ugly/i, /bastard/i],
        message: 'We cannot tolerate these kind of words.',
      },
    ]
    const newPersistentMenu = [
      { label: 'option1', payload: 'payload1' },
      { label: 'option2', payload: 'payload2' },
    ]
    const newEnableEmojiPicker = true
    const newEnableAttachments = false
    const settings = {
      theme: newTheme,
      blockInputs: newBlockInputs,
      persistentMenu: newPersistentMenu,
      enableEmojiPicker: newEnableEmojiPicker,
      enableAttachments: newEnableAttachments,
    }
    const themeUpdates = normalizeWebchatSettings(settings)
    expect(themeUpdates).toMatchObject(newTheme)
    expect(themeUpdates.userInput.blockInputs).toEqual(newBlockInputs)
    expect(themeUpdates.userInput.persistentMenu).toEqual(newPersistentMenu)
    expect(themeUpdates.userInput.emojiPicker.enable).toEqual(
      newEnableEmojiPicker
    )
    expect(themeUpdates.userInput.attachments.enable).toEqual(
      newEnableAttachments
    )
  })
})

describe('Deep merging theme properties', () => {
  it('Preserve theme deep properties', () => {
    const theme1 = {
      theme: {
        userInput: { box: { placeholder: 'placeholder...' } },
        header: {
          title: 'title',
        },
      },
    }
    const theme2 = {
      theme: {
        userInput: {
          style: {
            background: 'white',
            minHeight: '45px',
          },
        },
      },
    }
    const result = {
      theme: {
        userInput: {
          box: {
            placeholder: 'placeholder...',
          },
          style: {
            background: 'white',
            minHeight: '45px',
          },
        },
        header: { title: 'title' },
      },
    }
    const sut = merge(theme1, theme2)
    expect(sut).toMatchObject(result)
  })
})
