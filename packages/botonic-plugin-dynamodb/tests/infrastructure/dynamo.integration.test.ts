import BotonicPluginDynamoDB, { DynamoDbOptions, Env } from '../../src'
import { Track, UserEvent } from '../../src/domain'
import time from '../../src/domain/time'
import { Track as DynamoTrack } from '../../src/infrastructure/track'

test('TEST: Track serialization', () => {
  DynamoTrack.testSerialization()
})

// TODO: Review test
test.skip('TEST: dynamo write', async () => {
  const sut = new BotonicPluginDynamoDB({ env: Env.DEV } as DynamoDbOptions)
    .storage
  const track1 = new Track('test_bot', time.now(), [
    new UserEvent('user1', 'event1', { arg1: 'val1' }),
    new UserEvent('user2', 'event2'),
  ])
  try {
    // act
    await sut.write(track1)
    const track2 = new Track('test_bot', track1.time, [
      new UserEvent('user1', 'event3', { arg3: 'val3' }),
    ])
    await sut.write(track2)

    // assert
    // some times read fails due to https://metisai.atlassian.net/browse/HTYPE-1881
    const track3 = await sut.read(track1.botId, track1.time)
    expect(track3.botId).toEqual(track1.botId)
    expect(track3.time).toEqual(track1.time)
    expect(track3.events).toEqual(track1.events.concat(track2.events))
  } finally {
    await sut.remove(track1.botId, track1.time)
  }
})
