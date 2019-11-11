const { humanHandOff, HandOffBuilder } = require('./handoff')

describe('handOff', () => {
  test.each([
    [
      `create_case:{
        "queue":"q1",
        "onFinish":{"payload":"payload1"}
       }`,
      'q1',
      { payload: 'payload1' },
    ],
    [
      `create_case:{
        "onFinish":{"path":"path1"}
       }`,
      '',
      { path: 'path1' },
    ],
  ])('humanHandOff', (expected, queue, onFinish) => {
    let session = {}
    humanHandOff(session, queue, onFinish)
    expect(session._botonic_action).toEqual(expected.replace(/[ \n]/g, ''))
  })

  test.each([
    [
      `create_case:{
        "queue":"q1",
        "agent_email":"email1",
        "caseInfo":"http%3A%2F%2Fcase",
        "note":"http%3A%2F%2Fnote",
        "onFinish":{"payload":"payload1"}
       }`,
      new HandOffBuilder({})
        .withQueue('q1')
        .withOnFinishPayload('payload1')
        .withAgentEmail('email1')
        .withCaseInfoURL('http://case')
        .withNoteURL('http://note'),
    ],
    [
      `create_case:{
        "onFinish":{"path":"path1"}
       }`,
      new HandOffBuilder({}).withOnFinishPath('path1'),
    ],
  ])('HandOffBuilder', (expected, builder) => {
    builder.handOff()
    expect(builder._session._botonic_action).toEqual(
      expected.replace(/[ \n]/g, '')
    )
  })
})
