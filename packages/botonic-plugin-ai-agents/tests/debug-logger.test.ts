import { createDebugLogger, DebugLogger } from '../src/debug-logger'

describe('DebugLogger', () => {
  let consoleSpy: jest.SpyInstance

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation()
  })

  afterEach(() => {
    consoleSpy.mockRestore()
  })

  describe('createDebugLogger', () => {
    it('should return EnabledDebugLogger when enableDebug is true', () => {
      const logger = createDebugLogger(true)

      logger.logRunnerStart()

      expect(consoleSpy).toHaveBeenCalledWith(
        '[BotonicPluginAiAgents] === Runner Execution Start ==='
      )
    })

    it('should return DisabledDebugLogger when enableDebug is false', () => {
      const logger = createDebugLogger(false)

      logger.logRunnerStart()

      expect(consoleSpy).not.toHaveBeenCalled()
    })
  })

  describe('EnabledDebugLogger', () => {
    let logger: DebugLogger

    beforeEach(() => {
      logger = createDebugLogger(true)
    })

    it('should log initial config', () => {
      logger.logInitialConfig({
        messageHistoryApiVersion: 'v2',
        maxRetries: 3,
        timeout: 20000,
        customToolNames: ['tool1', 'tool2'],
        memory: {
          maxMessages: 30,
          includeToolCalls: true,
          maxFullToolResults: 2,
        },
      })

      expect(consoleSpy).toHaveBeenCalledWith(
        '[BotonicPluginAiAgents] === Plugin Initialization ==='
      )
      expect(consoleSpy).toHaveBeenCalledWith(
        '[BotonicPluginAiAgents] Message History API Version: v2'
      )
      expect(consoleSpy).toHaveBeenCalledWith(
        '[BotonicPluginAiAgents] Max Retries: 3'
      )
      expect(consoleSpy).toHaveBeenCalledWith(
        '[BotonicPluginAiAgents] Timeout: 20000ms'
      )
      expect(consoleSpy).toHaveBeenCalledWith(
        '[BotonicPluginAiAgents] Custom Tools Registered: tool1, tool2'
      )
    })

    it('should log agent debug info', () => {
      const aiAgentArgs = {
        name: 'TestAgent',
        instructions: 'Test instructions',
        sourceIds: ['source1'],
        inputGuardrailRules: [],
      }

      logger.logAgentDebugInfo(aiAgentArgs, ['tool1'], [])

      expect(consoleSpy).toHaveBeenCalledWith(
        '[BotonicPluginAiAgents] === AI Agent Debug Info ==='
      )
      expect(consoleSpy).toHaveBeenCalledWith(
        '[BotonicPluginAiAgents] Agent Name: TestAgent'
      )
      expect(consoleSpy).toHaveBeenCalledWith(
        '[BotonicPluginAiAgents] Active Tools: ["tool1"]'
      )
      expect(consoleSpy).toHaveBeenCalledWith('Test instructions')
    })

    it('should log runner result with execution time', () => {
      const startTime = Date.now() - 1500 // 1.5 seconds ago
      const runResult = {
        messages: [{ type: 'text', content: { text: 'Hello' } }],
        toolsExecuted: [{ toolName: 'tool1', toolArguments: {} }],
        exit: false,
        memoryLength: 10,
        error: false,
        inputGuardrailsTriggered: [],
        outputGuardrailsTriggered: [],
      }

      logger.logRunResult(runResult as any, startTime)

      expect(consoleSpy).toHaveBeenCalledWith(
        '[BotonicPluginAiAgents] === Runner Execution Complete ==='
      )
      expect(consoleSpy).toHaveBeenCalledWith(
        '[BotonicPluginAiAgents] Output Messages Count: 1'
      )
      expect(consoleSpy).toHaveBeenCalledWith(
        '[BotonicPluginAiAgents] Exit: false'
      )
      expect(consoleSpy).toHaveBeenCalledWith(
        '[BotonicPluginAiAgents] Tools Executed: ["tool1"]'
      )
      // Check execution time is logged (should be around 1500ms)
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringMatching(/Execution Time: \d+ms/)
      )
    })

    it('should log guardrail triggered', () => {
      logger.logGuardrailTriggered()

      expect(consoleSpy).toHaveBeenCalledWith(
        '[BotonicPluginAiAgents] Input guardrail triggered'
      )
    })

    it('should log runner error', () => {
      const startTime = Date.now() - 500
      const error = new Error('Test error')

      logger.logRunnerError(startTime, error)

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringMatching(/Runner execution failed after \d+ms/)
      )
      expect(consoleSpy).toHaveBeenCalledWith(
        '[BotonicPluginAiAgents] Error:',
        error
      )
    })

    it('should log model settings for OpenAI provider', () => {
      logger.logModelSettings({
        provider: 'openai',
        model: 'gpt-4.1-mini',
        reasoning: { effort: 'none' },
        text: { verbosity: 'medium' },
        hasRetrieveKnowledge: true,
      })

      expect(consoleSpy).toHaveBeenCalledWith(
        '[BotonicPluginAiAgents] === Agent Model Settings ==='
      )
      expect(consoleSpy).toHaveBeenCalledWith(
        '[BotonicPluginAiAgents] Has Retrieve Knowledge Tool: true'
      )
      expect(consoleSpy).toHaveBeenCalledWith(
        '[BotonicPluginAiAgents] Reasoning Effort: none'
      )
      expect(consoleSpy).toHaveBeenCalledWith(
        '[BotonicPluginAiAgents] Text Verbosity: medium'
      )
    })

    it('should log model settings for Azure provider with tool choice', () => {
      logger.logModelSettings({
        provider: 'azure',
        model: undefined,
        toolChoice: 'retrieve_knowledge',
        hasRetrieveKnowledge: true,
      })

      expect(consoleSpy).toHaveBeenCalledWith(
        '[BotonicPluginAiAgents] Has Retrieve Knowledge Tool: true'
      )
      expect(consoleSpy).toHaveBeenCalledWith(
        '[BotonicPluginAiAgents] Tool Choice: retrieve_knowledge'
      )
    })
  })

  describe('DisabledDebugLogger', () => {
    let logger: DebugLogger

    beforeEach(() => {
      logger = createDebugLogger(false)
    })

    it('should not log anything when disabled', () => {
      logger.logInitialConfig({
        messageHistoryApiVersion: 'v2',
        maxRetries: 2,
        timeout: 16000,
        customToolNames: [],
        memory: {},
      })
      logger.logAgentDebugInfo({ name: 'Test', instructions: '' }, [], [])
      logger.logModelSettings({
        provider: 'azure',
        model: undefined,
        hasRetrieveKnowledge: false,
      })
      logger.logRunnerStart()
      logger.logRunResult({} as any, Date.now())
      logger.logGuardrailTriggered()
      logger.logRunnerError(Date.now(), new Error())

      expect(consoleSpy).not.toHaveBeenCalled()
    })
  })
})
