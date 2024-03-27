import * as contentful from 'contentful'
import { ContentType } from 'contentful'
import memoize from 'memoizee'

import { rethrowDecorator, sleep } from '../../util'
import { jsonNormalizer } from '../../util/memoizer'
import {
  ClientApiErrorReporter,
  GetEntriesType,
  GetEntryType,
  ReducedClientApi,
} from './client-api'

export class CachedClientApi implements ReducedClientApi {
  static readonly NO_EXPIRATION = -1
  readonly getAsset: (id: string, query?: any) => Promise<contentful.Asset>
  readonly getAssets: (query?: any) => Promise<contentful.AssetCollection>
  readonly getEntries: GetEntriesType
  readonly getEntry: GetEntryType
  readonly getContentType: (id: string) => Promise<ContentType>

  constructor(
    readonly client: ReducedClientApi,
    readonly cacheTtlMs = 10000,
    readonly errorReport: ClientApiErrorReporter
  ) {
    this.getAsset = this.memoize(client.getAsset.bind(client), 2)
    this.getAssets = this.memoize(client.getAssets.bind(client), 1)
    this.getEntries = this.memoize(
      client.getEntries.bind(client),
      1
    ) as GetEntriesType
    this.getEntry = this.memoize(
      client.getEntry.bind(client),
      2
    ) as GetEntryType
    this.getContentType = this.memoize(client.getContentType.bind(client), 1)
  }

  memoize<
    Args extends any[],
    Return,
    F extends (...args: Args) => Promise<Return>,
  >(func: F, functionLength: number): F {
    const memo = memoize(func, this.options(functionLength))
    const dec = rethrowDecorator<Args, Return, F>(
      memo,
      async (e, ...args: Args) => {
        await this.errorReport(
          'Error calling Contentful API',
          String(func),
          args,
          e
        )
        // sleep required to ensure that after a failed invocation, the next one also always fails
        // https://github.com/medikoo/memoizee/issues/117
        return sleep(0)
      }
    )
    return dec
  }

  options(length: number) {
    return {
      promise: true,
      primitive: true,
      maxAge:
        this.cacheTtlMs == CachedClientApi.NO_EXPIRATION
          ? undefined
          : this.cacheTtlMs,
      length,
      normalizer: jsonNormalizer,
    } as memoize.Options<any>
  }

  static normalizer(...args: any): string {
    return args
      .map((arg: any) => JSON.stringify(arg))
      .reduce((a: string, b: string) => a + b)
  }
}
