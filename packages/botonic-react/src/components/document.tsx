import { INPUT, isBrowser } from '@botonic/core'
import React, { useContext } from 'react'
import styled from 'styled-components'

import { ROLES, WEBCHAT } from '../constants'
import { staticAsset } from '../util/environment'
import { WebchatContext } from '../webchat/context'
import { DocumentProps } from './index-types'
import { Message } from './message'

const StyledButton = styled.a`
  display: block;
  height: 25px;
  background-color: #f0f0f0;
  padding: 10px;
  text-align: center;
  border-radius: 5px;
  color: black;
  font-weight: bold;
  line-height: 25px;
  text-decoration: none;
  border: 1px solid black;
  opacity: 0.9;
  &:hover {
    opacity: 1;
  }
`

const serialize = (documentProps: { src: string }) => {
  return { document: documentProps.src }
}

export const Document = (props: DocumentProps) => {
  props = { ...props, src: staticAsset(props.src) }

  let content = props.children

  const { getThemeProperty } = useContext(WebchatContext)
  let documentDownload = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.documentDownload,
    {}
  )
  if (typeof documentDownload === 'function')
    documentDownload = documentDownload(props.from)

  if (isBrowser()) {
    content = (
      <StyledButton
        href={props.src}
        target='_blank'
        rel='noreferrer'
        style={{
          ...documentDownload.style,
        }}
      >
        {documentDownload.text || 'Download'}
      </StyledButton>
    )
  }

  return (
    <Message
      role={ROLES.DOCUMENT_MESSAGE}
      json={serialize(props)}
      {...props}
      type={INPUT.DOCUMENT}
    >
      {content}
    </Message>
  )
}

Document.serialize = serialize
