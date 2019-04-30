import { testConfig } from '../helpers/dynamo';
import { DynamoTrackWriter, Env } from '../../src/infrastructure/dynamo';
import { Track } from '../../src/domain';

test('TEST: dynamo write', async () => {
  let sut = new DynamoTrackWriter(Env.DEV, testConfig());
  let track = new Track();
  track.bot = 'massimo';

  // act
  let track2 = await sut.write(track);

  // assert
  expect(track2).toEqual(track);
});
