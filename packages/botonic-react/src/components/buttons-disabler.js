import { Button } from '../components/button'
import { WEBCHAT } from '../constants'
import { isCarousel } from '../message-utils'
import { strToBool } from '../util/objects'
import { deepMapWithIndex } from '../util/react'
import { _getThemeProperty } from '../util/webchat'

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
      disabled: props.disabled,
      autodisable: props.autodisable,
      disabledstyle: props.disabledstyle,
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
    const computedDisabledStyle =
      props.disabledstyle !== undefined
        ? props.disabledstyle
        : getThemeProperty(WEBCHAT.CUSTOM_PROPERTIES.buttonDisabledStyle, {})

    const disabledStyle = {
      ...WEBCHAT.DEFAULTS.BUTTON_DISABLED_STYLE,
      ...computedDisabledStyle,
    }
    return { autoDisable, disabledStyle }
  }

  static updateChildrenButtons(children, additionalProps = undefined) {
    return deepMapWithIndex(children, n => {
      if (n.type === Button) return this.updateButtons(n, additionalProps)
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
        },
      }
    }
    if (
      isCarousel(messageToUpdate) &&
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
