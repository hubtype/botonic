// @ts-nocheck
import { isNode } from '@botonic/core'
import React, { useState } from 'react'

import { Text } from '../components/text'

export const createErrorBoundary = ({
  errorComponent = ({ errorMessage }) => (
    <Text>The message cannot be displayed</Text>
  ),
} = {}) => {
  const ErrorBoundary = ({ children }) => {
    const [error, setError] = useState(null)

    const componentDidCatch = (error, errorInfo) => {
      if (isNode()) {
        console.error(`Failure at:`, error)
      }
    }

    const getDerivedStateFromError = error => {
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
