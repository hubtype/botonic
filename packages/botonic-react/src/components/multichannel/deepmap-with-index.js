import { Children, cloneElement, isValidElement } from 'react'

import { hasComplexChildren } from '../../util/react'

// react-children-utilities 2.1.0 fixes the issue in one deepMapFn call,
// but not in the other one
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
