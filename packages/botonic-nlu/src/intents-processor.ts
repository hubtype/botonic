/* eslint-disable @typescript-eslint/unbound-method */
import { DataSet, IntentDecoder } from './types'
import { flipObject } from './util/object-tools'

export class IntentsProcessor {
  private constructor(readonly encoder, readonly decoder) {}

  static fromDecoder(decoder: IntentDecoder): IntentsProcessor {
    return new IntentsProcessor(flipObject(decoder), decoder)
  }

  static fromDataset(data: DataSet): IntentsProcessor {
    let id = 0
    const encoder = {}
    data.forEach(sample => {
      if (!(sample.label in encoder)) {
        encoder[sample.label] = id
        id++
      }
    })
    const decoder = flipObject(encoder)
    return new IntentsProcessor(encoder, decoder)
  }

  get intentsCount(): number {
    return Object.entries(this.encoder).length
  }

  encode(intents: string): number {
    return this.encoder[intents]
  }

  decode(intentId: number): string {
    return this.decoder[intentId]
  }
}
