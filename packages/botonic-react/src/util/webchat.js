import { INPUT } from '@botonic/core'

import { Button } from '../components/button'
import { WEBCHAT } from '../constants'
import { getProperty, strToBool } from './objects'
import { deepMapWithIndex } from './react'

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
  static constructBrowserProps(props) {
    const disabledProps = { disabled: props.disabled }
    if (props.autodisable !== undefined)
      disabledProps.autodisable = strToBool(props.autodisable)
    if (props.disabledstyle !== undefined)
      disabledProps.disabledstyle = props.disabledstyle
    return disabledProps
  }
  static constructNodeProps(props) {
    const disabledProps = {}
    if (props.autodisable !== undefined)
      disabledProps.autodisable = String(props.autodisable)
    if (props.disabledstyle !== undefined)
      disabledProps.disabledstyle = JSON.stringify(props.disabledstyle)
    return disabledProps
  }

  static withDisabledProps(props) {
    return {
      ...{ disabled: props.disabled },
      ...{ autodisable: props.autodisable },
      ...{ disabledstyle: props.disabledstyle },
    }
  }

  static resolveDisabling(theme, props) {
    const getThemeProperty = _getThemeProperty(theme)
    const autoDisable =
      props.autodisable !== undefined
        ? props.autodisable
        : getThemeProperty(
            WEBCHAT.CUSTOM_PROPERTIES.buttonAutoDisable,
            WEBCHAT.DEFAULTS.BUTTON_AUTO_DISABLE
          )
    const disabledStyle =
      props.disabledstyle !== undefined
        ? props.disabledstyle
        : getThemeProperty(
            WEBCHAT.CUSTOM_PROPERTIES.buttonDisabledStyle,
            WEBCHAT.DEFAULTS.BUTTON_DISABLED_STYLE
          )
    return { autoDisable, disabledStyle }
  }

  static updateChildrenButtons(children, additionalProps = undefined) {
    return deepMapWithIndex(children, n => {
      if (n.type === Button) return this.updateButtons(n, additionalProps)
      if (n.props && n.props.children) {
        return {
          ...n,
          ...{
            props: {
              ...n.props,
              ...{ children: deepMapWithIndex(n.props.children, n => n) },
            },
          },
        }
      }
      return n
    })
  }

  static updateButtons(node, additionalProps) {
    if (!additionalProps) additionalProps = {}
    else {
      additionalProps = {
        disabled:
          node.props.disabled === true
            ? node.props.disabled
            : additionalProps.disabled,
        setDisabled: additionalProps.setDisabled,
        parentId: additionalProps.parentId,
      }
    }
    return {
      ...node,
      props: {
        ...node.props,
        autodisable: node.props.autodisable,
        disabledstyle: node.props.disabledstyle,
        ...additionalProps,
      },
    }
  }

  static getUpdatedMessage(messageToUpdate, { autoDisable, disabledStyle }) {
    const updateMsgButton = button => {
      return {
        ...button,
        ...{
          disabled: true,
          autodisable:
            button.autodisable !== undefined ? button.autodisable : autoDisable,
          disabledstyle:
            button.disabledstyle !== undefined
              ? button.disabledstyle
              : disabledStyle,
        },
      }
    }
    if (
      messageToUpdate.type === INPUT.CAROUSEL &&
      messageToUpdate.data &&
      messageToUpdate.data.elements
    ) {
      messageToUpdate.data.elements = messageToUpdate.data.elements.map(e => ({
        ...e,
        ...{
          buttons: e.buttons.map(updateMsgButton),
        },
      }))
      return messageToUpdate
    } else {
      return {
        ...messageToUpdate,
        ...{
          buttons: messageToUpdate.buttons.map(updateMsgButton),
        },
      }
    }
  }
}
