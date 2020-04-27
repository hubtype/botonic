import { CMS, ContentType, TopContentType } from './cms'
import escapeStringRegexp from 'escape-string-regexp'
import { Context } from './context'
import { Content, TopContent } from './contents'
import { isOfType } from '../util/enums'
import { Equatable, ValueObject } from '../util/objects'
import { CmsException } from './exceptions'

export class Callback implements ValueObject {
  // TODO add path
  /**
   * @param payload may contain the reference of a {@link Content}. See {@link ContentCallback}
   * @param url for hardcoded URLs (otherwise, use a {@link Url})
   */
  protected constructor(readonly payload?: string, readonly url?: string) {
    if (!payload && !url) {
      // TODO throw an exception when CsvExport is fixed (@see IgnoreFallbackDecorator)
      console.error(
        `Callback cannot have both 'URL' and 'payload' fields empty`
      )
    }
    if (payload && url) {
      throw new CmsException(
        `Callback cannot have both 'URL' and 'payload' fields informed`
      )
    }
  }

  static ofPayload(payload: string): Callback {
    if (ContentCallback.payloadReferencesContent(payload)) {
      return ContentCallback.ofPayload(payload)
    } else {
      return new Callback(payload, undefined)
    }
  }

  static ofUrl(url: string): Callback {
    return new Callback(undefined, url)
  }

  asContentId(): TopContentId | undefined {
    return undefined
  }

  equals(other: Callback): boolean {
    return this.payload === other.payload && this.url === other.url
  }

  toString(): string {
    if (this.payload) {
      return `payload:${this.payload}`
    }
    return `URL:${this.url}`
  }
}

export class ContentCallback extends Callback implements Equatable {
  private static PAYLOAD_SEPARATOR = '$'

  constructor(readonly model: TopContentType, readonly id: string) {
    super(model + ContentCallback.PAYLOAD_SEPARATOR + id)
  }

  asContentId(): TopContentId {
    return new TopContentId(this.model, this.id)
  }

  static payloadReferencesContent(payload: string): boolean {
    return payload.includes(ContentCallback.PAYLOAD_SEPARATOR)
  }

  static ofPayload(payload: string): ContentCallback {
    const [type, id] = payload.split(ContentCallback.PAYLOAD_SEPARATOR)
    if (!id) {
      throw new Error(
        `Callback payload '${payload}' does not contain a model reference`
      )
    }
    return new ContentCallback(ContentCallback.checkDeliverableModel(type), id)
  }

  static ofContentId(contentId: TopContentId): ContentCallback {
    return new ContentCallback(contentId.model, contentId.id)
  }

  static regexForModel(modelType: ContentType): RegExp {
    return new RegExp(
      '^' +
        escapeStringRegexp(modelType + ContentCallback.PAYLOAD_SEPARATOR) +
        '[a-zA-Z0-9]*$'
    )
  }

  private static checkDeliverableModel(modelType: string): TopContentType {
    if (isOfType(modelType, TopContentType)) {
      return modelType as TopContentType
    } else {
      throw new Error(
        `${modelType} is not a model type than can be delivered from CMS`
      )
    }
  }
}

export class ContentId implements ValueObject {
  constructor(readonly model: ContentType, readonly id: string) {}

  deliver(cms: CMS, context?: Context): Promise<Content> {
    switch (this.model) {
      case ContentType.BUTTON:
        return cms.button(this.id, context)
      case ContentType.ELEMENT:
        return cms.element(this.id, context)
      default:
        return new TopContentId(this.model, this.id).deliver(cms, context)
    }
  }

  toString(): string {
    return `${this.model} with id '${this.id}'`
  }

  equals(other: ContentId): boolean {
    return this.model === other.model && this.id === other.id
  }
}

export class TopContentId extends ContentId {
  constructor(readonly model: TopContentType, id: string) {
    super(model, id)
  }

  deliver(cms: CMS, context?: Context): Promise<TopContent> {
    switch (this.model) {
      case ContentType.CAROUSEL:
        return cms.carousel(this.id, context)
      case ContentType.TEXT:
        return cms.text(this.id, context)
      case ContentType.CHITCHAT:
        return cms.chitchat(this.id, context)
      case ContentType.STARTUP:
        return cms.startUp(this.id, context)
      case ContentType.IMAGE:
        return cms.image(this.id, context)
      case ContentType.DATE_RANGE:
        return cms.dateRange(this.id)
      case ContentType.QUEUE:
        return cms.queue(this.id, context)
      case ContentType.URL:
        return cms.url(this.id, context)
      case ContentType.SCHEDULE:
        return cms.schedule(this.id)
      default:
        throw new Error(
          `Type '${this.model}' not supported for callback with id '${this.id}'`
        )
    }
  }
}

/**
 * Map the id of a UI element such a button to a callback
 */
export class CallbackMap {
  private forAllIds?: Callback

  private callbacks: Map<string, Callback> = new Map()

  static forAllIds(callback: Callback): CallbackMap {
    const map = new CallbackMap()
    map.forAllIds = callback
    return map
  }

  addCallback(id: string, callback: Callback): CallbackMap {
    if (this.forAllIds) {
      throw new Error('Cannot add callback when created with forAllIds')
    }

    this.callbacks.set(id, callback)
    return this
  }

  getCallback(id: string): Callback {
    if (this.forAllIds) {
      return this.forAllIds
    }

    const callback = this.callbacks.get(id)
    if (!callback) {
      throw new Error(`No callback for id ${id}`)
    }

    return callback
  }
}
