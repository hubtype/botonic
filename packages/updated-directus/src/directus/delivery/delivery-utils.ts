import { OneItem, PartialItem } from '@directus/sdk'

import * as cms from '../../cms'

export const mf = 'multilanguage_fields'

export const knownFields = [
  'id',
  'name',
  'status',
  'collection',
  'shorttext',
  'keywords',
  'followup',
  'text',
  'buttons',
  'image',
  'target',
  'url',
  'elements',
  'languages_code',
  'buttonstyle',
  'text_id',
  'button_id',
  'element_id',
  'carousel_id',
  'payload_id',
  'hour_range_id',
  'day_schedule_id',
  'schedule_id',
  'queue_id',
  'handoff_id',
  'agent_id_id',
  'agent_email_id',
]

export function getContentFields(contentType: cms.ContentType): string[] {
  switch (contentType) {
    case cms.ContentType.TEXT:
      return getTextFields()
    case cms.ContentType.IMAGE:
      return getImageFields()
    case cms.ContentType.BUTTON:
      return getButtonFields()
    case cms.ContentType.URL:
      return getUrlFields()
    case cms.ContentType.PAYLOAD:
      return getPayloadFields()
    case cms.ContentType.CAROUSEL:
      return getCarouselFields()
    case cms.ContentType.ELEMENT:
      return getElementFields()
    case cms.ContentType.QUEUE:
      return getQueueFields()
    default:
      return []
  }
}

function getTextFields(): string[] {
  return [
    'id',
    'name',
    'status',
    'multilanguage_fields.*',
    'multilanguage_fields.buttons.*',
    'multilanguage_fields.buttons.item.*',
    'multilanguage_fields.buttons.item.multilanguage_fields.*',
    'multilanguage_fields.buttons.item.multilanguage_fields.target.*',
    'multilanguage_fields.followup.*',
    'multilanguage_fields.followup.item.*',
    'multilanguage_fields.followup.item.multilanguage_fields.*',
  ]
}

function getCarouselFields(): string[] {
  return [
    'id',
    'name',
    'status',
    'multilanguage_fields.*',
    'multilanguage_fields.shorttext',
    'multilanguage_fields.keywords',
    'multilanguage_fields.elements.*',
    'multilanguage_fields.elements.item.*',
    'multilanguage_fields.elements.item.multilanguage_fields.*',
    'multilanguage_fields.elements.item.multilanguage_fields.buttons.*',
    'multilanguage_fields.elements.item.multilanguage_fields.buttons.item.*',
    'multilanguage_fields.elements.item.multilanguage_fields.buttons.item.multilanguage_fields.*',
    'multilanguage_fields.elements.item.multilanguage_fields.buttons.item.multilanguage_fields.target.*',
  ]
}

function getElementFields(): string[] {
  return [
    'id',
    'name',
    'status',
    'multilanguage_fields.*',
    'multilanguage_fields.buttons.*',
    'multilanguage_fields.buttons.item.*',
    'multilanguage_fields.buttons.item.multilanguage_fields.*',
    'multilanguage_fields.buttons.item.multilanguage_fields.target.*',
  ]
}

function getImageFields(): string[] {
  return [
    'id',
    'name',
    'status',
    'multilanguage_fields.image',
    'multilanguage_fields.*',
  ]
}

function getButtonFields(): string[] {
  return [
    'id',
    'name',
    'status',
    'multilanguage_fields.text',
    'multilanguage_fields.target.*',
    'multilanguage_fields.*',
  ]
}

function getUrlFields(): string[] {
  return ['id', 'name', 'status', 'multilanguage_fields.*']
}

function getPayloadFields(): string[] {
  return ['id', 'name', 'status', 'multilanguage_fields.*']
}

function getQueueFields(): string[] {
  return ['id', 'name', 'status', 'multilanguage_fields.*']
}

export function getContextContent(context: cms.SupportedLocales): {} {
  return {
    multilanguage_fields: {
      _filter: { languages_code: { _eq: context } },
    },
  }
}

export function getAllLocalesContent(): {} {
  return {
    multilanguage_fields: { _filter: { text: { _eq: null } } },
  }
}

export function getCustomFields(entry: PartialItem<any>) {
  const customFields: PartialItem<any> = { ...entry }
  const keys = Object.keys(customFields)
  keys.map((key: string) => {
    if (knownFields.includes(key)) {
      delete customFields[key]
    }
  })
  return customFields
}

export function hasFollowUp(entry: OneItem<any>): boolean {
  return !!entry![mf][0]?.followup?.length
}

export function getKeywordsFilter(input: string): {} {
  return {
    filter: {
      keywords: {
        _contains: input,
      },
    },
  }
}
