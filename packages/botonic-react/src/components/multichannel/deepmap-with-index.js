import { Children, cloneElement, isValidElement } from 'react'

import { hasComplexChildren } from '../../util/react'

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
