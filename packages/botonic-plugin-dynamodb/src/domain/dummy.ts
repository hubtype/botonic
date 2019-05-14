import { Track, UserEvent } from './track';

export class DummyTrackStorage {
  write({  }: Track): Promise<undefined> {
    return Promise.resolve(undefined);
  }

  read({  }: string, {  }: Date): Promise<Track> {
    return Promise.resolve(
      new Track('dummy_bot_id', new Date(), [
        new UserEvent('dummy_user', 'dummy_event')
      ])
    );
  }

  remove({  }: string, {  }: Date): Promise<undefined> {
    return Promise.resolve(undefined);
  }
}
