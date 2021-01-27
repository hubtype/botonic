import { WEBCHAT } from '../constants'
import { getProperty } from './objects'

/**
 * Returns the value of a property defined in bot's theme based on WEBCHAT.CUSTOM_PROPERTIES dictionary.
 * It gives preference to nested defined properties (e.g.: header.style) over plain properties (e.g.: headerStyle).
 * If property doesn't exist, returns the defaultValue.
 */
export const _getThemeProperty = theme => (
  property,
  defaultValue = undefined
) => {
  for (const [k, v] of Object.entries(WEBCHAT.CUSTOM_PROPERTIES)) {
    if (v == property) {
      const nestedProperty = getProperty(theme, v)
      if (nestedProperty !== undefined) return nestedProperty
      const plainProperty = getProperty(theme, k)
      if (plainProperty !== undefined) return plainProperty
      return defaultValue
    }
  }
  return undefined
}

export class ButtonsDisabler {
  static getPropertiesFromTheme(theme) {
    const getThemeProperty = _getThemeProperty(theme)
    const buttonsAutoDisable = getThemeProperty(
      WEBCHAT.CUSTOM_PROPERTIES.buttonAutoDisable,
      false
    )
    const buttonsDisabledStyle = getThemeProperty(
      WEBCHAT.CUSTOM_PROPERTIES.buttonDisabledStyle,
      WEBCHAT.DEFAULTS.BUTTON_DISABLED_STYLE
    )
    return { buttonsAutoDisable, buttonsDisabledStyle }
  }
}
