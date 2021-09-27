import * as contentful from 'contentful'

import * as cms from '../../cms'
import { CmsException, ContentType } from '../../cms'
import { TopContentType } from '../../cms/cms'
import { isOfType } from '../../util/enums'
import { ContentfulEntryUtils } from '../delivery-utils'
import { CarouselFields } from './carousel'
import { HandoffFields } from './handoff'
import { PayloadFields } from './payload'
import { QueueFields } from './queue'
import { HourRangeFields, ScheduleFields } from './schedule'
import { StartUpFields } from './startup'
import { TextFields } from './text'
import { UrlFields } from './url'

export type CallbackTarget = contentful.Entry<
  | CarouselFields
  | TextFields
  | UrlFields
  | PayloadFields
  | StartUpFields
  | QueueFields
  | HourRangeFields
  | ScheduleFields
  | HandoffFields
>

export function getTargetCallback(
  target: CallbackTarget,
  context: cms.Context
): cms.Callback {
  const model = ContentfulEntryUtils.getContentModel(target) as string
  try {
    switch (model) {
      case ContentType.URL: {
        const urlFields = target as contentful.Entry<UrlFields>
        if (!urlFields.fields.url && context.ignoreFallbackLocale) {
          return cms.Callback.empty()
        }
        return cms.Callback.ofUrl(urlFields.fields.url || '')
      }
      case ContentType.PAYLOAD: {
        const payloadFields = target as contentful.Entry<PayloadFields>
        return cms.Callback.ofPayload(payloadFields.fields.payload)
      }
    }
    if (isOfType(model, TopContentType)) {
      return new cms.ContentCallback(model, target.sys.id)
    }
    throw new Error('Unexpected type: ' + model)
  } catch (e) {
    throw new CmsException(
      `Error delivering button with id '${target.sys.id}'`,
      e
    )
  }
}
