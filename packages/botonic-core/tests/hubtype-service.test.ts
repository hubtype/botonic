import { HubtypeService } from '../src/hubtype-service'
import {
  HubtypeEvent,
  HubtypeEventHandler,
  INPUT,
  Input,
  PROVIDER,
  SessionUser,
} from '../src/models'

function createSessionUser(): SessionUser {
  return {
    id: 'user-1',
    provider: PROVIDER.WEBCHAT,
    locale: 'en',
    country: 'US',
    system_locale: 'en-US',
  } as SessionUser
}

function createInput(override: Partial<Input> & { id?: string } = {}): Input {
  return {
    id: 'message-1',
    type: INPUT.TEXT,
    message_id: 'message-1',
    bot_interaction_id: 'interaction-1',
    ...override,
  } as Input
}

describe('HubtypeService', () => {
  const baseArgs = {
    appId: 'app-123',
    user: createSessionUser(),
    onEvent: jest.fn<ReturnType<HubtypeEventHandler>, [HubtypeEvent]>(),
    unsentInputs: () => [],
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('constructs botonic headers with available metadata', () => {
    const service = new HubtypeService({
      ...baseArgs,
      lastMessageId: 'last-message-id',
      lastMessageUpdateDate: '2023-04-24T10:00:00Z',
    })

    const headers = service.constructHeaders()

    expect(headers).toEqual({
      'X-BOTONIC-USER-ID': baseArgs.user.id,
      'X-BOTONIC-LAST-MESSAGE-ID': 'last-message-id',
      'X-BOTONIC-LAST-MESSAGE-UPDATE-DATE': '2023-04-24T10:00:00Z',
    })
  })

  it('emits connection change events', () => {
    const onEvent = jest.fn<ReturnType<HubtypeEventHandler>, [HubtypeEvent]>()
    const service = new HubtypeService({ ...baseArgs, onEvent })

    service.handleConnectionChange(true)

    expect(onEvent).toHaveBeenCalledWith({ action: 'connectionChange', online: true })
  })

  it('emits message status updates when messages are sent', () => {
    const onEvent = jest.fn<ReturnType<HubtypeEventHandler>, [HubtypeEvent]>()
    const service = new HubtypeService({ ...baseArgs, onEvent })
    const input = createInput()

    service.handleSentInput(createInput())

    expect(onEvent).toHaveBeenCalledWith({
      action: 'update_message_info',
      message: { id: 'message-1', ack: 1 },
    })

    onEvent.mockClear()

    service.handleUnsentInput(input)

    expect(onEvent).toHaveBeenCalledWith({
      action: 'update_message_info',
      message: { id: 'message-1', ack: 0, unsentInput: input },
    })
  })
})
