import { INPUT } from '@botonic/core'
import { describe, expect, test } from '@jest/globals'

import { getValueFromKeyPath } from '../src/utils'
import { createRequest, getActionRequest } from './helpers/utils'

describe('getValueFromKeyPath', () => {
  describe('when keyPath starts with "input."', () => {
    test('should return the input data when keyPath is "input.data"', () => {
      const request = createRequest({
        input: { data: 'test-value', type: INPUT.TEXT },
      })
      const actionRequest = getActionRequest(request)

      const result = getValueFromKeyPath(actionRequest, 'input.data')

      expect(result).toBe('test-value')
    })

    test('should return the input type when keyPath is "input.type"', () => {
      const request = createRequest({
        input: { data: 'test-value', type: INPUT.TEXT },
      })
      const actionRequest = getActionRequest(request)

      const result = getValueFromKeyPath(actionRequest, 'input.type')

      expect(result).toBe(INPUT.TEXT)
    })

    test('should return undefined when keyPath references non-existent input property', () => {
      const request = createRequest({
        input: { data: 'test-value', type: INPUT.TEXT },
      })
      const actionRequest = getActionRequest(request)

      const result = getValueFromKeyPath(actionRequest, 'input.nonExistent')

      expect(result).toBeUndefined()
    })

    test('should handle nested input paths', () => {
      const request = createRequest({
        input: { data: 'test-value', type: INPUT.TEXT },
      })
      const actionRequest = getActionRequest(request)

      const result = getValueFromKeyPath(
        actionRequest,
        'input.bot_interaction_id'
      )

      expect(result).toBe('testInteractionId')
    })
  })

  describe('when keyPath starts with "session."', () => {
    test('should return the session organization when keyPath is "session.organization"', () => {
      const request = createRequest({
        input: { data: 'test-value', type: INPUT.TEXT },
      })
      const actionRequest = getActionRequest(request)

      const result = getValueFromKeyPath(actionRequest, 'session.organization')

      expect(result).toBe('orgTest')
    })

    test('should return nested session values', () => {
      const request = createRequest({
        input: { data: 'test-value', type: INPUT.TEXT },
      })
      const actionRequest = getActionRequest(request)

      const result = getValueFromKeyPath(actionRequest, 'session.user.id')

      expect(result).toBe('uid1')
    })

    test('should return deeply nested session values', () => {
      const request = createRequest({
        input: { data: 'test-value', type: INPUT.TEXT },
      })
      const actionRequest = getActionRequest(request)

      const result = getValueFromKeyPath(actionRequest, 'session.bot.id')

      expect(result).toBe('bid1')
    })

    test('should return undefined when keyPath references non-existent session property', () => {
      const request = createRequest({
        input: { data: 'test-value', type: INPUT.TEXT },
      })
      const actionRequest = getActionRequest(request)

      const result = getValueFromKeyPath(
        actionRequest,
        'session.nonExistent.property'
      )

      expect(result).toBeUndefined()
    })

    test('should handle accessing user locale through session path', () => {
      const request = createRequest({
        input: { data: 'test-value', type: INPUT.TEXT },
        user: { locale: 'es', country: 'ES', systemLocale: 'es' },
      })
      const actionRequest = getActionRequest(request)

      const result = getValueFromKeyPath(actionRequest, 'session.user.locale')

      expect(result).toBe('es')
    })
  })

  describe('when keyPath starts with neither "input." nor "session."', () => {
    test('should return value from extra_data when keyPath is a simple property', () => {
      const request = createRequest({
        input: { data: 'test-value', type: INPUT.TEXT },
        extraData: { userName: 'John Doe' },
      })
      const actionRequest = getActionRequest(request)

      const result = getValueFromKeyPath(actionRequest, 'userName')

      expect(result).toBe('John Doe')
    })

    test('should return nested values from extra_data', () => {
      const request = createRequest({
        input: { data: 'test-value', type: INPUT.TEXT },
        extraData: {
          user: {
            profile: {
              name: 'Jane Smith',
              age: 30,
            },
          },
        },
      })
      const actionRequest = getActionRequest(request)

      const result = getValueFromKeyPath(actionRequest, 'user.profile.name')

      expect(result).toBe('Jane Smith')
    })

    test('should return number values from extra_data', () => {
      const request = createRequest({
        input: { data: 'test-value', type: INPUT.TEXT },
        extraData: { count: 42 },
      })
      const actionRequest = getActionRequest(request)

      const result = getValueFromKeyPath(actionRequest, 'count')

      expect(result).toBe(42)
    })

    test('should return boolean values from extra_data', () => {
      const request = createRequest({
        input: { data: 'test-value', type: INPUT.TEXT },
        extraData: { isActive: true },
      })
      const actionRequest = getActionRequest(request)

      const result = getValueFromKeyPath(actionRequest, 'isActive')

      expect(result).toBe(true)
    })

    test('should return undefined when keyPath references non-existent property in extra_data', () => {
      const request = createRequest({
        input: { data: 'test-value', type: INPUT.TEXT },
        extraData: { userName: 'John Doe' },
      })
      const actionRequest = getActionRequest(request)

      const result = getValueFromKeyPath(actionRequest, 'nonExistent')

      expect(result).toBeUndefined()
    })

    test('should return undefined when accessing nested property of undefined', () => {
      const request = createRequest({
        input: { data: 'test-value', type: INPUT.TEXT },
        extraData: {},
      })
      const actionRequest = getActionRequest(request)

      const result = getValueFromKeyPath(
        actionRequest,
        'nonExistent.nested.property'
      )

      expect(result).toBeUndefined()
    })

    test('should handle array values in extra_data', () => {
      const request = createRequest({
        input: { data: 'test-value', type: INPUT.TEXT },
        extraData: { items: ['item1', 'item2', 'item3'] },
      })
      const actionRequest = getActionRequest(request)

      const result = getValueFromKeyPath(actionRequest, 'items')

      expect(result).toEqual(['item1', 'item2', 'item3'])
    })

    test('should handle object values in extra_data', () => {
      const request = createRequest({
        input: { data: 'test-value', type: INPUT.TEXT },
        extraData: { settings: { theme: 'dark', language: 'en' } },
      })
      const actionRequest = getActionRequest(request)

      const result = getValueFromKeyPath(actionRequest, 'settings')

      expect(result).toEqual({ theme: 'dark', language: 'en' })
    })

    test('should return null values from extra_data', () => {
      const request = createRequest({
        input: { data: 'test-value', type: INPUT.TEXT },
        extraData: { nullValue: null },
      })
      const actionRequest = getActionRequest(request)

      const result = getValueFromKeyPath(actionRequest, 'nullValue')

      expect(result).toBeNull()
    })

    test('should handle empty string values from extra_data', () => {
      const request = createRequest({
        input: { data: 'test-value', type: INPUT.TEXT },
        extraData: { emptyString: '' },
      })
      const actionRequest = getActionRequest(request)

      const result = getValueFromKeyPath(actionRequest, 'emptyString')

      expect(result).toBe('')
    })

    test('should handle zero value from extra_data', () => {
      const request = createRequest({
        input: { data: 'test-value', type: INPUT.TEXT },
        extraData: { zeroValue: 0 },
      })
      const actionRequest = getActionRequest(request)

      const result = getValueFromKeyPath(actionRequest, 'zeroValue')

      expect(result).toBe(0)
    })

    test('should handle false value from extra_data', () => {
      const request = createRequest({
        input: { data: 'test-value', type: INPUT.TEXT },
        extraData: { falseValue: false },
      })
      const actionRequest = getActionRequest(request)

      const result = getValueFromKeyPath(actionRequest, 'falseValue')

      expect(result).toBe(false)
    })
  })

  describe('edge cases', () => {
    test('should treat "input" without dot as extra_data lookup', () => {
      const request = createRequest({
        input: { data: 'test-value', type: INPUT.TEXT },
        extraData: { inputValue: 'value-from-extra-data' },
      })
      const actionRequest = getActionRequest(request)

      const result = getValueFromKeyPath(actionRequest, 'inputValue')

      expect(result).toBe('value-from-extra-data')
    })

    test('should treat "session" without dot as extra_data lookup', () => {
      const request = createRequest({
        input: { data: 'test-value', type: INPUT.TEXT },
        extraData: { sessionValue: 'value-from-extra-data' },
      })
      const actionRequest = getActionRequest(request)

      const result = getValueFromKeyPath(actionRequest, 'sessionValue')

      expect(result).toBe('value-from-extra-data')
    })

    test('should return undefined for "input" without dot when not in extra_data', () => {
      const request = createRequest({
        input: { data: 'test-value', type: INPUT.TEXT },
        extraData: {},
      })
      const actionRequest = getActionRequest(request)

      const result = getValueFromKeyPath(actionRequest, 'input')

      expect(result).toBeUndefined()
    })

    test('should return undefined for "session" without dot when not in extra_data', () => {
      const request = createRequest({
        input: { data: 'test-value', type: INPUT.TEXT },
        extraData: {},
      })
      const actionRequest = getActionRequest(request)

      const result = getValueFromKeyPath(actionRequest, 'session')

      expect(result).toBeUndefined()
    })

    test('should handle deeply nested paths across multiple levels', () => {
      const request = createRequest({
        input: { data: 'test-value', type: INPUT.TEXT },
        extraData: {
          level1: {
            level2: {
              level3: {
                level4: {
                  value: 'deep-value',
                },
              },
            },
          },
        },
      })
      const actionRequest = getActionRequest(request)

      const result = getValueFromKeyPath(
        actionRequest,
        'level1.level2.level3.level4.value'
      )

      expect(result).toBe('deep-value')
    })
  })

  describe('contact_info variable', () => {
    test('should return the contact_info.value when keyPath contains contact_info.name', () => {
      const request = createRequest({
        input: { data: 'test-value', type: INPUT.TEXT },
        contactInfo: [
          {
            name: 'Customer Full Name',
            description: '',
            type: 'string',
            value: 'John Doe',
          },
        ],
      })
      const actionRequest = getActionRequest(request)

      const result = getValueFromKeyPath(
        actionRequest,
        'session.user.contact_info.Customer Full Name'
      )

      expect(result).toBe('John Doe')
    })
  })
})
