import { testConfig } from '../helpers/dynamo';
import { DynamoTrackStorage, Env } from '../../src/infrastructure/dynamo';
import { Track, UserEvent } from '../../src/domain';

test('TEST: dynamo write', async () => {
  let sut = new DynamoTrackStorage(Env.DEV, testConfig());
  let track = new Track();
  track.bot = 'massimo';
  track.time = new Date();
  // track.time.setTime(1556629558);
  track.events = [
    new UserEvent('user1', 'event1'),
    new UserEvent('user2', 'event2')
  ];

  // act
  await sut.write(track);
  track.events = [new UserEvent('user1', 'event3')];
  await sut.write(track);

  // assert
  // expect(track2).toEqual(track);
});
