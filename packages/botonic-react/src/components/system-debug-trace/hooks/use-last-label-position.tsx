import { useEffect, useRef } from 'react'

/**
 * Custom hook to measure the position of the last label in a collapsible debug message
 * and set a CSS variable for dynamic line height calculation.
 *
 * @param isExpanded - Whether the debug message is currently expanded
 * @param debugEvent - The debug event data (used as a dependency for re-measurement)
 * @returns A ref to be attached to the wrapper element
 */
export const useLastLabelPosition = <T extends HTMLElement = HTMLDivElement>(
  isExpanded: boolean,
  debugEvent: unknown
) => {
  const wrapperRef = useRef<T>(null)

  useEffect(() => {
    if (!isExpanded || !wrapperRef.current) {
      if (wrapperRef.current) {
        wrapperRef.current.style.setProperty('--last-label-bottom', '0px')
      }
      return
    }

    const measure = () => {
      const wrapper = wrapperRef.current
      if (!wrapper) return

      // Check if visible
      const parent = wrapper.parentElement
      if (parent && window.getComputedStyle(parent).display === 'none') {
        return
      }

      // Find last container and its label
      const children = Array.from(wrapper.children) as HTMLElement[]
      const lastContainer = children[children.length - 1]
      if (!lastContainer) return

      const lastLabel = lastContainer.querySelector(
        'strong, span[class*="GuardrailLabel"]'
      ) as HTMLElement | null
      if (!lastLabel) return

      // Calculate distance from wrapper top to label bottom
      const wrapperTop = wrapper.getBoundingClientRect().top
      const labelBottom = lastLabel.getBoundingClientRect().bottom
      const labelBottomPosition = labelBottom - wrapperTop

      // Set CSS variable for line height calculation
      wrapper.style.setProperty(
        '--last-label-bottom',
        `${labelBottomPosition}px`
      )
      console.log(
        '[useLastLabelPosition] Set line height:',
        labelBottomPosition
      )
    }

    // Measure after render
    const timeoutId = setTimeout(measure, 0)
    const resizeObserver =
      'ResizeObserver' in window ? new ResizeObserver(measure) : null

    if (resizeObserver && wrapperRef.current) {
      resizeObserver.observe(wrapperRef.current)
    }

    return () => {
      clearTimeout(timeoutId)
      resizeObserver?.disconnect()
    }
  }, [isExpanded, debugEvent])

  return wrapperRef
}
