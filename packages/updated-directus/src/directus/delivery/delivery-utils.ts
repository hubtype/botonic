import { OneItem, PartialItem } from '@directus/sdk'

import * as cms from '../../cms'

export const knownFields = [
  'id',
  'name',
  'shorttext',
  'keywords',
  'followup',
  'text',
  'buttons',
  'image',
  'target',
  'url',
  'elements',
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
    case cms.ContentType.CAROUSEL:
      return getCarouselFields()
    default:
      return []
  }
}

function getTextFields(): string[] {
  return [
    'id',
    'name',
    'text',
    'shorttext',
    'keywords',
    'buttons.*',
    'buttons.item.*',
    'buttons.item.text',
    'buttons.item.target.*',
    'buttons.item.target.item.*',
    'followup.item.*',
    'buttonstyle',
    '*',
  ]
}

function getCarouselFields(): string[] {
  return [
    'id',
    'name',
    'shorttext',
    'keywords',
    'elements.*',
    'elements.item.*',
    'elements.item.buttons.*',
    'elements.item.buttons.item.*',
    'elements.item.buttons.item.text',
    'elements.item.buttons.item.target.*',
    'elements.item.buttons.item.target.item.*',
    '*',
  ]
}

function getImageFields(): string[] {
  return ['id', 'name', 'image', '*']
}

function getButtonFields(): string[] {
  return ['id', 'name', 'text', 'target.*', 'target.item.*', '*']
}

function getUrlFields(): string[] {
  return ['id', 'name', 'shorttext', 'url', 'keywords', '*']
}

// export function getLocaleFilter(
//   context: cms.SupportedLocales,
//   contentType: cms.ContentType
// ): {} {
//   return contentType === cms.MessageContentType.IMAGE
//     ? {
//         image: {
//           _filter: { languages_code: { _eq: `${context}` } },
//         },
//       }
//     : {
//         text: {
//           _filter: { languages_code: { _eq: `${context}` } },
//         },
//       }
// }

//Descomment when in Directus is possible to create more than one localized field in a content model
/*
export function getFieldsToLocalize(context: cms.SupportedLocales): {} {
  let fieldsFilters: Record<string, {}> = {}
  knownFields.map((field: string) => {
    fieldsFilters[field] = {
      _filter: { languages_code: { _eq: `${context}` } },
    }
  })
  return fieldsFilters
}
*/

export function getCustomFields(entry: PartialItem<any>) {
  const customFields: PartialItem<any> = {}
  Object.assign(customFields, entry)
  const keys = Object.keys(customFields)
  keys.map((key: string) => {
    if (knownFields.includes(key)) {
      delete customFields[key]
    }
  })
  return customFields
}

export function hasFollowUp(entry: OneItem<any>): boolean {
  return !!entry?.followup?.length
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
