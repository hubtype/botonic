import type { Mock } from 'vitest'
import { vi } from 'vitest'
import type { FlowBuilderApi } from '../../src/api'

export interface MockFlowBuilderApi {
  isPushFlowPayload: Mock
  getResolvedLocale: Mock
  getWhatsappRequestContactInfoNode: Mock
  getPayload: Mock
  removeWhatsappRequestContactId: Mock
  getNodeById: Mock
  isBotAction: Mock
  createPayloadWithParams: Mock
  removeCaptureUserInputId: Mock
}

export function createMockFlowBuilderApi(
  overrides: Partial<MockFlowBuilderApi> = {}
): MockFlowBuilderApi {
  return {
    isPushFlowPayload: vi.fn().mockReturnValue(false),
    getResolvedLocale: vi.fn().mockReturnValue('en'),
    getWhatsappRequestContactInfoNode: vi.fn().mockReturnValue(undefined),
    getPayload: vi.fn(),
    removeWhatsappRequestContactId: vi.fn(),
    getNodeById: vi.fn(),
    isBotAction: vi.fn().mockReturnValue(false),
    createPayloadWithParams: vi.fn(),
    removeCaptureUserInputId: vi.fn(),
    ...overrides,
  }
}

export function asFlowBuilderApi(mock: MockFlowBuilderApi): FlowBuilderApi {
  return mock as unknown as FlowBuilderApi
}
