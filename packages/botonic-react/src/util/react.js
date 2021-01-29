import { isBrowser, isNode } from '@botonic/core'
import { Children, cloneElement, isValidElement } from 'react'

import { mapObject } from './objects'

export const ConditionalWrapper = ({ condition, wrapper, children }) =>
  condition ? wrapper(children) : children

export function renderComponent({ renderBrowser, renderNode }) {
  if (isBrowser()) return renderBrowser()
  else if (isNode()) return renderNode()
  throw new Error('Unexpected process type. Not recognized as browser nor node')
}

export const mapObjectNonBooleanValues = obj => {
  // to avoid React SSR warnings: https://github.com/styled-components/styled-components/issues/1198#issue-262022540
  return mapObject(obj, ([key, value]) => {
    if (typeof value === 'boolean') return [key, Number(value)]
    return [key, value]
  })
}

const hasChildren = element =>
  isValidElement(element) && Boolean(element.props.children)

export const hasComplexChildren = element =>
  hasChildren(element) &&
  Children.toArray(element.props.children).reduce(
    (response, child) => response || isValidElement(child),
    false
  )

export const deepMapWithIndex = (children, deepMapFn) => {
  return Children.toArray(children).map((child, index) => {
    if (isValidElement(child) && hasComplexChildren(child)) {
      // Clone the child that has children and map them too
      return deepMapFn(
        cloneElement(
          child,
          Object.assign(Object.assign({}, child.props), {
            children: deepMapWithIndex(child.props.children, deepMapFn),
          })
        ),
        index,
        children
      )
    }
    return deepMapFn(child, index, children)
  })
}
