/* eslint-disable @typescript-eslint/no-explicit-any */
import { jest } from '@jest/globals'
import axios from 'axios'

import { BotonicAPIService } from '../src/botonic-api-service.js'
import type { BotDetail, Me, OAuth } from '../src/interfaces.js'
import {
  BotCredentialsHandler,
  GlobalCredentialsHandler,
} from '../src/util/credentials-handler.js'

describe('TEST: BotonicApiService', () => {
  let service: BotonicAPIService

  const mockOAuth: OAuth = {
    access_token: 'test-access-token',
    expires_in: 3600,
    token_type: 'Bearer',
    scope: 'read write',
    refresh_token: 'test-refresh-token',
  }

  const mockMe: Me = {
    id: 'user-123',
    email: 'test@example.com',
    first_name: 'John',
    last_name: 'Doe',
    organization_id: 'org-123',
    campaign: 'test-campaign',
  }

  const mockBot: BotDetail = {
    id: 'bot-123',
    name: 'test-bot',
    organization: 'org-123',
    last_update: {
      version: '1.0.0',
      created_at: '2024-01-01T00:00:00Z',
      modified_at: '2024-01-02T00:00:00Z',
      published_at: '2024-01-03T00:00:00Z',
      comment: 'Test update',
    },
    created_at: '2024-01-01T00:00:00Z',
    provider_accounts: [],
    is_debug: false,
    is_published: true,
    active_users: 10,
  }

  beforeEach(() => {
    // Mock the credential handlers
    jest
      .spyOn(GlobalCredentialsHandler.prototype, 'load')
      .mockReturnValue(undefined)
    jest
      .spyOn(BotCredentialsHandler.prototype, 'load')
      .mockReturnValue(undefined)
    jest
      .spyOn(GlobalCredentialsHandler.prototype, 'dump')
      .mockImplementation(() => {})
    jest
      .spyOn(BotCredentialsHandler.prototype, 'dump')
      .mockImplementation(() => {})
    jest
      .spyOn(GlobalCredentialsHandler.prototype, 'createDirIfNotExists')
      .mockImplementation(() => {})
    jest
      .spyOn(BotCredentialsHandler.prototype, 'createDirIfNotExists')
      .mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('Constructor', () => {
    it('should initialize with no credentials', () => {
      service = new BotonicAPIService()

      expect(service.oauth).toBeUndefined()
      expect(service.me).toBeUndefined()
      expect(service.bot).toBeNull()
      expect(service.apiClient).toBeDefined()
    })

    it('should load existing global credentials', () => {
      jest.spyOn(GlobalCredentialsHandler.prototype, 'load').mockReturnValue({
        oauth: mockOAuth,
        me: mockMe,
      })

      service = new BotonicAPIService()

      expect(service.oauth).toEqual(mockOAuth)
      expect(service.me).toEqual(mockMe)
    })

    it('should load existing bot credentials', () => {
      jest
        .spyOn(BotCredentialsHandler.prototype, 'load')
        .mockReturnValue({ bot: mockBot })

      service = new BotonicAPIService()

      expect(service.bot).toEqual(mockBot)
    })

    it('should set headers with access token', () => {
      jest.spyOn(GlobalCredentialsHandler.prototype, 'load').mockReturnValue({
        oauth: mockOAuth,
        me: mockMe,
      })

      service = new BotonicAPIService()

      expect(service.headers.get('Authorization')).toContain(
        'Bearer test-access-token'
      )
    })
  })

  describe('botInfo', () => {
    beforeEach(() => {
      jest
        .spyOn(BotCredentialsHandler.prototype, 'load')
        .mockReturnValue({ bot: mockBot })
      service = new BotonicAPIService()
    })

    it('should return bot info when bot exists', () => {
      const result = service.botInfo()
      expect(result).toEqual(mockBot)
    })

    it('should throw error when bot info is not available', () => {
      service.bot = null
      expect(() => service.botInfo()).toThrow('Not bot info available')
    })
  })

  describe('getOauth', () => {
    beforeEach(() => {
      jest.spyOn(GlobalCredentialsHandler.prototype, 'load').mockReturnValue({
        oauth: mockOAuth,
        me: mockMe,
      })
      service = new BotonicAPIService()
    })

    it('should return oauth when available', () => {
      const result = service.getOauth()
      expect(result).toEqual(mockOAuth)
    })

    it('should throw error when oauth is not available', () => {
      service.oauth = undefined
      expect(() => service.getOauth()).toThrow('Not OAuth available')
    })
  })

  describe('beforeExit', () => {
    beforeEach(() => {
      service = new BotonicAPIService()
    })

    it('should save global and bot credentials', () => {
      const globalDumpSpy = jest.spyOn(service.globalCredentialsHandler, 'dump')
      const botDumpSpy = jest.spyOn(service.botCredentialsHandler, 'dump')
      const createDirSpy = jest.spyOn(
        service.globalCredentialsHandler,
        'createDirIfNotExists'
      )

      service.oauth = mockOAuth
      service.me = mockMe
      service.bot = mockBot

      service.beforeExit()

      expect(createDirSpy).toHaveBeenCalled()
      expect(globalDumpSpy).toHaveBeenCalledWith({
        oauth: mockOAuth,
        me: mockMe,
      })
      expect(botDumpSpy).toHaveBeenCalledWith({
        bot: mockBot,
      })
    })
  })

  describe('login', () => {
    beforeEach(() => {
      service = new BotonicAPIService()
    })

    it('should login successfully and set credentials', async () => {
      const postSpy = jest.spyOn(axios, 'post').mockResolvedValueOnce({
        data: mockOAuth,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      })
      const _getSpy = jest
        .spyOn(service.apiClient, 'get')
        .mockResolvedValueOnce({
          data: mockMe,
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {} as any,
        })

      await service.login('test@example.com', 'password123')

      expect(postSpy).toHaveBeenCalledWith(
        expect.stringContaining('/o/token/'),
        expect.any(String),
        expect.objectContaining({
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        })
      )
      expect(service.oauth).toEqual(mockOAuth)
      expect(service.me).toEqual(mockMe)
      expect(service.headers.get('Authorization')).toContain(
        'Bearer test-access-token'
      )
    })
  })

  describe('signup', () => {
    beforeEach(() => {
      service = new BotonicAPIService()
    })

    it('should call signup endpoint with correct data', async () => {
      const postSpy = jest
        .spyOn(service.apiClient, 'post')
        .mockResolvedValueOnce({
          data: { success: true },
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {} as any,
        })

      await service.signup('test@example.com', 'password123', 'Test Org', {
        source: 'web',
      })

      expect(postSpy).toHaveBeenCalledWith(
        expect.stringContaining('sign-up/'),
        {
          email: 'test@example.com',
          password: 'password123',
          org_name: 'Test Org',
          campaign: { source: 'web' },
        },
        expect.any(Object)
      )
    })
  })

  describe('createBot', () => {
    beforeEach(() => {
      jest.spyOn(GlobalCredentialsHandler.prototype, 'load').mockReturnValue({
        oauth: mockOAuth,
        me: mockMe,
      })
      service = new BotonicAPIService()
    })

    it('should create a new bot and set it as current', async () => {
      const postSpy = jest
        .spyOn(service.apiClient, 'post')
        .mockResolvedValueOnce({
          data: mockBot,
          status: 201,
          statusText: 'Created',
          headers: {},
          config: {} as any,
        })

      const result = await service.createBot('new-bot')

      expect(postSpy).toHaveBeenCalledWith(
        expect.stringContaining('v2/bots/'),
        { name: 'new-bot' },
        expect.any(Object)
      )
      expect(service.bot).toEqual(mockBot)
      expect(result.data).toEqual(mockBot)
    })
  })

  describe('getBots', () => {
    beforeEach(() => {
      jest.spyOn(GlobalCredentialsHandler.prototype, 'load').mockReturnValue({
        oauth: mockOAuth,
        me: mockMe,
      })
      service = new BotonicAPIService()
    })

    it('should get bots without pagination', async () => {
      const mockResponse = {
        data: {
          count: 2,
          next: null,
          previous: null,
          results: [
            { id: 'bot-1', name: 'Bot 1' },
            { id: 'bot-2', name: 'Bot 2' },
          ],
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      }
      const getSpy = jest
        .spyOn(service.apiClient, 'get')
        .mockResolvedValueOnce(mockResponse)

      const result = await service.getBots()

      expect(result.data.results).toHaveLength(2)
      expect(getSpy).toHaveBeenCalledTimes(1)
    })

    it('should handle paginated bot results', async () => {
      const firstPageResponse = {
        data: {
          count: 150,
          next: 'https://api.hubtype.com/v2/bots/?page=2',
          previous: null,
          results: Array.from({ length: 100 }, (_, i) => ({
            id: `bot-${i}`,
            name: `Bot ${i}`,
          })),
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      }
      const secondPageResponse = {
        data: {
          count: 150,
          next: null,
          previous: 'https://api.hubtype.com/v2/bots/?page=1',
          results: Array.from({ length: 50 }, (_, i) => ({
            id: `bot-${i + 100}`,
            name: `Bot ${i + 100}`,
          })),
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      }

      const getSpy = jest
        .spyOn(service.apiClient, 'get')
        .mockResolvedValueOnce(firstPageResponse)
        .mockResolvedValueOnce(secondPageResponse)

      const result = await service.getBots()

      expect(result.data.results).toHaveLength(150)
      expect(getSpy).toHaveBeenCalledTimes(2)
    })
  })

  describe('setCurrentBot', () => {
    beforeEach(() => {
      service = new BotonicAPIService()
    })

    it('should set current bot', () => {
      service.setCurrentBot(mockBot)
      expect(service.bot).toEqual(mockBot)
    })
  })

  describe('logout', () => {
    beforeEach(() => {
      jest.spyOn(GlobalCredentialsHandler.prototype, 'load').mockReturnValue({
        oauth: mockOAuth,
        me: mockMe,
      })
      service = new BotonicAPIService()
    })

    it('should call logout and attempt to delete credentials', () => {
      // Just verify the logout method runs without errors
      // File system operations are mocked at the module level
      expect(() => service.logout()).not.toThrow()
    })
  })

  describe('getProviders', () => {
    beforeEach(() => {
      jest.spyOn(GlobalCredentialsHandler.prototype, 'load').mockReturnValue({
        oauth: mockOAuth,
        me: mockMe,
      })
      jest
        .spyOn(BotCredentialsHandler.prototype, 'load')
        .mockReturnValue({ bot: mockBot })
      service = new BotonicAPIService()
    })

    it('should get providers for current bot', async () => {
      const mockProviders = [
        { id: 'provider-1', name: 'Provider 1' },
        { id: 'provider-2', name: 'Provider 2' },
      ]
      const getSpy = jest
        .spyOn(service.apiClient, 'get')
        .mockResolvedValueOnce({
          data: mockProviders,
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {} as any,
        })

      await service.getProviders()

      expect(getSpy).toHaveBeenCalledWith(
        expect.stringContaining('provider_accounts/'),
        expect.objectContaining({
          params: { bot_id: 'bot-123' },
        })
      )
    })
  })

  describe('deployStatus', () => {
    beforeEach(() => {
      jest.spyOn(GlobalCredentialsHandler.prototype, 'load').mockReturnValue({
        oauth: mockOAuth,
        me: mockMe,
      })
      jest
        .spyOn(BotCredentialsHandler.prototype, 'load')
        .mockReturnValue({ bot: mockBot })
      service = new BotonicAPIService()
    })

    it('should get deploy status', async () => {
      const mockDeployStatus = { status: 'completed', deploy_id: 'deploy-123' }
      const getSpy = jest
        .spyOn(service.apiClient, 'get')
        .mockResolvedValueOnce({
          data: mockDeployStatus,
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {} as any,
        })

      await service.deployStatus('deploy-123')

      expect(getSpy).toHaveBeenCalledWith(
        expect.stringContaining(`v2/bots/${mockBot.id}/deploy_status/`),
        expect.objectContaining({
          params: { deploy_id: 'deploy-123' },
        })
      )
    })
  })

  describe('refreshToken', () => {
    beforeEach(() => {
      jest.spyOn(GlobalCredentialsHandler.prototype, 'load').mockReturnValue({
        oauth: mockOAuth,
        me: mockMe,
      })
      service = new BotonicAPIService()
    })

    it('should refresh token successfully', async () => {
      const newOAuth = { ...mockOAuth, access_token: 'new-access-token' }
      const postSpy = jest.spyOn(axios, 'post').mockResolvedValueOnce({
        status: 200,
        data: newOAuth,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      })
      const dumpSpy = jest.spyOn(service.globalCredentialsHandler, 'dump')

      // Access private method through any
      await (service as any).refreshToken()

      expect(postSpy).toHaveBeenCalledWith(
        expect.stringContaining('/o/token/'),
        expect.any(String),
        expect.objectContaining({
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        })
      )
      expect(service.oauth).toEqual(newOAuth)
      expect(service.headers.get('Authorization')).toContain(
        'Bearer new-access-token'
      )
      expect(dumpSpy).toHaveBeenCalled()
    })

    it('should throw error when refresh fails', async () => {
      jest.spyOn(axios, 'post').mockResolvedValueOnce({
        status: 401,
        data: {},
        statusText: 'Unauthorized',
        headers: {},
        config: {} as any,
      })

      await expect((service as any).refreshToken()).rejects.toThrow(
        'Error refreshing token'
      )
    })
  })
})
