import { type RefObject, useEffect } from 'react'

interface UseLastLabelPositionProps {
  wrapperRef: RefObject<HTMLDivElement>
  isExpanded: boolean
  debugEvent: unknown
  isCollapsible: boolean
}

export function useLastLabelPosition({
  wrapperRef,
  isExpanded,
  debugEvent,
  isCollapsible,
}: UseLastLabelPositionProps) {
  useEffect(() => {
    // Only measure for collapsible events
    if (!isCollapsible) {
      return undefined
    }

    if (!isExpanded || !wrapperRef.current) {
      if (wrapperRef.current) {
        wrapperRef.current.style.setProperty('--last-label-bottom', '0px')
      }
      return undefined
    }

    const measure = () => {
      const wrapper = wrapperRef.current
      if (!wrapper) {
        return
      }

      // Check if visible
      const parent = wrapper.parentElement
      if (parent && window.getComputedStyle(parent).display === 'none') {
        return
      }

      // Find all label elements in order (both <strong> for DebugLabel and <span> for GuardrailLabel)
      // We need to get them in DOM order to find the actual last one
      const allElements = wrapper.querySelectorAll<HTMLElement>('strong, span')
      const allLabels = Array.from(allElements).filter(el => {
        // Include all <strong> elements (they're DebugLabels)
        if (el.tagName === 'STRONG') {
          return true
        }

        // For <span>, only include if it's a direct child of a flex container (GuardrailLabel pattern)
        // and has no child elements (just text)
        if (
          el.tagName === 'SPAN' &&
          el.children.length === 0 &&
          el.textContent?.trim()
        ) {
          const parent = el.parentElement
          if (parent) {
            const parentStyle = window.getComputedStyle(parent)
            // GuardrailItem has display: flex
            return parentStyle.display === 'flex'
          }
        }
        return false
      })

      if (allLabels.length === 0) {
        return
      }

      // Get the last label
      const lastLabel = allLabels[allLabels.length - 1]

      // Calculate distance from wrapper top to label bottom
      const wrapperTop = wrapper.getBoundingClientRect().top
      const labelBottom = lastLabel.getBoundingClientRect().bottom
      const labelBottomPosition = labelBottom - wrapperTop

      // Set CSS variable for line height calculation
      wrapper.style.setProperty(
        '--last-label-bottom',
        `${labelBottomPosition}px`
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
  }, [isExpanded, debugEvent, wrapperRef, isCollapsible])
}
