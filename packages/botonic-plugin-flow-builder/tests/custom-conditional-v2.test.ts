import { INPUT } from '@botonic/core'
import { describe, expect, test } from '@jest/globals'

import { FlowCustomConditionalV2 } from '../src/content-fields/flow-custom-condition-v2'
import {
  BooleanConditionOperator,
  type HtCustomConditionalV2Node,
  NumberConditionOperator,
  StringConditionOperator,
  VariableFormat,
} from '../src/content-fields/hubtype-fields/custom-conditional-v2'
import { HtNodeWithContentType } from '../src/content-fields/hubtype-fields/node-types'
import { ProcessEnvNodeEnvs } from '../src/types'
import { createRequest } from './helpers/utils'

function createMockCustomConditionalV2Node(
  content: HtCustomConditionalV2Node['content']
): HtCustomConditionalV2Node {
  return {
    id: 'custom-condition-node-id',
    code: 'CUSTOM_CONDITION_V2',
    meta: { x: 0, y: 0 },
    flow_id: 'test-flow-id',
    is_meaningful: false,
    type: HtNodeWithContentType.CUSTOM_CONDITION,
    content,
  }
}

function createBotContext(extraData: Record<string, unknown> = {}) {
  return createRequest({
    input: { data: 'test', type: INPUT.TEXT },
    extraData,
  })
}

describe('FlowCustomConditionalV2', () => {
  process.env.NODE_ENV = ProcessEnvNodeEnvs.PRODUCTION

  const defaultTarget = {
    id: 'default-target-id',
    type: HtNodeWithContentType.TEXT,
  }

  describe('string conditions', () => {
    const touristTarget = {
      id: 'tourist-target-id',
      type: HtNodeWithContentType.TEXT,
    }

    const businessTarget = {
      id: 'business-target-id',
      type: HtNodeWithContentType.TEXT,
    }

    test.each([
      {
        operator: StringConditionOperator.EqualsTo,
        value: 'tourist',
        bookingType: 'tourist',
        expectedResult: 'tourist',
        expectedTarget: touristTarget,
      },
      {
        operator: StringConditionOperator.NotEqualsTo,
        value: 'tourist',
        bookingType: 'business',
        expectedResult: 'tourist',
        expectedTarget: touristTarget,
      },
      {
        operator: StringConditionOperator.Contains,
        value: 'class',
        bookingType: 'first class',
        expectedResult: 'class',
        expectedTarget: businessTarget,
      },
      {
        operator: StringConditionOperator.NotContains,
        value: 'class',
        bookingType: 'business',
        expectedResult: 'class',
        expectedTarget: touristTarget,
      },
      {
        operator: StringConditionOperator.StartsWith,
        value: 'first',
        bookingType: 'first class',
        expectedResult: 'first',
        expectedTarget: touristTarget,
      },
      {
        operator: StringConditionOperator.NotStartsWith,
        value: 'first',
        bookingType: 'business',
        expectedResult: 'first',
        expectedTarget: touristTarget,
      },
      {
        operator: StringConditionOperator.EndsWith,
        value: 'class',
        bookingType: 'first class',
        expectedResult: 'class',
        expectedTarget: businessTarget,
      },
      {
        operator: StringConditionOperator.NotEndsWith,
        value: 'class',
        bookingType: 'business',
        expectedResult: 'class',
        expectedTarget: touristTarget,
      },
    ])('should resolve $operator when bookingType is $bookingType', ({
      operator,
      value,
      bookingType,
      expectedResult,
      expectedTarget,
    }) => {
      const node = createMockCustomConditionalV2Node({
        type: VariableFormat.String,
        key_path: 'bookingType',
        conditions: [{ operator, value, target: expectedTarget }],
        default_target: defaultTarget,
      })

      const customConditional = FlowCustomConditionalV2.fromHubtypeCMS(
        node,
        createBotContext({ bookingType })
      )

      expect(customConditional.customResult).toBe(expectedResult)
      expect(customConditional.followUp).toEqual(expectedTarget)
    })

    test('should use default target when no string condition matches', () => {
      const node = createMockCustomConditionalV2Node({
        type: VariableFormat.String,
        key_path: 'bookingType',
        conditions: [
          {
            operator: StringConditionOperator.EqualsTo,
            value: 'tourist',
            target: touristTarget,
          },
        ],
        default_target: defaultTarget,
      })

      const customConditional = FlowCustomConditionalV2.fromHubtypeCMS(
        node,
        createBotContext({ bookingType: 'premium' })
      )

      expect(customConditional.customResult).toBe('default')
      expect(customConditional.followUp).toEqual(defaultTarget)
    })
  })

  describe('number conditions', () => {
    const oneBagTarget = {
      id: 'one-bag-target-id',
      type: HtNodeWithContentType.TEXT,
    }

    const twoBagsTarget = {
      id: 'two-bags-target-id',
      type: HtNodeWithContentType.TEXT,
    }

    const betweenTarget = {
      id: 'between-target-id',
      type: HtNodeWithContentType.TEXT,
    }

    test.each([
      {
        operator: NumberConditionOperator.EqualsTo,
        value: 1,
        bagsAdded: 1,
        expectedResult: '1',
        expectedTarget: oneBagTarget,
      },
      {
        operator: NumberConditionOperator.NotEqualsTo,
        value: 0,
        bagsAdded: 2,
        expectedResult: '0',
        expectedTarget: twoBagsTarget,
      },
      {
        operator: NumberConditionOperator.GreaterThan,
        value: 1,
        bagsAdded: 2,
        expectedResult: '1',
        expectedTarget: twoBagsTarget,
      },
      {
        operator: NumberConditionOperator.LessThan,
        value: 2,
        bagsAdded: 1,
        expectedResult: '2',
        expectedTarget: oneBagTarget,
      },
      {
        operator: NumberConditionOperator.GreaterThanOrEqualTo,
        value: 2,
        bagsAdded: 2,
        expectedResult: '2',
        expectedTarget: twoBagsTarget,
      },
      {
        operator: NumberConditionOperator.LessThanOrEqualTo,
        value: 1,
        bagsAdded: 1,
        expectedResult: '1',
        expectedTarget: oneBagTarget,
      },
    ])('should resolve $operator when bagsAdded is $bagsAdded', ({
      operator,
      value,
      bagsAdded,
      expectedResult,
      expectedTarget,
    }) => {
      const node = createMockCustomConditionalV2Node({
        type: VariableFormat.Number,
        key_path: 'bagsAdded',
        conditions: [{ operator, value, target: expectedTarget }],
        default_target: defaultTarget,
      })

      const customConditional = FlowCustomConditionalV2.fromHubtypeCMS(
        node,
        createBotContext({ bagsAdded })
      )

      expect(customConditional.customResult).toBe(expectedResult)
      expect(customConditional.followUp).toEqual(expectedTarget)
    })

    test.each([
      {
        operator: NumberConditionOperator.Between,
        bagsAdded: 2,
        min: 1,
        max: 3,
      },
      {
        operator: NumberConditionOperator.NotBetween,
        bagsAdded: 5,
        min: 1,
        max: 3,
      },
    ])('should resolve $operator when bagsAdded is $bagsAdded', ({
      operator,
      bagsAdded,
      min,
      max,
    }) => {
      const node = createMockCustomConditionalV2Node({
        type: VariableFormat.Number,
        key_path: 'bagsAdded',
        conditions: [
          {
            operator,
            value: 0,
            min,
            max,
            target: betweenTarget,
          },
        ],
        default_target: defaultTarget,
      })

      const customConditional = FlowCustomConditionalV2.fromHubtypeCMS(
        node,
        createBotContext({ bagsAdded })
      )

      expect(customConditional.customResult).toBe('0')
      expect(customConditional.followUp).toEqual(betweenTarget)
    })

    test('should use default target when no number condition matches', () => {
      const node = createMockCustomConditionalV2Node({
        type: VariableFormat.Number,
        key_path: 'bagsAdded',
        conditions: [
          {
            operator: NumberConditionOperator.EqualsTo,
            value: 1,
            target: oneBagTarget,
          },
        ],
        default_target: defaultTarget,
      })

      const customConditional = FlowCustomConditionalV2.fromHubtypeCMS(
        node,
        createBotContext({ bagsAdded: 4 })
      )

      expect(customConditional.customResult).toBe('default')
      expect(customConditional.followUp).toEqual(defaultTarget)
    })
  })

  describe('boolean conditions', () => {
    const loggedInTarget = {
      id: 'logged-in-target-id',
      type: HtNodeWithContentType.TEXT,
    }

    test('should resolve isTruthy when variable is true', () => {
      const node = createMockCustomConditionalV2Node({
        type: VariableFormat.Boolean,
        key_path: 'isLogged',
        conditions: [
          {
            operator: BooleanConditionOperator.IsTruthy,
            target: loggedInTarget,
          },
        ],
        default_target: defaultTarget,
      })

      const customConditional = FlowCustomConditionalV2.fromHubtypeCMS(
        node,
        createBotContext({ isLogged: true })
      )

      expect(customConditional.customResult).toBe('true')
      expect(customConditional.followUp).toEqual(loggedInTarget)
    })

    test('should use default target when isTruthy does not match', () => {
      const node = createMockCustomConditionalV2Node({
        type: VariableFormat.Boolean,
        key_path: 'isLogged',
        conditions: [
          {
            operator: BooleanConditionOperator.IsTruthy,
            target: loggedInTarget,
          },
        ],
        default_target: defaultTarget,
      })

      const customConditional = FlowCustomConditionalV2.fromHubtypeCMS(
        node,
        createBotContext({ isLogged: false })
      )

      expect(customConditional.customResult).toBe('false')
      expect(customConditional.followUp).toEqual(defaultTarget)
    })
  })
})
