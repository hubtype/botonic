import { WhatsappCTAUrlHeaderType } from '@botonic/react'
import { describe, expect, test } from '@jest/globals'

import { FlowButton } from '../src/content-fields/flow-button'
import { FlowCarousel } from '../src/content-fields/flow-carousel'
import { FlowElement } from '../src/content-fields/flow-element'
import { FlowHandoff } from '../src/content-fields/flow-handoff'
import { FlowImage } from '../src/content-fields/flow-image'
import { FlowText } from '../src/content-fields/flow-text'
import { FlowVideo } from '../src/content-fields/flow-video'
import { FlowWhatsappCtaUrlButtonNode } from '../src/content-fields/flow-whatsapp-cta-url-button'
import { FlowWhatsappTemplate } from '../src/content-fields/flow-whatsapp-template'
import { HubtypeAssistantContent } from '../src/content-fields/hubtype-assistant-content'
import {
  HtButtonStyle,
  type HtWhatsAppTemplate,
} from '../src/content-fields/hubtype-fields'
import { FlowWhatsappButtonList } from '../src/content-fields/whatsapp-button-list/flow-whatsapp-button-list'
import { FlowWhatsappButtonListRow } from '../src/content-fields/whatsapp-button-list/flow-whatsapp-button-list-row'
import { FlowWhatsappButtonListSection } from '../src/content-fields/whatsapp-button-list/flow-whatsapp-button-list-section'

function flowButton(id: string, text: string, extra?: { payload?: string }) {
  const b = new FlowButton(id)
  b.text = text
  if (extra?.payload) {
    b.payload = extra.payload
  }
  return b
}

describe('HubtypeAssistantContentAdapter', () => {
  describe('FlowText', () => {
    test('returns empty string when there is no body and no buttons', () => {
      const text = new FlowText('t1')
      text.text = ''
      expect(HubtypeAssistantContent.adapt(text)).toBe('')
    })

    test('returns plain text when there are no buttons', () => {
      const text = new FlowText('t1')
      text.text = 'Hello\nworld'
      expect(HubtypeAssistantContent.adapt(text)).toBe('Hello\nworld')
    })

    test('formats quick replies with body', () => {
      const text = new FlowText('t1')
      text.text = 'Choose:'
      text.buttonStyle = HtButtonStyle.QUICK_REPLY
      text.buttons = [flowButton('b1', 'A'), flowButton('b2', 'B')]
      expect(HubtypeAssistantContent.adapt(text)).toBe(
        'Choose:\n\nQuick replies:\n  [1] A\n  [2] B'
      )
    })

    test('formats Buttons block for persistent button style', () => {
      const text = new FlowText('t1')
      text.text = 'Hi'
      text.buttonStyle = HtButtonStyle.BUTTON
      text.buttons = [flowButton('b1', 'OK')]
      expect(HubtypeAssistantContent.adapt(text)).toBe(
        'Hi\n\nButtons:\n  [1] OK'
      )
    })

    test('uses payload as quick reply label when text is empty', () => {
      const text = new FlowText('t1')
      text.text = 'x'
      text.buttonStyle = HtButtonStyle.QUICK_REPLY
      const button = new FlowButton('b1')
      button.text = ''
      button.payload = 'PAYLOAD'
      text.buttons = [button]
      expect(HubtypeAssistantContent.adapt(text)).toContain('PAYLOAD')
    })

    test('uses Option when quick reply has no text and no payload', () => {
      const text = new FlowText('t1')
      text.text = 'x'
      text.buttonStyle = HtButtonStyle.QUICK_REPLY
      const button = new FlowButton('b1')
      button.text = '   '
      text.buttons = [button]
      expect(HubtypeAssistantContent.adapt(text)).toContain('[1] Option')
    })
  })

  describe('FlowCarousel', () => {
    test('returns only whatsapp text when there are no elements', () => {
      const carousel = new FlowCarousel('c1')
      carousel.whatsappText = 'Intro'
      carousel.elements = []
      expect(HubtypeAssistantContent.adapt(carousel)).toBe('Intro')
    })

    test('uses default header when whatsapp text is empty', () => {
      const carousel = new FlowCarousel('c1')
      carousel.whatsappText = ''
      const element = new FlowElement('e1')
      element.title = 'T'
      carousel.elements = [element]
      expect(HubtypeAssistantContent.adapt(carousel)).toBe(
        'Carousel displayed with 1 items:\n  1. "T"'
      )
    })

    test('uses intro as sole header when it ends with colon', () => {
      const carousel = new FlowCarousel('c1')
      carousel.whatsappText = 'Pick one:'
      const element = new FlowElement('e1')
      element.title = 'A'
      carousel.elements = [element]
      const out = HubtypeAssistantContent.adapt(carousel)
      expect(out).toBe('Pick one:\n  1. "A"')
    })

    test('combines intro and Carousel with N items when intro does not end with colon', () => {
      const carousel = new FlowCarousel('c1')
      carousel.whatsappText = 'See below'
      const element = new FlowElement('e1')
      element.title = 'X'
      element.subtitle = 'Y'
      element.button = flowButton('btn', 'Buy')
      carousel.elements = [element]
      expect(HubtypeAssistantContent.adapt(carousel)).toBe(
        'See below\nCarousel with 1 items:\n  1. "X" - Y [Buy]'
      )
    })
  })

  describe('FlowImage and FlowVideo', () => {
    test('formats image with URL', () => {
      const image = new FlowImage('i1')
      image.src = 'https://example.com/a.png'
      expect(HubtypeAssistantContent.adapt(image)).toBe(
        '[Image]\nhttps://example.com/a.png'
      )
    })

    test('formats video placeholder without src', () => {
      const video = new FlowVideo('v1')
      video.src = ''
      expect(HubtypeAssistantContent.adapt(video)).toBe('[Video]')
    })
  })

  describe('FlowWhatsappButtonList', () => {
    test('returns placeholder when body and sections are empty', () => {
      const whatsappList = new FlowWhatsappButtonList('l1')
      whatsappList.text = ''
      whatsappList.sections = []
      expect(HubtypeAssistantContent.adapt(whatsappList)).toBe(
        '[WhatsApp Button List]'
      )
    })

    test('formats body and section with rows', () => {
      const list = new FlowWhatsappButtonList('l1')
      list.text = 'Menu'
      const row = new FlowWhatsappButtonListRow('r1')
      row.title = 'Opt'
      row.description = 'Desc'
      const section = new FlowWhatsappButtonListSection('s1')
      section.title = 'Section A'
      section.rows = [row]
      list.sections = [section]
      expect(HubtypeAssistantContent.adapt(list)).toBe(
        'Menu\n\nSection A:\n  - Opt: Desc'
      )
    })
  })

  describe('FlowWhatsappCtaUrlButtonNode', () => {
    test('returns fallback when there is no structured data', () => {
      const whatsappCta = new FlowWhatsappCtaUrlButtonNode('cta1')
      whatsappCta.text = ''
      whatsappCta.displayText = ''
      whatsappCta.url = ''
      expect(HubtypeAssistantContent.adapt(whatsappCta)).toBe(
        '[WhatsApp CTA Button]'
      )
    })

    test('joins header, body, footer and CTA line with single newline', () => {
      const whatsappCta = new FlowWhatsappCtaUrlButtonNode('cta1')
      whatsappCta.headerType = WhatsappCTAUrlHeaderType.Text
      whatsappCta.header = 'H'
      whatsappCta.text = 'B'
      whatsappCta.footer = 'F'
      whatsappCta.displayText = 'Open'
      whatsappCta.url = 'https://a.com'
      expect(HubtypeAssistantContent.adapt(whatsappCta)).toBe(
        'H\nB\nF\n[Open] (https://a.com)'
      )
    })
  })

  describe('FlowWhatsappTemplate', () => {
    test('formats template name and language', () => {
      const whatsappTemplate = new FlowWhatsappTemplate('w1')
      const hubtypeWhatsappCta: HtWhatsAppTemplate = {
        id: 'tid',
        name: 'my_tpl',
        language: 'es',
        status: 'approved',
        category: 'MARKETING',
        components: [],
        namespace: 'ns',
        parameter_format: 'named',
      }
      whatsappTemplate.htWhatsappTemplate = hubtypeWhatsappCta
      expect(HubtypeAssistantContent.adapt(whatsappTemplate)).toBe(
        'WhatsApp Template: my_tpl (es)'
      )
    })
  })

  describe('unsupported FlowContent', () => {
    test('returns empty string for FlowHandoff', () => {
      const handoff = new FlowHandoff('h1')
      expect(HubtypeAssistantContent.adapt(handoff)).toBe('')
    })
  })
})
