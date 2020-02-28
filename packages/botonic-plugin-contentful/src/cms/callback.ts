import {
  CMS,
  ContentType,
  MESSAGE_CONTENT_TYPES,
  MessageContentType,
} from './cms'
import escapeStringRegexp from 'escape-string-regexp'
import { Context } from './context'
import { TopContent } from './contents'

export class Callback {
  // TODO add path
  /**
   * @param payload may contain the reference of a {@link Content}. See {@link ContentCallback}
   * @param url for hardcoded URLs (otherwise, use a {@link Url})
   */
  constructor(readonly payload?: string, readonly url?: string) {}

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
}

export class ContentCallback extends Callback {
  private static PAYLOAD_SEPARATOR = '$'

  constructor(readonly model: ContentType, readonly id: string) {
    super(model + ContentCallback.PAYLOAD_SEPARATOR + id)
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

  static regexForModel(modelType: MessageContentType): RegExp {
    return new RegExp(
      '^' +
        escapeStringRegexp(modelType + ContentCallback.PAYLOAD_SEPARATOR) +
        '[a-zA-Z0-9]*$'
    )
  }

  private static checkDeliverableModel(modelType: string): MessageContentType {
    if (MESSAGE_CONTENT_TYPES.includes(modelType as MessageContentType)) {
      return modelType as MessageContentType
    } else {
      throw new Error(
        `${modelType} is not a model type than can be delivered from CMS`
      )
    }
  }

  deliverPayloadContent(cms: CMS, context?: Context): Promise<TopContent> {
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
