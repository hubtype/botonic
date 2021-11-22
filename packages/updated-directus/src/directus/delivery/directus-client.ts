import { Directus, PartialItem } from '@directus/sdk/dist'
import { Stream } from 'stream'

import * as cms from '../../cms'
import { AssetInfo, ContentId } from '../../cms'
import { DirectusOptions } from '../../plugin'
import {
  getContentFields,
  getContextContent,
  getKeywordsFilter,
  hasFollowUp,
  hasQueue,
  hasSchedule,
  mf,
} from './delivery-utils'

export class DirectusClient {
  clientParams: DirectusOptions
  private client: Directus<any>
  constructor(opt: DirectusOptions) {
    this.clientParams = opt
    this.client = new Directus(this.clientParams.credentials.apiEndPoint)
  }

  async getEntry(
    id: string,
    contentType: cms.ContentType,
    context?: cms.SupportedLocales
  ): Promise<PartialItem<any>> {
    try {
      await this.client.auth.static(this.clientParams.credentials.token)
      let entry = await this.client.items(contentType).readOne(id, {
        fields: getContentFields(contentType),
        deep: context && getContextContent(context),
      })
      entry = { ...entry, collection: contentType }
      if (!context) return entry!
      if (hasFollowUp(entry)) {
        Object.assign(
          entry![mf][0],
          await this.getFollowup(entry![mf][0], context)
        )
      }
      if (hasSchedule(entry)) {
        Object.assign(
          entry![mf][0],
          await this.getSchedule(entry![mf][0], context)
        )
      }
      if (hasQueue(entry)) {
        Object.assign(
          entry![mf][0],
          await this.getQueue(entry![mf][0], context)
        )
      }
      return entry!
    } catch (e) {
      console.error(
        `Error getting content with id ${id} of content type ${contentType} and locale ${context}, ${e}`
      )
      return {}
    }
  }

  async contentsWithKeywords(input: string): Promise<string[]> {
    try {
      await this.client.auth.static(this.clientParams.credentials.token)
      const entry = await this.client
        .items(cms.MessageContentType.TEXT)
        .readMany(getKeywordsFilter(input))
      const ids =
        (entry.data &&
          entry.data.map((searchResult: any) => {
            return searchResult.id
          })) ??
        []
      return ids
    } catch (e) {
      console.error(`Error getting keywords from input: ${input}, ${e}`)
      return []
    }
  }

  async topContents(
    contentType: cms.ContentType,
    context: cms.SupportedLocales
  ): Promise<PartialItem<any>[]> {
    try {
      await this.client.auth.static(this.clientParams.credentials.token)

      const entriesIds = await this.client
        .items(contentType)
        .readMany({ fields: ['id'] })

      const entries: PartialItem<any>[] | undefined = []

      for (let i = 0; i < entriesIds.data!.length; i++) {
        const entry = await this.getEntry(
          entriesIds.data![i].id,
          contentType,
          context
        )
        entries.push(entry)
      }

      return entries ?? []
    } catch (e) {
      console.error(`Error getting the contents of type ${contentType}, ${e}`)

      return []
    }
  }

  async deleteContent(contentId: ContentId): Promise<void> {
    try {
      await this.client.auth.static(this.clientParams.credentials.token)
      await this.client.items(contentId.model).deleteOne(contentId.id)
    } catch (e) {
      console.error(
        `Error deleting content with id: ${contentId.id} of content type ${contentId.model}, ${e}`
      )
    }
  }

  async createContent(contentId: ContentId): Promise<void> {
    try {
      await this.client.auth.static(this.clientParams.credentials.token)
      const name = 'random-' + Math.random().toString(36).substring(2)
      await this.client
        .items(contentId.model)
        .createOne({ id: contentId.id, name })
    } catch (e) {
      console.error(
        `Error creating content with id: ${contentId.id} of content type ${contentId.model}, ${e}`
      )
    }
  }

  async updateFields(
    context: cms.SupportedLocales,
    contentType: cms.ContentType,
    id: string,
    fields: PartialItem<any>
  ): Promise<void> {
    try {
      await this.client.auth.static(this.clientParams.credentials.token)
      await this.client.items(contentType).updateOne(id, fields)
    } catch (e) {
      console.error(
        `Error updating content with id: ${id} of content type ${contentType}, ${e}`
      )
    }
  }

  //in progress...
  async createAsset(
    context: cms.SupportedLocales,
    file: string | ArrayBuffer | Stream,
    info: AssetInfo
  ): Promise<void> {
    try {
      await this.client.auth.static(this.clientParams.credentials.token)
      const image = await this.client.items('directus_files').createOne({
        title: info.name,
        storage: 'amazon',
        filename_download: 'new_file',
      })
      console.log({ image })
    } catch (e) {
      throw new Error(`Error creating new asset, ${e}`)
    }
  }

  async getLocales(): Promise<cms.SupportedLocales[]> {
    try {
      await this.client.auth.static(this.clientParams.credentials.token)
      const entry = await this.client.items('languages').readMany()
      const locales = entry.data
        ? entry.data.map((locale: PartialItem<any>) => {
            return locale.code
          })
        : []
      return locales
    } catch (e) {
      console.error(`Error getting the list of locales, ${e}`)
      return []
    }
  }

  async removeLocale(locale: cms.SupportedLocales): Promise<void> {
    try {
      await this.client.auth.static(this.clientParams.credentials.token)
      await this.client.items('languages').deleteOne(locale)
    } catch (e) {
      console.error(`Error deleting locale ${locale}, ${e}`)
    }
  }

  private async getFollowup(
    entry: PartialItem<any>,
    context: cms.SupportedLocales
  ) {
    const followupId = entry.followup[0].item.id
    const contentType = entry.followup[0].collection
    return {
      ...entry,
      followup: await this.getEntry(followupId, contentType, context),
    }
  }

  private async getSchedule(
    entry: PartialItem<any>,
    context: cms.SupportedLocales
  ) {
    const scheduleId = entry.schedule[0].item
    return {
      ...entry,
      schedule: await this.getEntry(
        scheduleId,
        cms.ContentType.SCHEDULE,
        context
      ),
    }
  }

  private async getQueue(
    entry: PartialItem<any>,
    context: cms.SupportedLocales
  ) {
    const queueId = entry.queue[0].item
    return {
      ...entry,
      queue: await this.getEntry(queueId, cms.ContentType.QUEUE, context),
    }
  }
}
