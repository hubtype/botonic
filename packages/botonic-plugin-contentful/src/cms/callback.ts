import escapeStringRegexp from 'escape-string-regexp'

import { isOfType } from '../util/enums'
import { Equatable, ValueObject } from '../util/objects'
import { CMS, ContentType, CustomContentType, TopContentType } from './cms'
import { Content, TopContent } from './contents'
import { Context } from './context'
import { CmsException } from './exceptions'

export class Callback implements ValueObject, Equatable {
  // TODO add path
  /**
   * @param payload may contain the reference of a {@link Content}. See {@link ContentCallback}
   * @param url for hardcoded URLs (otherwise, use a {@link Url})
   * @param empty eg. if locale fallback is disabled, we may get empty
   * fields.
   */
  protected constructor(
    readonly payload?: string,
    readonly url?: string,
    readonly empty = false
  ) {
    if (!empty && !payload && !url) {
      throw new CmsException(
        `Callback cannot have both 'URL' and 'payload' fields empty`,
        undefined
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

  static empty(): Callback {
    return new Callback(undefined, undefined, true)
  }

  asContentId(): TopContentId | undefined {
    return undefined
  }

  equals(other: Callback): boolean {
    return this.payload === other.payload && this.url === other.url
  }

  toString(): string {
    if (this.payload) {
      return `'payload:${this.payload}'`
    }
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    return `'URL:${this.url}'`
  }
}

export class ContentCallback extends Callback {
  private static PAYLOAD_SEPARATOR = '$'

  constructor(
    readonly model: TopContentType,
    readonly id: string
  ) {
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
      return modelType
    } else {
      throw new Error(
        `${modelType} is not a model type than can be delivered from CMS`
      )
    }
  }
}

export class ResourceId implements ValueObject {
  constructor(
    readonly resourceType: string,
    readonly id: string
  ) {}

  toString(): string {
    return `'${this.resourceType}' with id '${this.id}'`
  }

  equals(other: ContentId): boolean {
    return this.resourceType === other.resourceType && this.id === other.id
  }

  static create(resourceType: string, id: string): ResourceId {
    if (isOfType(resourceType, ContentType)) {
      return ContentId.create(resourceType, id)
    }
    return new ResourceId(resourceType, id)
  }
}

export class ContentId extends ResourceId {
  constructor(
    readonly model: ContentType,
    id: string
  ) {
    super(model, id)
  }

  static create(model: ContentType, id: string): ContentId {
    if (isOfType(model, TopContentType)) {
      return new TopContentId(model, id)
    }
    return new ContentId(model, id)
  }

  deliver(cms: CMS, context?: Context): Promise<Content> {
    switch (this.model) {
      case ContentType.BUTTON:
        return cms.button(this.id, context)
      case ContentType.ELEMENT:
        return cms.element(this.id, context)
      case CustomContentType.CUSTOM:
        return cms.custom(this.id, context)
      default:
        return new TopContentId(this.model, this.id).deliver(cms, context)
    }
  }
}

export class AssetId extends ResourceId {
  constructor(
    id: string,
    readonly assetType: string | undefined
  ) {
    super(`${String(assetType)} asset`, id)
  }
}

export class TopContentId extends ContentId {
  constructor(
    readonly model: TopContentType,
    id: string
  ) {
    super(model, id)
  }

  deliver(cms: CMS, context?: Context): Promise<TopContent> {
    switch (this.model) {
      case ContentType.CAROUSEL:
        return cms.carousel(this.id, context)
      case ContentType.DOCUMENT:
        return cms.document(this.id, context)
      case ContentType.TEXT:
        return cms.text(this.id, context)
      case ContentType.CHITCHAT:
        return cms.chitchat(this.id, context)
      case ContentType.STARTUP:
        return cms.startUp(this.id, context)
      case ContentType.IMAGE:
        return cms.image(this.id, context)
      case ContentType.VIDEO:
        return cms.video(this.id, context)
      case ContentType.DATE_RANGE:
        return cms.dateRange(this.id)
      case ContentType.QUEUE:
        return cms.queue(this.id, context)
      case ContentType.URL:
        return cms.url(this.id, context)
      case ContentType.PAYLOAD:
        return cms.payload(this.id, context)
      case ContentType.SCHEDULE:
        return cms.schedule(this.id)
      case ContentType.HANDOFF:
        return cms.handoff(this.id, context)
      case ContentType.INPUT:
        return cms.input(this.id, context)
      default:
        throw new Error(
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          `Type '${this.model}' not supported for callback with id '${this.id}'`
        )
    }
  }
}
