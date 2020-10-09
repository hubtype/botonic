/* eslint-disable @typescript-eslint/unbound-method */
import { DataSet, IntentEncoder, IntentDecoder } from './types';
import { flipObject } from './util/object-tools';

export class IntentsProcessor {
  private _encoder: IntentEncoder;
  private _decoder: IntentDecoder;

  constructor() {
    this._encoder = {};
    this._decoder = {};
  }

  get intentsCount(): number {
    return Object.entries(this._encoder).length;
  }

  get decoder(): IntentDecoder {
    return this._decoder;
  }

  get encoder(): IntentEncoder {
    return this._encoder;
  }

  loadEncoderDecoder(decoder: IntentDecoder): void {
    this._encoder = flipObject(decoder);
    this._decoder = decoder;
  }

  generateEncoderDecoder(data: DataSet): void {
    let id = 0;
    data.forEach((sample) => {
      if (!(sample.label in this._encoder)) {
        this._encoder[sample.label] = id;
        id++;
      }
    });
    this._decoder = flipObject(this._encoder);
  }

  encode(intents: string): number {
    return this._encoder[intents];
  }

  decode(intentId: number): string {
    return this._decoder[intentId];
  }
}
