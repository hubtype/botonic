/* eslint-disable @typescript-eslint/no-explicit-any */
import type React from 'react'

import type { WebchatMessage } from '../index-types'
import { isCarousel } from '../message-utils'
import { strToBool } from '../util/objects'
import { deepMapWithIndex } from '../util/react'
import { Button } from './button'
import type { ButtonProps } from './index-types'

interface DisabledProps {
  disabled?: boolean
  autodisable?: boolean | string
  disabledstyle?: Record<string, string> | string
}

interface AdditionalProps {
  parentId: string
  disabled?: boolean
  setDisabled: (disabled: boolean) => void
}
// biome-ignore lint/complexity/noStaticOnlyClass: ButtonsDisabler is a static class and should not be instantiated
export class ButtonsDisabler {
  static constructBrowserProps(props: DisabledProps): DisabledProps {
    const disabledProps: DisabledProps = {}
    if (props.autodisable !== undefined) {
      disabledProps.autodisable = strToBool(props.autodisable)
    }
    if (props.disabledstyle !== undefined) {
      disabledProps.disabledstyle = props.disabledstyle
    }
    return disabledProps
  }

  static constructNodeProps(props: DisabledProps): DisabledProps {
    const disabledProps: DisabledProps = {}
    if (props.autodisable !== undefined) {
      disabledProps.autodisable = String(props.autodisable)
    }
    if (props.disabledstyle !== undefined) {
      disabledProps.disabledstyle = JSON.stringify(props.disabledstyle)
    }
    return disabledProps
  }

  static withDisabledProps(props: DisabledProps): DisabledProps {
    return {
      disabled: props.disabled,
      autodisable: props.autodisable,
      disabledstyle: props.disabledstyle,
    }
  }

  static updateChildrenButtons(
    children: React.ReactNode,
    additionalProps?: AdditionalProps
  ): React.ReactNode {
    return deepMapWithIndex(children, (node: any) => {
      if (node.type === Button) {
        return ButtonsDisabler.updateButtons(node, additionalProps)
      }
      return node
    })
  }

  static updateButtons(node: any, additionalProps?: AdditionalProps): any {
    if (additionalProps) {
      additionalProps = {
        parentId: additionalProps.parentId,
        disabled:
          node.props.disabled === true
            ? node.props.disabled
            : additionalProps.disabled,
        setDisabled: additionalProps.setDisabled,
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

  static getUpdatedMessage(messageToUpdate: WebchatMessage): WebchatMessage {
    const updateMsgButton = (button: ButtonProps) => {
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
