import { ContentType } from './cms'

export class Callback {
  readonly payload?: string
  readonly url?: string

  constructor(payload?: string, url?: string) {
    this.payload = payload
    this.url = url
  }

  static ofUrl(url: string): Callback {
    return new Callback(undefined, url)
  }

  static ofPayload(payload: string): Callback {
    return new Callback(payload, undefined)
  }
}

export class ContentCallback extends Callback {
  private static PAYLOAD_SEPARATOR = '$'

  constructor(readonly model: ContentType, readonly id: string) {
    super(model + ContentCallback.PAYLOAD_SEPARATOR + id)
  }
}
