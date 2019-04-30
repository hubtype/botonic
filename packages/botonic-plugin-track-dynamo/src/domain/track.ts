import {
  hashKey,
  rangeKey,
  table
} from '@aws/dynamodb-data-mapper-annotations';
import Time from './time';

@table('track')
export class Track {
  @hashKey()
  bot: string = '';

  @rangeKey({
    defaultProvider: () => Time.now()
  })
  time: Date = Time.now();
}

export interface TrackWriter {
  write(track: Track): any;
}
