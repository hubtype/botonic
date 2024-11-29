import { INPUT } from '@botonic/core'
import React from 'react'

import { truncateText } from '../util'
import { renderComponent } from '../util/react'
import { Message } from './message'
import { WHATSAPP_MAX_BUTTON_CHARS } from './multichannel/whatsapp/constants'
import { convertToMarkdownMeta } from './multichannel/whatsapp/markdown-meta'

// TODO: Add validation in component

export const WHATSAPP_MAX_BUTTON_LIST_CHARS = 24
export const WHATSAPP_MAX_BUTTON_LIST_DESCRIPTION_CHARS = 72
export const WHATSAPP_MAX_BUTTON_LIST_ID_CHARS = 200
export interface WhatsappButtonListSectionProps {
  title?: string
  rows: WhatsappButtonListRowProps[]
}

export interface WhatsappButtonListRowProps {
  id: string
  title: string
  description?: string
}

export interface WhatsappButtonListProps {
  header?: string
  body: string
  footer?: string
  button: string
  sections: WhatsappButtonListSectionProps[]
}

const serialize = _whatsappButtonListProps => {
  // TODO: Implement to have data persistance in localStorage, not needed for this WhatsApp development
  return {}
}

export const WhatsappButtonList = (props: WhatsappButtonListProps) => {
  const trucateSectionsContents = (
    sections: WhatsappButtonListSectionProps[]
  ): WhatsappButtonListSectionProps[] => {
    const trucateRowContents = (
      row: WhatsappButtonListRowProps
    ): WhatsappButtonListRowProps => {
      const title = truncateText(row.title, WHATSAPP_MAX_BUTTON_LIST_CHARS)
      const description = row.description
        ? truncateText(
            row.description,
            WHATSAPP_MAX_BUTTON_LIST_DESCRIPTION_CHARS
          )
        : undefined
      if (row.id.length > WHATSAPP_MAX_BUTTON_LIST_ID_CHARS) {
        console.error(
          `Button id "${row.id}" exceeds the maximum length of ${WHATSAPP_MAX_BUTTON_LIST_ID_CHARS} characters`
        )
      }
      return { ...row, title, description }
    }

    return sections.map(section => ({
      title: section.title
        ? truncateText(section.title, WHATSAPP_MAX_BUTTON_LIST_CHARS)
        : undefined,
      rows: section.rows.map(trucateRowContents),
    }))
  }

  const renderBrowser = () => {
    // Return a dummy message for browser
    const message = `${JSON.stringify(props)}`
    return (
      <Message
        json={serialize(message)}
        {...props}
        type={INPUT.WHATSAPP_BUTTON_LIST}
      >
        {message}
      </Message>
    )
  }

  const renderNode = () => {
    return (
      // @ts-ignore Property 'message' does not exist on type 'JSX.IntrinsicElements'.
      <message
        {...props}
        body={convertToMarkdownMeta(props.body)}
        button={truncateText(props.button, WHATSAPP_MAX_BUTTON_CHARS)}
        sections={JSON.stringify(trucateSectionsContents(props.sections))}
        type={INPUT.WHATSAPP_BUTTON_LIST}
      />
    )
  }

  return renderComponent({ renderBrowser, renderNode })
}
