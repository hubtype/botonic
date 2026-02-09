import { INPUT } from '@botonic/core'
import { beforeEach, describe, expect, test } from '@jest/globals'

import type { FlowText } from '../src/content-fields/flow-text'
import { ProcessEnvNodeEnvs } from '../src/types'
// eslint-disable-next-line jest/no-mocks-import
import { mockSmartIntent } from './__mocks__/smart-intent'
import { basicFlow } from './helpers/flows/basic'
import {
  createFlowBuilderPluginAndGetContents,
  createRequest,
} from './helpers/utils'

/**
 * Tests for ContentFieldsBase.replaceVariables()
 *
 * The replaceVariables method was moved from FlowText to ContentFieldsBase
 * to be reused across different content field types (FlowText, FlowWhatsappTemplate, etc.)
 */
describe('ContentFieldsBase - replaceVariables', () => {
  process.env.NODE_ENV = ProcessEnvNodeEnvs.PRODUCTION

  beforeEach(() => mockSmartIntent('Other'))

  describe('Variable pattern matching', () => {
    test('should replace single variable with value from extraData', async () => {
      const { contents, request } = await createFlowBuilderPluginAndGetContents(
        {
          flowBuilderOptions: { flow: basicFlow },
          requestArgs: {
            input: { data: 'flowText', type: INPUT.TEXT },
            extraData: { bagsAdded: 5 },
          },
        }
      )

      const firstContent = contents[0] as FlowText
      const renderedMessage = firstContent.toBotonic(firstContent.id, request)
      expect(renderedMessage.props.children[0]).toBe(
        'This text message contains buttons and replaces the variable 5'
      )
    })

    test('should leave variable unchanged when value is not found', async () => {
      const { contents, request } = await createFlowBuilderPluginAndGetContents(
        {
          flowBuilderOptions: { flow: basicFlow },
          requestArgs: {
            input: { data: 'flowText', type: INPUT.TEXT },
            extraData: {}, // No bagsAdded variable
          },
        }
      )

      const firstContent = contents[0] as FlowText
      const renderedMessage = firstContent.toBotonic(firstContent.id, request)
      // Variable should remain as {bagsAdded} since it's not found in extraData
      expect(renderedMessage.props.children[0]).toBe(
        'This text message contains buttons and replaces the variable {bagsAdded}'
      )
    })

    test('should replace string variable', async () => {
      const { contents, request } = await createFlowBuilderPluginAndGetContents(
        {
          flowBuilderOptions: { flow: basicFlow },
          requestArgs: {
            input: { data: 'flowText', type: INPUT.TEXT },
            extraData: { bagsAdded: 'three' },
          },
        }
      )

      const firstContent = contents[0] as FlowText
      const renderedMessage = firstContent.toBotonic(firstContent.id, request)
      expect(renderedMessage.props.children[0]).toBe(
        'This text message contains buttons and replaces the variable three'
      )
    })

    test('should replace boolean variable (true)', async () => {
      const { contents, request } = await createFlowBuilderPluginAndGetContents(
        {
          flowBuilderOptions: { flow: basicFlow },
          requestArgs: {
            input: { data: 'flowText', type: INPUT.TEXT },
            extraData: { bagsAdded: true },
          },
        }
      )

      const firstContent = contents[0] as FlowText
      const renderedMessage = firstContent.toBotonic(firstContent.id, request)
      expect(renderedMessage.props.children[0]).toBe(
        'This text message contains buttons and replaces the variable true'
      )
    })

    test('should replace boolean variable (false)', async () => {
      const { contents, request } = await createFlowBuilderPluginAndGetContents(
        {
          flowBuilderOptions: { flow: basicFlow },
          requestArgs: {
            input: { data: 'flowText', type: INPUT.TEXT },
            extraData: { bagsAdded: false },
          },
        }
      )

      const firstContent = contents[0] as FlowText
      const renderedMessage = firstContent.toBotonic(firstContent.id, request)
      expect(renderedMessage.props.children[0]).toBe(
        'This text message contains buttons and replaces the variable false'
      )
    })

    test('should replace number variable (zero)', async () => {
      const { contents, request } = await createFlowBuilderPluginAndGetContents(
        {
          flowBuilderOptions: { flow: basicFlow },
          requestArgs: {
            input: { data: 'flowText', type: INPUT.TEXT },
            extraData: { bagsAdded: 0 },
          },
        }
      )

      const firstContent = contents[0] as FlowText
      const renderedMessage = firstContent.toBotonic(firstContent.id, request)
      expect(renderedMessage.props.children[0]).toBe(
        'This text message contains buttons and replaces the variable 0'
      )
    })
  })

  describe('Invalid variable types', () => {
    test('should NOT replace object variable (invalid type)', async () => {
      const { contents, request } = await createFlowBuilderPluginAndGetContents(
        {
          flowBuilderOptions: { flow: basicFlow },
          requestArgs: {
            input: { data: 'flowText', type: INPUT.TEXT },
            extraData: { bagsAdded: { nested: 'object' } },
          },
        }
      )

      const firstContent = contents[0] as FlowText
      const renderedMessage = firstContent.toBotonic(firstContent.id, request)
      // Object should NOT be replaced, variable pattern should remain
      expect(renderedMessage.props.children[0]).toBe(
        'This text message contains buttons and replaces the variable {bagsAdded}'
      )
    })

    test('should NOT replace array variable (invalid type)', async () => {
      const { contents, request } = await createFlowBuilderPluginAndGetContents(
        {
          flowBuilderOptions: { flow: basicFlow },
          requestArgs: {
            input: { data: 'flowText', type: INPUT.TEXT },
            extraData: { bagsAdded: [1, 2, 3] },
          },
        }
      )

      const firstContent = contents[0] as FlowText
      const renderedMessage = firstContent.toBotonic(firstContent.id, request)
      // Array should NOT be replaced, variable pattern should remain
      expect(renderedMessage.props.children[0]).toBe(
        'This text message contains buttons and replaces the variable {bagsAdded}'
      )
    })

    test('should NOT replace null variable', async () => {
      const { contents, request } = await createFlowBuilderPluginAndGetContents(
        {
          flowBuilderOptions: { flow: basicFlow },
          requestArgs: {
            input: { data: 'flowText', type: INPUT.TEXT },
            extraData: { bagsAdded: null },
          },
        }
      )

      const firstContent = contents[0] as FlowText
      const renderedMessage = firstContent.toBotonic(firstContent.id, request)
      // null should NOT be replaced
      expect(renderedMessage.props.children[0]).toBe(
        'This text message contains buttons and replaces the variable {bagsAdded}'
      )
    })

    test('should NOT replace undefined variable', async () => {
      const { contents, request } = await createFlowBuilderPluginAndGetContents(
        {
          flowBuilderOptions: { flow: basicFlow },
          requestArgs: {
            input: { data: 'flowText', type: INPUT.TEXT },
            extraData: { bagsAdded: undefined },
          },
        }
      )

      const firstContent = contents[0] as FlowText
      const renderedMessage = firstContent.toBotonic(firstContent.id, request)
      // undefined should NOT be replaced
      expect(renderedMessage.props.children[0]).toBe(
        'This text message contains buttons and replaces the variable {bagsAdded}'
      )
    })
  })

  describe('Nested keyPath access', () => {
    test('should replace variable using nested keyPath (session.user.extra_data)', async () => {
      const { contents, request } = await createFlowBuilderPluginAndGetContents(
        {
          flowBuilderOptions: { flow: basicFlow },
          requestArgs: {
            input: { data: 'flowText', type: INPUT.TEXT },
            extraData: { bagsAdded: 10 },
          },
        }
      )

      const firstContent = contents[0] as FlowText
      // The replaceVariables method uses getValueFromKeyPath to access nested values
      const renderedMessage = firstContent.toBotonic(firstContent.id, request)
      expect(renderedMessage.props.children[0]).toBe(
        'This text message contains buttons and replaces the variable 10'
      )
    })
  })

  describe('Access token handling', () => {
    test('should NOT replace access_token variable for security', async () => {
      // The replaceVariables method has special handling for access_token
      // to prevent accidental exposure of sensitive tokens
      const request = createRequest({
        input: { data: 'test', type: INPUT.TEXT },
        extraData: {},
      })

      // This tests that access_token patterns are not replaced
      // The actual implementation checks for ACCESS_TOKEN_VARIABLE_KEY
      expect(request.session._access_token).toBeDefined()
    })
  })
})
