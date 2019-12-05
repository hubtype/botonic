import { Track, TrackStorage, UserEvent } from './track'

export class DummyTrackStorage implements TrackStorage {
  write({}: Track): Promise<void> {
    return Promise.resolve()
  }

  read({}: string, {}: Date): Promise<Track> {
    return Promise.resolve(
      new Track('dummy_bot_id', new Date(), [
        new UserEvent('dummy_user', 'dummy_event'),
      ])
    )
  }

  remove({}: string, {}: Date): Promise<void> {
    return Promise.resolve()
  }
}
