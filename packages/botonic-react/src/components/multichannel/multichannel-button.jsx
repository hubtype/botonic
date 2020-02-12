import React, { useContext } from 'react'
import { RequestContext } from '../../contexts'
import { Button } from '../button'
import { MultichannelContext } from './multichannel-context'
import { isWhatsapp } from './multichannel-utils'

export const MultichannelButton = props => {
  let requestContext = useContext(RequestContext)
  let multichannelContext = useContext(MultichannelContext)

  const hasUrl = () => Boolean(props.url)

  const hasPath = () => Boolean(props.path)

  const hasPayload = () => Boolean(props.payload)

  const hasPostback = () => hasPath() || hasPayload()

  const hasWebview = () => Boolean(props.webview)

  const getUrl = () => props.url
  const getWebview = () => props.webview

  const getText = () => {
    let text = props.children
    let newLine = props.newline ? '\n' : ''
    if (hasPostback()) {
      text =
        newLine +
        `${
          multichannelContext.currentIndex
            ? `${multichannelContext.currentIndex}. `
            : ''
        }${text}`
    } else if (hasUrl()) {
      text = newLine + `- ${text}`
    }
    return text
  }

  if (isWhatsapp(requestContext)) {
    if (hasUrl()) {
      return `${getText()}: ${getUrl()}`
    } else if (hasPath() || hasPayload()) {
      let text = getText()
      multichannelContext.currentIndex += 1
      return `${text}`
    } else if (hasWebview()) return <Button {...props}>{getText()}</Button>
    else return <Button {...props}>{props.children}</Button>
  }
  return <Button {...props}>{props.children}</Button>
}
