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
  'mondays',
  'tuesdays',
  'wednesdays',
  'thursdays',
  'fridays',
  'saturdays',
  'sundays',
  'exceptions',
  'hourRanges',
  'schedule',
  'botonic_queue_name',
  'handoff_fail_message',
  'handoff_message',
  'shadowing',
  'onfinish',
  'queue',
  'queue_id',
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

export const referenceFields = [
  'buttons',
  'followup',
  'target',
  'elements',
  'mondays',
  'tuesdays',
  'wednesdays',
  'thursdays',
  'fridays',
  'saturdays',
  'sundays',
  'exceptions',
  'hourRanges',
  'schedule',
  'onfinish',
  'queue',
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
    case cms.ContentType.SCHEDULE:
      return getScheduleFields()
    case cms.ContentType.HANDOFF:
      return getHandoffFields()
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
    'multilanguage_fields.buttons.item.multilanguage_fields.target.item.*',
    'multilanguage_fields.buttons.item.multilanguage_fields.target.item.multilanguage_fields.*',
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
    'multilanguage_fields.elements.item.multilanguage_fields.buttons.item.multilanguage_fields.item.*',
    'multilanguage_fields.elements.item.multilanguage_fields.buttons.item.multilanguage_fields.item.multilanguage_fields.*',
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
    'multilanguage_fields.buttons.item.multilanguage_fields.target.item.*',
    'multilanguage_fields.buttons.item.multilanguage_fields.target.item.multilanguage_fields.*',
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
    'multilanguage_fields.*',
    'multilanguage_fields.target.*',
    'multilanguage_fields.target.item.*',
    'multilanguage_fields.target.item.multilanguage_fields.*',
  ]
}

function getUrlFields(): string[] {
  return ['id', 'name', 'status', 'multilanguage_fields.*']
}

function getPayloadFields(): string[] {
  return ['id', 'name', 'status', 'multilanguage_fields.*']
}

function getScheduleFields(): string[] {
  return [
    'id',
    'name',
    'status',
    'multilanguage_fields.*',
    'multilanguage_fields.mondays.*',
    'multilanguage_fields.mondays.item.*',
    'multilanguage_fields.mondays.item.multilanguage_fields.*',
    'multilanguage_fields.tuesdays.*',
    'multilanguage_fields.tuesdays.item.*',
    'multilanguage_fields.tuesdays.item.multilanguage_fields.*',
    'multilanguage_fields.wednesdays.*',
    'multilanguage_fields.wednesdays.item.*',
    'multilanguage_fields.wednesdays.item.multilanguage_fields.*',
    'multilanguage_fields.thursdays.*',
    'multilanguage_fields.thursdays.item.*',
    'multilanguage_fields.thursdays.item.multilanguage_fields.*',
    'multilanguage_fields.fridays.*',
    'multilanguage_fields.fridays.item.*',
    'multilanguage_fields.fridays.item.multilanguage_fields.*',
    'multilanguage_fields.saturdays.*',
    'multilanguage_fields.saturdays.item.*',
    'multilanguage_fields.saturdays.item.multilanguage_fields.*',
    'multilanguage_fields.sundays.*',
    'multilanguage_fields.sundays.item.*',
    'multilanguage_fields.sundays.item.multilanguage_fields.*',
    'multilanguage_fields.exceptions.*',
    'multilanguage_fields.exceptions.item.*',
    'multilanguage_fields.exceptions.item.multilanguage_fields.*',
    'multilanguage_fields.exceptions.item.multilanguage_fields.hour_ranges.*',
    'multilanguage_fields.exceptions.item.multilanguage_fields.hour_ranges.item.multilanguage_fields.*',
  ]
}

function getQueueFields(): string[] {
  return [
    'id',
    'name',
    'status',
    'multilanguage_fields.*',
    'multilanguage_fields.schedule.*',
  ]
}

function getHandoffFields(): string[] {
  return [
    'id',
    'name',
    'status',
    'multilanguage_fields.*',
    'multilanguage_fields.queue.*',
    'multilanguage_fields.onfinish.*',
  ]
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

export function hasSchedule(entry: OneItem<any>): boolean {
  return !!entry![mf][0]?.schedule?.length
}

export function hasQueue(entry: OneItem<any>): boolean {
  return !!entry![mf][0]?.queue?.length
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
