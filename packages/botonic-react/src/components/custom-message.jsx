import { INPUT } from '@botonic/core'
import merge from 'lodash.merge'
import React from 'react'

import { SENDERS } from '../constants'
import { createErrorBoundary } from '../util/error-boundary'
import { warnDeprecatedProps } from '../util/logs'
import { mapObjectNonBooleanValues } from '../util/react'
import { Message } from './message'
import { Reply } from './reply'

/**
 *
 * @param name as it appears at ThemeProps' message.customTypes key
 * @param CustomMessageComponent
 * @param defaultProps Props for the wrapper Message
 * @param ErrorBoundary to recover in case it fails
 */
export const customMessage = ({
  name,
  component: CustomMessageComponent,
  defaultProps = {},
  errorBoundary: ErrorBoundary = createErrorBoundary(),
}) => {
  const CustomMessage = props => {
    warnDeprecatedProps(defaultProps, 'customMessage:')
    if (defaultProps.from === SENDERS.user) defaultProps.ack = 1
    return (
      <Message
        {...merge(mapObjectNonBooleanValues(defaultProps), props)}
        type={INPUT.CUSTOM}
      />
    )
  }

  const splitChildren = props => {
    const { children } = props
    const isReply = e => e.type === Reply
    try {
      if (!Array.isArray(children) && !isReply(children)) {
        return { replies: null, childrenWithoutReplies: children }
      }
      const childrenArray = React.Children.toArray(children)
      const replies = childrenArray.filter(isReply)
      const childrenWithoutReplies = childrenArray.filter(e => !isReply(e))
      return {
        replies: replies,
        childrenWithoutReplies,
      }
    } catch (e) {
      return { replies: null, childrenWithoutReplies: children }
    }
  }

  const WrappedComponent = props => {
    const { id, children, ...customMessageProps } = props
    const { replies, childrenWithoutReplies } = splitChildren(props)
    return (
      <CustomMessage
        id={id}
        json={{
          ...customMessageProps,
          id,
          children: childrenWithoutReplies,
          customTypeName: name,
        }}
      >
        <ErrorBoundary key={'errorBoundary'} {...customMessageProps}>
          <CustomMessageComponent {...customMessageProps}>
            {childrenWithoutReplies}
          </CustomMessageComponent>
        </ErrorBoundary>
        {replies}
      </CustomMessage>
    )
  }
  WrappedComponent.customTypeName = name
  // eslint-disable-next-line react/display-name
  WrappedComponent.deserialize = msg => {
    return (
      <WrappedComponent {...msg}>
        {msg.replies.length > 0 &&
          msg.replies.map((r, i) => (
            <Reply key={i} payload={r.payload}>
              {r.title}
            </Reply>
          ))}
      </WrappedComponent>
    )
  }
  return WrappedComponent
}
