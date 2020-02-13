import { getProperty, _getThemeProperty } from '../src/utils'

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
