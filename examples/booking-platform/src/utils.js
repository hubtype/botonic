import React from 'react'
import TextField from '@material-ui/core/TextField'

export const emailRegex = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/

export function MyTextField(props) {
  let helperText = ''
  if (props.error)
    helperText =
      props.error && props.value === ''
        ? 'This field is required'
        : props.errorMessage || ''
  return (
    <TextField
      variant='filled'
      {...props.params}
      required={props.required}
      label={props.label}
      value={props.value}
      onChange={props.onChange}
      error={helperText !== ''}
      helperText={helperText}
      disabled={props.disabled}
      style={props.style || { width: '80%', margin: '5px' }}
    />
  )
}
