import type { FlowBuilderApi } from '../../src/api'

export interface MockFlowBuilderApi {
  isPushFlowPayload: jest.Mock
  getResolvedLocale: jest.Mock
  getWhatsappRequestContactInfoNode: jest.Mock
  getPayload: jest.Mock
  removeWhatsappRequestContactId: jest.Mock
  getNodeById: jest.Mock
  isBotAction: jest.Mock
  createPayloadWithParams: jest.Mock
  removeCaptureUserInputId: jest.Mock
}

export function createMockFlowBuilderApi(
  overrides: Partial<MockFlowBuilderApi> = {}
): MockFlowBuilderApi {
  return {
    isPushFlowPayload: jest.fn().mockReturnValue(false),
    getResolvedLocale: jest.fn().mockReturnValue('en'),
    getWhatsappRequestContactInfoNode: jest.fn().mockReturnValue(undefined),
    getPayload: jest.fn(),
    removeWhatsappRequestContactId: jest.fn(),
    getNodeById: jest.fn(),
    isBotAction: jest.fn().mockReturnValue(false),
    createPayloadWithParams: jest.fn(),
    removeCaptureUserInputId: jest.fn(),
    ...overrides,
  }
}

export function asFlowBuilderApi(mock: MockFlowBuilderApi): FlowBuilderApi {
  return mock as unknown as FlowBuilderApi
}
