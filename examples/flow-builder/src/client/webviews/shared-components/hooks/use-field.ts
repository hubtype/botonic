import { useEffect, useState } from 'react'

type UseFieldProps = {
  autoComplete?: string
  errorText?: string
  fullWidth?: boolean
  id: string
  initialValue?: string
  label: string
  pattern?: RegExp
  placeholder?: string
  required?: boolean
  type?: string
}

export interface FieldInputProps {
  autoComplete: string
  error: boolean
  errorText: string
  fullWidth: boolean
  id: string
  label: string
  onChange: (event: any) => void
  placeholder: string
  type: string
  value: string
}

export interface Field {
  input: FieldInputProps
  verify: () => boolean
}

export const useField = ({
  autoComplete = 'off',
  errorText = '',
  fullWidth = true,
  id,
  initialValue = '',
  label,
  pattern = /.*/,
  placeholder = '',
  required = true,
  type = 'text',
}: UseFieldProps): Field => {
  const [value, setValue] = useState(initialValue)
  const [error, setError] = useState(false)
  const delayMs = 500

  const verify = () => {
    let valid = pattern.test(value)
    if (required && !value) {
      valid = false
    }
    return valid
  }

  const hasError = () => {
    let error = !verify()
    if (value === '') {
      error = false
    }
    setError(error)
    return error
  }

  const onChange = (event: any): void => {
    if (event === null) {
      setValue('')
      return
    }
    setValue(event.target.value as string)
    return
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      hasError()
    }, delayMs)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [value])

  return {
    input: {
      autoComplete,
      error,
      errorText,
      fullWidth,
      id,
      label,
      placeholder,
      type,
      value,
      onChange,
    },
    verify,
  }
}
