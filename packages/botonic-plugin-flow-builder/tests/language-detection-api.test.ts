import { INPUT } from '@botonic/core'
import { afterEach, describe, expect, jest, test } from '@jest/globals'
import axios from 'axios'

import { LanguageDetectionApi } from '../src/user-input/language-detection-api'
import { basicFlow } from './helpers/flows/basic'
import {
  createFlowBuilderPlugin,
  createFlowBuilderPluginAndGetContents,
  createRequest,
} from './helpers/utils'

describe('LanguageDetectionApi', () => {
  process.env.NODE_ENV = 'production'
  process.env.HUBTYPE_API_URL = 'https://api.example.com'

  afterEach(() => {
    jest.restoreAllMocks()
    process.env.HUBTYPE_API_URL = 'https://api.example.com'
  })

  test('returns the detection data on success', async () => {
    const postSpy = jest.spyOn(axios, 'post').mockResolvedValue({
      data: {
        detected_language: 'es',
        confidence: 0.98,
      },
    } as never)
    const flowBuilderPlugin = createFlowBuilderPlugin({ flow: basicFlow })
    const request = createRequest({
      input: { data: 'Hola', type: INPUT.TEXT },
      plugins: { flowBuilderPlugin },
    })

    const api = new LanguageDetectionApi(request)
    const detectedLanguage = await api.detectLanguage('Hola')

    expect(detectedLanguage).toEqual({
      detected_language: 'es',
      confidence: 0.98,
    })
    expect(postSpy).toHaveBeenCalledWith(
      'https://api.example.com/external/v1/language_detection/',
      { text: 'Hola' },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer fake_access_token',
        },
      }
    )
  })

  test('returns null and logs a warning when the API fails', async () => {
    jest.spyOn(axios, 'post').mockRejectedValue(new Error('boom'))
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})
    const flowBuilderPlugin = createFlowBuilderPlugin({ flow: basicFlow })
    const request = createRequest({
      input: { data: 'Hola', type: INPUT.TEXT },
      plugins: { flowBuilderPlugin },
    })

    const api = new LanguageDetectionApi(request)
    const detectedLanguage = await api.detectLanguage('Hola')

    expect(detectedLanguage).toBeNull()
    expect(warnSpy).toHaveBeenCalledWith(
      'Error detecting user language',
      expect.any(Error)
    )
  })

  test('returns null and logs a warning when HUBTYPE_API_URL is missing', async () => {
    delete process.env.HUBTYPE_API_URL
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})
    const flowBuilderPlugin = createFlowBuilderPlugin({ flow: basicFlow })
    const request = createRequest({
      input: { data: 'Hola', type: INPUT.TEXT },
      plugins: { flowBuilderPlugin },
    })

    const api = new LanguageDetectionApi(request)
    const detectedLanguage = await api.detectLanguage('Hola')

    expect(detectedLanguage).toBeNull()
    expect(warnSpy).toHaveBeenCalledWith(
      'Error detecting user language',
      expect.any(Error)
    )
  })

  test('stores the locale only when confidence is greater than 0.7', async () => {
    jest
      .spyOn(LanguageDetectionApi.prototype, 'detectLanguage')
      .mockResolvedValue({
        detected_language: 'es',
        confidence: 0.71,
      })

    const { request } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: { flow: basicFlow },
      requestArgs: {
        input: { data: 'Hola', type: INPUT.TEXT },
        user: { languageDetected: false },
      },
    })

    expect(request.session.user.locale).toBe('es')
    expect(request.session.user.language_detected).toBe(true)
  })

  test('does not store the locale when confidence is 0.7 or lower', async () => {
    const flowBuilderPlugin = createFlowBuilderPlugin({ flow: basicFlow })
    const request = createRequest({
      input: { data: 'Hola', type: INPUT.TEXT },
      user: { languageDetected: false },
      plugins: { flowBuilderPlugin },
    })
    const api = new LanguageDetectionApi(request)
    jest.spyOn(api, 'detectLanguage').mockResolvedValue({
      detected_language: 'es',
      confidence: 0.6,
    })

    await api.detectAndStoreLanguage('Hola')

    expect(request.session.user.locale).toBe('en')
    expect(request.session.user.language_detected).toBe(false)
  })
})
