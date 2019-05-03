import { testConfig } from '../helpers/dynamo';
import { DynamoTrackStorage, Env } from '../../src/infrastructure/dynamo';
import { Track, UserEvent } from '../../src/domain';
import time from '../../src/domain/time';

test('TEST: dynamo write', async () => {
  let sut = new DynamoTrackStorage(Env.DEV, testConfig());
  let track1 = new Track('test_bot', time.now(), [
    new UserEvent('user1', 'event1'),
    new UserEvent('user2', 'event2')
  ]);
  try {
    // act
    await sut.write(track1);
    let track2 = new Track('test_bot', track1.time, [
      new UserEvent('user1', 'event3')
    ]);
    await sut.write(track2);

    // assert
    let track3 = await sut.read(track1.botId, track1.time);
    expect(track3.botId).toEqual(track1.botId);
    expect(track3.time).toEqual(track1.time);
    expect(track3.events).toEqual(track1.events.concat(track2.events));
  } finally {
    await sut.remove(track1.botId, track1.time);
  }
});
