import React, { CSSProperties } from 'react'

import { DeviceAdapter } from '../../devices/device-adapter'
import { StyledTextarea } from './styles'

interface TextareaProps {
  deviceAdapter: DeviceAdapter
  handleChange: (event: any) => void
  host: HTMLElement
  onKeyDown: (event) => void
  onKeyUp: () => void
  value: string
  webchatCustom: CSSProperties
}

export const Textarea = ({
  deviceAdapter,
  handleChange,
  host,
  onKeyDown,
  onKeyUp,
  value,
  webchatCustom,
}: TextareaProps) => {
  return (
    //@ts-ignore
    <StyledTextarea
      value={value}
      name='text'
      onChange={event => handleChange(event)}
      autoFocus={true}
      maxLength={1000}
      onKeyDown={e => onKeyDown(e)}
      onKeyUp={onKeyUp}
      onFocus={() => deviceAdapter.onFocus(host)}
      onBlur={() => deviceAdapter.onBlur()}
      style={{ ...webchatCustom }}
    />
  )
}
