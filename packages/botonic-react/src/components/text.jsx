import { INPUT } from '@botonic/core'
import React, { Children } from 'react'

import { mapObjectNonBooleanValues } from '../util/react'
import { serializeMarkdown, toMarkdownChildren } from './markdown'
import { Message } from './message'

const serializeText = children => {
  children = Array.isArray(children) ? children : [children]
  const text = children
    .filter(e => !e.type)
    .map(e => {
      if (Array.isArray(e)) return serializeText(e)
      else return String(e)
    })
    .join('')
  return text
}

const serialize = textProps => {
  if (!textProps.markdown)
    return {
      text: serializeText(textProps.children),
    }
  return { text: serializeMarkdown(textProps.children) }
}

/**
 *
 * @param {TextProps} props
 * @returns {JSX.Element}
 */
export const Text = props => {
  const defaultTextProps = {
    markdown: props.markdown === undefined ? true : props.markdown,
  }
  const textProps = mapObjectNonBooleanValues({
    ...props,
    ...defaultTextProps,
    ...{ children: Children.toArray(props.children) },
  })
  if (!textProps.markdown)
    return (
      <Message json={serialize(textProps)} {...textProps} type={INPUT.TEXT}>
        {textProps.children}
      </Message>
    )
  return (
    <Message json={serialize(textProps)} {...textProps} type={INPUT.TEXT}>
      {toMarkdownChildren(textProps.children)}
    </Message>
  )
}

Text.serialize = serialize
