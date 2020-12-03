import { isBrowser, isNode } from '@botonic/core'

import { mapObject } from './objects'

export const ConditionalWrapper = ({ condition, wrapper, children }) =>
  condition ? wrapper(children) : children

export function renderComponent({ renderBrowser, renderNode }) {
  if (isBrowser) return renderBrowser()
  else if (isNode) return renderNode()
  throw new Error('Unexpected process type. Not recognized as browser nor node')
}

export const mapObjectNonBooleanValues = obj => {
  // to avoid React SSR warnings: https://github.com/styled-components/styled-components/issues/1198#issue-262022540
  return mapObject(obj, ([key, value]) => {
    if (typeof value === 'boolean') return [key, Number(value)]
    return [key, value]
  })
}
