import { Directus, PartialItem } from '@directus/sdk/dist'
import { Environment } from '../manage/environments'
import { Stream } from 'stream'

import * as cms from '../../cms'
import { AssetInfo, ContentId, LocaleToBeAddedType } from '../../cms'
import { DirectusOptions } from '../../plugin'
import {
  getContentFields,
  getContextContent,
  getKeywordsFilter,
  hasFollowUp,
  hasQueue,
  hasSchedule,
  mf,
  referenceFields,
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
    context?: cms.SupportedLocales,
    returnOriginalEntry?: boolean
  ): Promise<PartialItem<any>> {
    try {
      await this.client.auth.static(this.clientParams.credentials.token)
      let entry = await this.client.items(contentType).readOne(id, {
        fields: getContentFields(contentType),
        deep: context && getContextContent(context),
      })
      entry = { ...entry, collection: contentType }
      entry[mf] = this.removeEmptyLocales(entry[mf])
      if (returnOriginalEntry) return entry!
      if (hasFollowUp(entry)) {
        Object.assign(
          entry![mf][0],
          await this.getFollowup(entry![mf][0], context!)
        )
      }
      if (hasSchedule(entry)) {
        Object.assign(
          entry![mf][0],
          await this.getSchedule(entry![mf][0], context!)
        )
      }
      if (hasQueue(entry)) {
        Object.assign(
          entry![mf][0],
          await this.getQueue(entry![mf][0], context!)
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
    context?: cms.SupportedLocales,
    returnOriginalEntry?: boolean
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
          context,
          returnOriginalEntry
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
    file: string | ArrayBuffer | Stream,
    info?: AssetInfo
  ): Promise<void> {
    try {
      await this.client.auth.static(this.clientParams.credentials.token)
      await this.client.items('directus_files').createOne({
        data: file,
        filename_download: 'jeje',
        storage: 's3',
      })
    } catch (e) {
      throw new Error(`Error creating new file, ${e}`)
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

  async removeLocales(locales: cms.SupportedLocales[]): Promise<void> {
    locales.forEach(async (locale: cms.SupportedLocales) => {
      try {
        await this.client.auth.static(this.clientParams.credentials.token)
        await this.client.items('languages').deleteOne(locale)
      } catch (e) {
        console.error(`Error deleting locale ${locale}, ${e}`)
      }
    })
  }

  async addLocales(localesToBeAdded: LocaleToBeAddedType[]): Promise<void> {
    for (let localeToBeAdded of localesToBeAdded) {
      try {
        await this.client.auth.static(this.clientParams.credentials.token)
        await this.client.items('languages').createOne({
          name: localeToBeAdded.locale,
          code: localeToBeAdded.locale,
        })
        if (!localeToBeAdded.copyFrom) {
          return
        }

        await this.copyLocale(localeToBeAdded)
      } catch (e) {
        localeToBeAdded.copyFrom
          ? console.error(
              `Error adding locale: ${localeToBeAdded.locale} copying content from locale: ${localeToBeAdded.copyFrom}, ${e}`
            )
          : console.error(
              `Error adding locale: ${localeToBeAdded.locale}, ${e}`
            )
      }
    }
  }

  async getEnvironments(): Promise<Environment[]> {
    try {
      await this.client.auth.static(this.clientParams.credentials.token)
      const entry = await this.client.items('environment').readMany()
      const envsPromises = entry.data
        ? entry.data.map(async (env: PartialItem<any>) => {
            const alias = env.alias
              ? await this.getEnvironment(env.alias)
              : undefined
            return new Environment(env.name, alias)
          })
        : []
      const envs = Promise.all(envsPromises)
      return envs
    } catch (e) {
      console.error(`Error getting the list of environments, ${e}`)
      return []
    }
  }

  async deleteEnvironment(environmentId: string): Promise<void> {
    try {
      // add getIdByName() in order to get the env id by name received in params
      await this.client.auth.static(this.clientParams.credentials.token)
      await this.client.items('environment').deleteOne(environmentId)
    } catch (e) {
      console.error(`Error deleting environment with id ${environmentId}, ${e}`)
    }
  }

  async getEnvironment(
    environmentId: string
  ): Promise<Environment | undefined> {
    try {
      // add getIdByName() in order to get the env id by name received in params
      await this.client.auth.static(this.clientParams.credentials.token)
      const entry = await this.client
        .items('environment')
        .readOne(environmentId)
      const alias = entry!.alias
        ? await this.getEnvironment(entry!.alias)
        : undefined
      return new Environment(entry!.name, alias)
    } catch (e) {
      console.error(
        `Error getting the environment with id ${environmentId}, ${e}`
      )
      return undefined
    }
  }

  async createEnvironmentWithId(
    environmentId: string
  ): Promise<Environment | undefined> {
    try {
      await this.client.auth.static(this.clientParams.credentials.token)
      const entry = await this.client
        .items('environment')
        .createOne({ name: environmentId, alias: null })
      const alias = entry!.alias
        ? await this.getEnvironment(entry!.alias)
        : undefined
      return new Environment(entry!.name, alias)
    } catch (e) {
      console.error(`Error creating environment ${environmentId}, ${e}`)
      return undefined
    }
  }

  private async copyLocale(
    localeToBeAdded: LocaleToBeAddedType
  ): Promise<void> {
    for (let contentType of cms.DirectusContentTypes) {
      const contentTypeEntries = await this.topContents(
        contentType,
        undefined,
        true
      )
      for (let entry of contentTypeEntries) {
        let localeCopyFrom = this.getLocaleContent(
          entry,
          localeToBeAdded.copyFrom!
        )

        if (localeCopyFrom != undefined) {
          const newLocale = {
            ...localeCopyFrom,
          }

          newLocale['languages_code'] = localeToBeAdded.locale
          delete newLocale['id']

          this.addReferenceFields(newLocale, localeCopyFrom)

          entry[mf].push(newLocale)

          await this.updateFields(contentType, entry.id, {
            [mf]: entry[mf],
          })
        }
      }
    }
  }

  private removeEmptyLocales(
    localesContent: PartialItem<any>[]
  ): PartialItem<any>[] {
    const notEmptyLocalesContent = localesContent.filter(
      (localeContent: PartialItem<any>) => localeContent.languages_code != null
    )
    localesContent = [...notEmptyLocalesContent]
    return localesContent
  }

  private addReferenceFields(
    newLocale: PartialItem<any>,
    localeCopyFrom: PartialItem<any>
  ) {
    referenceFields.forEach((field: string) => {
      if (newLocale[field] && newLocale[field].length) {
        if (newLocale[field].length > 1) {
          newLocale[field].forEach((element: PartialItem<any>, i: number) => {
            newLocale[field][i] = this.createItem(localeCopyFrom[field][i])
          })
        } else {
          newLocale[field] = [this.createItem(localeCopyFrom[field][0])]
        }
      }
    })
  }

  private createItem(itemToCopyFrom: PartialItem<any>): PartialItem<any> {
    const newItem = {
      collection: itemToCopyFrom.collection,
      item: itemToCopyFrom.item,
    }
    return newItem
  }

  private getLocaleContent(
    entry: PartialItem<any>,
    context: cms.SupportedLocales
  ): PartialItem<any> {
    const localeFound = entry[mf].find(
      (localeContent: PartialItem<any>) =>
        localeContent.languages_code === context
    )
    return localeFound
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
    const scheduleId = entry.schedule[0].item.id
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
    const queueId = entry.queue[0].item.id
    return {
      ...entry,
      queue: await this.getEntry(queueId, cms.ContentType.QUEUE, context),
    }
  }
}
