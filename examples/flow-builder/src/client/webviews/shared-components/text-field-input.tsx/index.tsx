import React from 'react'

import { FieldInputProps } from '../hooks/use-field'
import { AlertSvg } from './alert-svg'
import { InputTextContainer } from './styles'

export const TextFieldInput = ({
  autoComplete,
  fullWidth,
  error,
  errorText,
  id,
  label,
  placeholder,
  type,
  value,
  onChange,
}: FieldInputProps) => {
  return (
    <InputTextContainer error={error} fullWidth={fullWidth}>
      <label htmlFor={id}>{label}</label>
      <input
        name={id}
        autoComplete={autoComplete}
        id={id}
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={onChange}
      />
      {error ? (
        <p>
          <AlertSvg />
          {errorText}
        </p>
      ) : null}
    </InputTextContainer>
  )
}
