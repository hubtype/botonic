/**
 * Get the name of an element (instantiated component)
 * @param {React.Element} component
 * @returns {string}
 */
export function getElementName(component) {
  return component.type.name
}

/**
 * Get the name of a component TYPE
 * @param {React.ComponentType} component
 * @returns {string}
 */
export function getComponentTypeName(component) {
  return component.displayName || component.name || 'Component'
}
