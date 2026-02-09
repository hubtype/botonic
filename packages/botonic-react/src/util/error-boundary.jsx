// @ts-nocheck
import { isNode } from '@botonic/core'
import { useState } from 'react'

import { Text } from '../components/text'

export const createErrorBoundary = ({
  errorComponent = ({ errorMessage }) => (
    <Text>The message cannot be displayed</Text>
  ),
} = {}) => {
  const ErrorBoundary = ({ children }) => {
    const [error, _setError] = useState(null)

    const _componentDidCatch = (error, _errorInfo) => {
      if (isNode()) {
        console.error(`Failure at:`, error)
      }
    }

    const _getDerivedStateFromError = error => {
      return { error }
    }

    if (error) {
      return errorComponent({
        errorMessage: error.message,
      })
    } else {
      return children
    }
  }

  return ErrorBoundary
}
