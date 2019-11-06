import { getProperty } from '../src/utils'
import { CUSTOM_WEBCHAT_PROPERTIES } from '../src/constants'

let theme = {
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

let anotherTheme = {
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

const getThemeProperty = (property, defaultValue = undefined) => {
  for (let [k, v] of Object.entries(CUSTOM_WEBCHAT_PROPERTIES)) {
    if (v == property) {
      let nestedProperty = getProperty(theme, v)
      let plainProperty = getProperty(theme, k)
      if (nestedProperty !== undefined) return nestedProperty
      if (plainProperty !== undefined) return plainProperty
      return defaultValue
    }
  }
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
  it('gives preference to nested property', () => {
    expect(getThemeProperty('message.bot.image')).toBe('DefaultLogoPathNested')
  })
})
