import { WhatsappCTAUrlHeaderType } from '@botonic/react'

import type { FlowButton } from './flow-button'
import { HtButtonStyle } from './hubtype-fields'
import {
  FlowCarousel,
  type FlowContent,
  FlowImage,
  FlowText,
  FlowVideo,
  FlowWhatsappButtonList,
  FlowWhatsappCtaUrlButtonNode,
  FlowWhatsappTemplate,
} from './index'

// biome-ignore lint/complexity/noStaticOnlyClass: namespace-like adapter with private static helpers
export class HubtypeAssistantContent {
  static adapt(content: FlowContent): string {
    if (content instanceof FlowText) {
      return HubtypeAssistantContent.formatFlowTextContent(content)
    }
    if (content instanceof FlowCarousel) {
      return HubtypeAssistantContent.formatCarouselContent(content)
    }
    if (content instanceof FlowImage) {
      return content.src ? `[Image]\n${content.src}` : '[Image]'
    }
    if (content instanceof FlowVideo) {
      return content.src ? `[Video]\n${content.src}` : '[Video]'
    }
    if (content instanceof FlowWhatsappButtonList) {
      return HubtypeAssistantContent.formatWhatsappButtonListContent(content)
    }
    if (content instanceof FlowWhatsappCtaUrlButtonNode) {
      return HubtypeAssistantContent.formatWhatsappCtaContent(content)
    }
    if (content instanceof FlowWhatsappTemplate) {
      return HubtypeAssistantContent.formatWhatsappTemplateContent(content)
    }
    return ''
  }

  private static quickReplyLabel(button: FlowButton): string {
    const buttonText = button.text?.trim()
    if (buttonText) {
      return buttonText
    }

    return button.payload || 'Option'
  }

  private static persistentButtonLabel(button: FlowButton): string {
    return button.text?.trim() || 'Button'
  }

  private static carouselButtonLabel(button: FlowButton): string {
    return button.text?.trim() || 'Action'
  }

  private static formatFlowTextContent(text: FlowText): string {
    const body = text.text?.trim() ?? ''
    const buttons = text.buttons

    if (!body && buttons.length === 0) {
      return ''
    }

    if (buttons.length === 0) {
      return text.text
    }

    const isQuickReply = text.buttonStyle === HtButtonStyle.QUICK_REPLY
    const blockTitle = isQuickReply ? 'Quick replies:' : 'Buttons:'
    const lines = buttons.map((button, i) => {
      const label = isQuickReply
        ? HubtypeAssistantContent.quickReplyLabel(button)
        : HubtypeAssistantContent.persistentButtonLabel(button)
      return `  [${i + 1}] ${label}`
    })

    const block = [blockTitle, ...lines].join('\n')
    if (!body) {
      return block
    }

    return `${body}\n\n${block}`
  }

  private static formatCarouselContent(carousel: FlowCarousel): string {
    const elements = carousel.elements
    const n = elements.length
    const mainText = (carousel.whatsappText ?? '').trim()

    if (n === 0) {
      return mainText
    }

    let header: string
    if (!mainText) {
      header = `Carousel displayed with ${n} items:`
    } else if (mainText.endsWith(':')) {
      header = mainText
    } else {
      header = `${mainText}\nCarousel with ${n} items:`
    }

    const itemLines = elements.map((element, index) => {
      const title = element.title?.trim() || 'Item'
      const subtitle = element.subtitle?.trim()
      const subtitlePart = subtitle ? ` - ${subtitle}` : ''
      const btnLabels: string[] = []
      if (element.button) {
        btnLabels.push(
          HubtypeAssistantContent.carouselButtonLabel(element.button)
        )
      }
      const btnPart = btnLabels.length > 0 ? ` [${btnLabels.join(', ')}]` : ''

      return `  ${index + 1}. "${title}"${subtitlePart}${btnPart}`
    })

    return [header, ...itemLines].join('\n')
  }

  private static formatWhatsappButtonListContent(
    list: FlowWhatsappButtonList
  ): string {
    const body = list.text?.trim() ?? ''
    const hasSections = list.sections.some(s => s.rows.length > 0)

    if (!body && !hasSections) {
      return '[WhatsApp Button List]'
    }

    const parts: string[] = []
    if (body) {
      parts.push(body)
    }

    if (hasSections) {
      const sectionBlocks = list.sections.map(section => {
        const rowLines = section.rows.map(row => {
          const rowTitle = row.title?.trim() ?? ''
          const rowDescription = row.description?.trim() ?? ''
          if (!rowTitle && !rowDescription) {
            return '  - '
          }
          if (!rowTitle) {
            return `  - ${rowDescription}`
          }
          if (!rowDescription) {
            return `  - ${rowTitle}`
          }
          return `  - ${rowTitle}: ${rowDescription}`
        })
        const rowsText = rowLines.join('\n')

        const sectionTitle = section.title?.trim()
        if (sectionTitle) {
          return `${sectionTitle}:\n${rowsText}`
        }

        return rowsText
      })
      parts.push(sectionBlocks.join('\n'))
    }

    return parts.join('\n\n')
  }

  private static formatWhatsappCtaContent(
    cta: FlowWhatsappCtaUrlButtonNode
  ): string {
    const hasStructuredData =
      (cta.headerType === WhatsappCTAUrlHeaderType.Text &&
        !!cta.header?.trim()) ||
      cta.text?.trim() ||
      cta.footer?.trim() ||
      cta.displayText?.trim() ||
      cta.url

    if (!hasStructuredData) {
      return cta.text?.trim() || '[WhatsApp CTA Button]'
    }

    const lines: string[] = []
    if (
      cta.headerType === WhatsappCTAUrlHeaderType.Text &&
      cta.header?.trim()
    ) {
      lines.push(cta.header.trim())
    }
    if (cta.text?.trim()) {
      lines.push(cta.text.trim())
    }
    if (cta.footer?.trim()) {
      lines.push(cta.footer.trim())
    }
    const ctaLine = `[${cta.displayText || ''}]${cta.url ? ` (${cta.url})` : ''}`
    lines.push(ctaLine)

    return lines.join('\n')
  }

  private static formatWhatsappTemplateContent(
    template: FlowWhatsappTemplate
  ): string {
    const { name, language } = template.htWhatsappTemplate
    return `WhatsApp Template: ${name} (${language})`
  }
}
