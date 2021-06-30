import { INPUT, isBrowser } from '@botonic/core'
import React, { useState } from 'react'
import styled from 'styled-components'

import { COLORS, ROLES } from '../constants'
import { Message } from './message'

const RawDataButton = styled.div`
  align-self: flex-start;
  background-color: ${COLORS.CURIOUS_BLUE};
  padding: 4px;
  margin: 4px 0px;
  cursor: pointer;
  color: ${COLORS.SOLID_WHITE_ALPHA_0_8};
  font-size: 10px;
  border-radius: 2px;
`

const Popover = styled.div`
  max-width: 100%;
  max-height: 500px;
  overflow: auto;
  background-color: ${COLORS.LIGHT_GRAY};
  padding: 10px;
  pre {
    margin: 0px;
  }
`

const serialize = rawProps => {
  return { data: rawProps.data, alt: rawProps.alt }
}

export const Raw = props => {
  let content = props.children
  const data = JSON.stringify(props.data, null, ' ')
  const [isOpen, setIsOpen] = useState(false)
  if (isBrowser())
    content = (
      <>
        <div>{props.alt}</div>
        <RawDataButton onClick={() => setIsOpen(!isOpen)}>
          RAW DATA <small>{isOpen ? '▲' : '▼'}</small>
        </RawDataButton>
        {isOpen && (
          <Popover>
            <pre>{data}</pre>
          </Popover>
        )}
      </>
    )
  return (
    <Message
      role={ROLES.RAW_MESSAGE}
      json={serialize(props)}
      {...props}
      data={data}
      type={INPUT.RAW}
    >
      {content}
    </Message>
  )
}

Raw.serialize = serialize
