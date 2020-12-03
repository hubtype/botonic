import { isNode } from '@botonic/core'
import React from 'react'

import { Text } from '../components/text'

/**
 * Replaces crashed children with the provided fallback component.
 * https://reactjs.org/blog/2017/07/26/error-handling-in-react-16.html
 * See alternative at https://stackoverflow.com/a/60255291/145289
 */
export const createErrorBoundary = ({
  errorComponent = props => <Text>The message cannot be displayed</Text>,
} = {}) => {
  class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props)
      this.state = { error: null }
    }

    /**
     * @param error the exception which was trown
     * @param errorInfo the stack of component names at the error
     */
    componentDidCatch(error, errorInfo) {
      // No need to log the error because at least chrome & firefox already show
      // both component and call stacks
      if (isNode) {
        // In node, only the component stack is displayed
        console.error(`Failure at:`, error)
      }
    }

    static getDerivedStateFromError(error) {
      return { error }
    }

    render() {
      if (this.state.error) {
        return errorComponent({
          ...this.props,
          errorMessage: this.state.error.message,
        })
      } else {
        return this.props.children
      }
    }
  }

  return ErrorBoundary
}
