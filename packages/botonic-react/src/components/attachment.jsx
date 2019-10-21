import React from 'react'
import AttachmentIcon from '../assets/attachment-icon.svg'
import { staticAsset } from '../utils'
export const Attachment = ({ onChange, accept }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      paddingRight: 15
    }}
  >
    <label htmlFor='attachment'>
      <img
        style={{
          cursor: 'pointer'
        }}
        src={staticAsset(AttachmentIcon)}
      />
    </label>
    <input
      type='file'
      name='file'
      id='attachment'
      style={{ display: 'none' }}
      onChange={onChange}
      accept={accept}
    ></input>
  </div>
)
