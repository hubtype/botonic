import React from 'react'
import { createRoot } from 'react-dom/client'
import { v7 as uuidv7 } from 'uuid'

import { SENDERS } from './index-types'
import { ReactBot } from './react-bot'
import { onDOMLoaded } from './util/dom'
import { WebchatDev } from './webchat/webchat-dev'
import { WebchatApp } from './webchat-app'

export class DevApp extends WebchatApp {
  constructor({
    theme = {},
    persistentMenu,
    coverComponent,
    blockInputs,
    enableEmojiPicker,
    enableAttachments,
    enableUserInput,
    enableAnimations,
    shadowDOM,
    hostId,
    storage,
    storageKey,
    onInit,
    onOpen,
    onClose,
    onMessage,
    onTrackEvent,
    webviews,
    ...botOptions
  }) {
    super({
      theme,
      persistentMenu,
      coverComponent,
      blockInputs,
      enableEmojiPicker,
      enableAttachments,
      enableUserInput,
      enableAnimations,
      shadowDOM,
      hostId,
      storage,
      storageKey,
      onInit,
      onOpen,
      onClose,
      onMessage,
      onTrackEvent,
    })
    this.webviews = webviews
    this.bot = new ReactBot({
      ...botOptions,
    })
  }

  getComponent(host, optionsAtRuntime = {}) {
    let {
      theme = {},
      storage,
      storageKey,
      onInit,
      onOpen,
      onClose,
      onMessage,
      onTrackEvent,
      hostId,
      ...webchatOptions
    } = optionsAtRuntime
    theme = super.createInitialTheme(optionsAtRuntime)
    storage = storage || this.storage
    storageKey = storageKey || this.storageKey
    this.onInit = onInit || this.onInit
    this.onOpen = onOpen || this.onOpen
    this.onClose = onClose || this.onClose
    this.onMessage = onMessage || this.onMessage
    this.onTrackEvent = onTrackEvent || this.onTrackEvent
    this.hostId = hostId || this.hostId
    this.createRootElement(host)
    return (
      <WebchatDev
        {...webchatOptions}
        ref={this.webchatRef}
        host={this.host}
        shadowDOM={this.shadowDOM}
        theme={theme}
        storage={storage}
        storageKey={storageKey}
        onInit={(...args) => this.onInitWebchat(...args)}
        onOpen={(...args) => this.onOpenWebchat(...args)}
        onClose={(...args) => this.onCloseWebchat(...args)}
        onUserInput={(...args) => this.onUserInput(...args)}
        onTrackEvent={(...args) => this.onTrackEvent(...args)}
        webviews={this.webviews}
      />
    )
  }

  // TODO: Remove after implementing system debug trace events
  exposeToWindow() {
    super.exposeToWindow()

    if (typeof window !== 'undefined') {
      // Development helper to test system debug trace events
      // @ts-expect-error - Adding dev helper to Botonic namespace
      window.Botonic.devTestSystemDebugTrace = eventData => {
        const message = {
          type: 'system_debug_trace',
          data: eventData,
          payload: {},
          id: uuidv7(),
          feedbackEnabled: false,
          inferenceId: null,
          botInteractionId: null,
          ack: 0,
          isUnread: true,
          sentBy: 'system',
        }
        this.addSystemMessage(message)
      }

      // @ts-expect-error - Adding dev test samples to Botonic namespace
      window.Botonic.debugTrace = {
        nluKeyword: () => {
          /* eslint-disable @typescript-eslint/naming-convention */
          // @ts-expect-error - Calling dev helper
          window.Botonic.devTestSystemDebugTrace({
            action: 'nlu_keyword',
            format_version: 4,
            bot_version: '1.2.3',
            user_locale: 'en',
            user_country: 'US',
            system_locale: 'en',
            user_input: 'I want to book a flight',
            nlu_keyword_id: '660e8400-e29b-41d4-a716-446655440001',
            nlu_keyword_name: 'booking_intent',
            nlu_keyword_is_regex: false,
            nlu_keyword_message_id: '770e8400-e29b-41d4-a716-446655440002',
            flow_thread_id: '880e8400-e29b-41d4-a716-446655440003',
            flow_id: '990e8400-e29b-41d4-a716-446655440004',
            flow_name: 'Flight Booking Flow',
            flow_node_id: 'aa0e8400-e29b-41d4-a716-446655440005',
            flow_node_content_id: 'nlu_keyword_node_1',
          })
          /* eslint-enable @typescript-eslint/naming-convention */
        },
        nluIntentSmart: () => {
          /* eslint-disable @typescript-eslint/naming-convention */
          // @ts-expect-error - Calling dev helper
          window.Botonic.devTestSystemDebugTrace({
            action: 'nlu_intent_smart',
            format_version: 4,
            bot_version: '1.2.3',
            user_locale: 'en',
            user_country: 'US',
            system_locale: 'en',
            user_input: 'What are your business hours?',
            nlu_intent_smart_title: 'Business Hours Inquiry',
            nlu_intent_smart_num_used: 3,
            nlu_intent_smart_message_id: 'cc0e8400-e29b-41d4-a716-446655440007',
            flow_thread_id: 'dd0e8400-e29b-41d4-a716-446655440008',
            flow_id: 'ee0e8400-e29b-41d4-a716-446655440009',
            flow_name: 'Customer Support Flow',
            flow_node_id: 'ff0e8400-e29b-41d4-a716-446655440010',
            flow_node_content_id: 'nlu_intent_smart_node_1',
          })
          /* eslint-enable @typescript-eslint/naming-convention */
        },
        knowledgeBase: () => {
          /* eslint-disable @typescript-eslint/naming-convention */
          // @ts-expect-error - Calling dev helper
          window.Botonic.devTestSystemDebugTrace({
            action: 'knowledgebase',
            format_version: 4,
            bot_version: '1.2.3',
            user_locale: 'en',
            user_country: 'US',
            system_locale: 'en',
            user_input: 'How do I reset my password?',
            knowledgebase_inference_id: '220e8400-e29b-41d4-a716-446655440012',
            knowledgebase_fail_reason: '',
            knowledgebase_sources_ids: [
              '0197440e-9297-7332-aee1-3fe3579125b4',
              '019743f9-34a2-7b73-a4b1-b354d153a8c4',
            ],
            knowledgebase_chunks_ids: [
              '0197440e-9e3b-7de3-affe-d5e9f3bd6112',
              '0197440e-9cbc-7cd3-b10d-2ade9769dcc3',
            ],
            knowledgebase_message_id: '770e8400-e29b-41d4-a716-446655440017',
            flow_thread_id: '880e8400-e29b-41d4-a716-446655440018',
            flow_id: '990e8400-e29b-41d4-a716-446655440019',
            flow_name: 'Knowledge Base Flow',
            flow_node_id: 'aa0e8400-e29b-41d4-a716-446655440020',
            flow_node_content_id: 'knowledgebase_node_1',
          })
          /* eslint-enable @typescript-eslint/naming-convention */
        },
        aiAgent: () => {
          /* eslint-disable @typescript-eslint/naming-convention */
          // @ts-expect-error - Calling dev helper
          window.Botonic.devTestSystemDebugTrace({
            action: 'ai_agent',
            format_version: 4,
            bot_version: '1.2.3',
            user_locale: 'en',
            user_country: 'US',
            system_locale: 'en',
            flow_thread_id: 'cc0e8400-e29b-41d4-a716-446655440022',
            flow_id: 'dd0e8400-e29b-41d4-a716-446655440023',
            flow_name: 'AI Agent Flow',
            flow_node_id: 'ee0e8400-e29b-41d4-a716-446655440024',
            flow_node_content_id: 'ai_agent_node_1',
            flow_node_is_meaningful: true,
            tools_executed: [
              {
                tool_name: 'search_knowledge_base',
                tool_arguments: { query: 'What is the capital of France?' },
                knowledgebase_sources_ids: [
                  '0197440e-9297-7332-aee1-3fe3579125b4',
                  '019743f9-34a2-7b73-a4b1-b354d153a8c4',
                ],
                knowledgebase_chunks_ids: [
                  '0197440e-9e3b-7de3-affe-d5e9f3bd6112',
                  '0197440e-9cbc-7cd3-b10d-2ade9769dcc3',
                ],
              },
              {
                tool_name: 'get_weather',
                tool_arguments: { query: 'which is the weather?' },
              },
            ],
            memory_length: 5,
            input_message_id: 'ff0e8400-e29b-41d4-a716-446655440025',
            input_guardrails_triggered: [],
            output_guardrails_triggered: ['pii_filter'],
            exit: false,
            error: false,
          })
          /* eslint-enable @typescript-eslint/naming-convention */
        },
        fallback: () => {
          /* eslint-disable @typescript-eslint/naming-convention */
          // @ts-expect-error - Calling dev helper
          window.Botonic.devTestSystemDebugTrace({
            action: 'fallback',
            format_version: 4,
            bot_version: '1.2.3',
            user_locale: 'en',
            user_country: 'US',
            system_locale: 'en',
            user_input: 'asdfghjkl',
            flow_id: '123',
            flow_name: 'Fallback Flow',
            flow_node_id: '456',
            flow_node_content_id: 'fallback_node_1',
            fallback_message_id: '220e8400-e29b-41d4-a716-446655440027',
            fallback_out: 1,
          })
          /* eslint-enable @typescript-eslint/naming-convention */
        },
        handoffSuccess: () => {
          /* eslint-disable @typescript-eslint/naming-convention */
          // @ts-expect-error - Calling dev helper
          window.Botonic.devTestSystemDebugTrace({
            action: 'handoff_success',
            format_version: 4,
            bot_version: '1.2.3',
            user_locale: 'en',
            user_country: 'US',
            system_locale: 'en',
            user_input: 'asdfghjkl',
            flow_thread_id: '880e8400-e29b-41d4-a716-446655440028',
            queue_id: '990e8400-e29b-41d4-a716-446655440029',
            queue_name: 'Support Queue',
            case_id: '330e8400-e29b-41d4-a716-446655440030',
            flow_id: '123',
            flow_name: 'Handoff Success Flow',
            flow_node_id: '456',
            flow_node_content_id: 'handoff_success_node_1',
            is_queue_open: true,
            is_available_agent: true,
            is_threshold_reached: false,
          })
          /* eslint-enable @typescript-eslint/naming-convention */
        },
      }
    }
  }

  render(dest, optionsAtRuntime = {}) {
    onDOMLoaded(() => {
      const devAppComponent = this.getComponent(dest, optionsAtRuntime)
      const container = this.getReactMountNode(dest)
      const reactRoot = createRoot(container)
      reactRoot.render(devAppComponent)
      this.exposeToWindow() // TODO: Remove after implementing system debug trace events
    })
  }

  async onUserInput({ input, session, lastRoutePath }) {
    this.onMessage &&
      this.onMessage(this, {
        sentBy: SENDERS.user,
        message: input,
      })
    const resp = await this.bot.input({ input, session, lastRoutePath })
    this.onMessage &&
      resp.response.map(r =>
        this.onMessage(this, {
          sentBy: SENDERS.bot,
          message: r,
        })
      )
    this.webchatRef.current.addBotResponse(resp)
  }
}
