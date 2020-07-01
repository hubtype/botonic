import { getProperty, _getThemeProperty } from '../src/utils'
import { normalizeWebchatSettings } from '../src/components/webchat-settings'
import merge from 'lodash.merge'

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
    expect(getProperty(theme, 'message.bot.image')).toBe(
      'DefaultLogoPathNested'
    )
  })

  it("doesn't found the property", () => {
    expect(getProperty(theme, 'message.bot.imageeeeeee')).toBe(undefined)
  })

  it("returns undefined if theme doesn't exist", () => {
    expect(getProperty(undefined, 'message.bot.image')).toBe(undefined)
  })

  it('returns null if property is set to null', () => {
    expect(getProperty(anotherTheme, 'message.bot.image')).toBe(null)
  })
})

describe('getThemeProperty', () => {
  const getThemeProperty = _getThemeProperty(theme)
  it('gives preference to nested property', () => {
    expect(getThemeProperty('message.bot.image')).toBe('DefaultLogoPathNested')
  })
})

describe('Updating webchat properties with settings ', () => {
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
        persistentMenu: [
          {
            label: 'Start',
            payload: 'start',
          },
          {
            label: 'Help',
            payload: 'help',
          },
          { closeLabel: 'close' },
        ],
      },
    }
    const theme2 = {
      theme: {
        userInput: {
          style: {
            background: 'white',
            minHeight: '45px',
          },
          box: {
            style: {
              border: 'none',
              paddingLeft: 20,
              marginRight: 10,
            },
            placeholder: 'another placeholder...',
          },
          menu: {
            darkBackground: true,
          },
        },
      },
    }
    const result = {
      theme: {
        userInput: {
          box: {
            placeholder: 'another placeholder...',
            style: {
              border: 'none',
              paddingLeft: 20,
              marginRight: 10,
            },
          },
          style: { background: 'white', minHeight: '45px' },
          menu: { darkBackground: true },
        },
        header: { title: 'title' },
        persistentMenu: [
          { label: 'Start', payload: 'start' },
          { label: 'Help', payload: 'help' },
          { closeLabel: 'close' },
        ],
      },
    }
    const sut = merge(theme1, theme2)
    expect(sut).toMatchObject(result)
  })
})
