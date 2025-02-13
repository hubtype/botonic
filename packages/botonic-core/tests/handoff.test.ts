// @ts-nocheck
import { BotonicAction, PATH_PAYLOAD_IDENTIFIER } from '../src'
import { HandOffBuilder, HelpdeskEvent, humanHandOff } from '../src/handoff'

describe('Handoff', () => {
  test.each([
    [
      `create_case:{
        "force_assign_if_not_available":true,
        "queue":"q1",
        "on_finish":"payload1"
       }`,
      'q1',
      { payload: 'payload1' },
    ],
    [
      `create_case:{
        "force_assign_if_not_available":true,
        "on_finish":"${PATH_PAYLOAD_IDENTIFIER}path1"
       }`,
      '',
      { path: 'path1' },
    ],
  ])('humanHandOff', (expected, queue, onFinish) => {
    const session = {}
    humanHandOff(session, queue, onFinish)
    expect(session._botonic_action).toEqual(expected.replace(/[ \n]/g, ''))
  })

  test.each([
    [
      `create_case:` +
        JSON.stringify({
          force_assign_if_not_available: true,
          queue: 'q1',
          agent_email: 'email1',
          case_info: '{}{:::: m"ho menjo tot}',
          note: '{}{:::: m"ho menjo tot2}',
          on_finish: 'payload1',
        }),
      new HandOffBuilder({})
        .withQueue('q1')
        .withOnFinishPayload('payload1')
        .withAgentEmail('email1')
        .withCaseInfo('{}{:::: m"ho menjo tot}')
        .withNote('{}{:::: m"ho menjo tot2}'),
    ],
    [
      `create_case:` +
        JSON.stringify({
          force_assign_if_not_available: true,
          on_finish: `${PATH_PAYLOAD_IDENTIFIER}path1`,
        }),
      new HandOffBuilder({}).withOnFinishPath('path1'),
    ],
    [
      `${BotonicAction.CreateCase}:` +
        JSON.stringify({
          force_assign_if_not_available: true,
          agent_id: '1234',
        }),
      new HandOffBuilder({}).withAgentId('1234'),
    ],
  ])('HandOffBuilder', (expected, builder) => {
    builder.handOff()
    expect(builder._session._botonic_action).toEqual(expected)
  })

  test('receives the auto idle message', () => {
    const builder = new HandOffBuilder({}).withAutoIdleMessage(
      'the case is in IDLE status'
    )
    builder.handOff()
    const expectedBotonicAction =
      `${BotonicAction.CreateCase}:` +
      JSON.stringify({
        force_assign_if_not_available: true,
        auto_idle_message: 'the case is in IDLE status',
      })
    expect(builder._session._botonic_action).toEqual(expectedBotonicAction)
  })

  test.each([undefined, true, false])(
    'sends the force_assign_if_not_available parameter',
    (forceAssign: boolean | undefined) => {
      const builder =
        forceAssign !== undefined
          ? new HandOffBuilder({}).withForceAssignIfNotAvailable(forceAssign)
          : new HandOffBuilder({})
      const value = forceAssign ?? true
      builder.handOff()
      const expectedBotonicAction =
        `${BotonicAction.CreateCase}:` +
        JSON.stringify({ force_assign_if_not_available: value })
      expect(builder._session._botonic_action).toEqual(expectedBotonicAction)
    }
  )

  test.each([undefined, true, false])(
    'sends the auto_assign_on_waiting parameter',
    (autoAssignOnWaiting: boolean | undefined) => {
      const builder =
        autoAssignOnWaiting !== undefined
          ? new HandOffBuilder({}).withAutoAssignOnWaiting(autoAssignOnWaiting)
          : new HandOffBuilder({})
      builder.handOff()
      const defaultParams = { force_assign_if_not_available: true }
      const params = autoAssignOnWaiting
        ? { ...defaultParams, auto_assign_on_waiting: true }
        : defaultParams
      const expectedBotonicAction =
        `${BotonicAction.CreateCase}:` + JSON.stringify(params)
      expect(builder._session._botonic_action).toEqual(expectedBotonicAction)
    }
  )

  test('receives the extra data', () => {
    const builder = new HandOffBuilder({}).withExtraData({
      language: 'en',
      location: 'Spain',
    })
    builder.handOff()
    const expectedBotonicAction =
      `${BotonicAction.CreateCase}:` +
      JSON.stringify({
        force_assign_if_not_available: true,
        case_extra_data: { language: 'en', location: 'Spain' },
      })
    expect(builder._session._botonic_action).toEqual(expectedBotonicAction)
  })

  test('defines create_test_integration_case_with_payload for test integrations', () => {
    const builder = new HandOffBuilder({
      is_test_integration: true,
    }).withOnFinishPayload('payload1')
    builder.handOff()
    const expectedBotonicAction = `${BotonicAction.CreateTestCase}:payload1`
    expect(builder._session._botonic_action).toEqual(expectedBotonicAction)
  })

  test('Create a handoff and subscribe to agent_messsage_created', () => {
    const builder = new HandOffBuilder({})
      .withSubscribeHelpdeskEvents([HelpdeskEvent.AgentMessageCreated])
      .withOnFinishPayload('payload1')
    builder.handOff()
    const expectedBotonicAction = `${BotonicAction.CreateCase}:{"force_assign_if_not_available":true,"on_finish":"payload1","subscribe_helpdesk_events":["agent_message_created"]}`
    expect(builder._session._botonic_action).toEqual(expectedBotonicAction)
  })
  test('Create a handoff and subscribe to initial_queue_position', () => {
    const builder = new HandOffBuilder({})
      .withSubscribeHelpdeskEvents([HelpdeskEvent.InitialQueuePosition])
      .withOnFinishPayload('payload1')
    builder.handOff()
    const expectedBotonicAction = `${BotonicAction.CreateCase}:{"force_assign_if_not_available":true,"on_finish":"payload1","subscribe_helpdesk_events":["initial_queue_position"]}`
    expect(builder._session._botonic_action).toEqual(expectedBotonicAction)
  })
})
