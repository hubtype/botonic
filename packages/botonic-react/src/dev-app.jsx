import { createRoot } from 'react-dom/client'

import { SENDERS } from './index-types'
import { ReactBot } from './react-bot'
import { onDOMLoaded } from './util/dom'
import { WebchatApp } from './webchat-app'
import { WebchatDev } from './webchat/webchat-dev'

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
        const dataString =
          typeof eventData === 'string' ? eventData : JSON.stringify(eventData)
        this.addBotMessage({
          type: 'system_debug_trace',
          data: dataString,
        })
      }

      // @ts-expect-error - Adding dev test samples to Botonic namespace
      window.Botonic.debugTrace = {
        nluKeyword: () => {
          /* eslint-disable @typescript-eslint/naming-convention */
          // @ts-expect-error - Calling dev helper
          window.Botonic.devTestSystemDebugTrace({
            action: 'nlu_keyword',
            format_version: 2,
            bot_version: '1.2.3',
            flow_version: '4.5.6',
            chat_language: 'en-US',
            chat_country: 'US',
            bot_interaction_id: '550e8400-e29b-41d4-a716-446655440000',
            user_input: 'I want to book a flight',
            nlu_keyword_id: '660e8400-e29b-41d4-a716-446655440001',
            nlu_keyword_name: 'booking_intent',
            nlu_keyword_is_regex: false,
            nlu_keyword_message_id: '770e8400-e29b-41d4-a716-446655440002',
            flow_thread_id: '880e8400-e29b-41d4-a716-446655440003',
            flow_id: '990e8400-e29b-41d4-a716-446655440004',
            flow_node_id: 'aa0e8400-e29b-41d4-a716-446655440005',
          })
          /* eslint-enable @typescript-eslint/naming-convention */
        },
        nluIntentSmart: () => {
          /* eslint-disable @typescript-eslint/naming-convention */
          // @ts-expect-error - Calling dev helper
          window.Botonic.devTestSystemDebugTrace({
            action: 'nlu_intent_smart',
            format_version: 2,
            bot_version: '1.2.3',
            flow_version: '4.5.6',
            chat_language: 'en-US',
            chat_country: 'US',
            bot_interaction_id: 'bb0e8400-e29b-41d4-a716-446655440006',
            user_input: 'What are your business hours?',
            nlu_intent_smart_title: 'Business Hours Inquiry',
            nlu_intent_smart_num_used: 3,
            nlu_intent_smart_message_id: 'cc0e8400-e29b-41d4-a716-446655440007',
            flow_thread_id: 'dd0e8400-e29b-41d4-a716-446655440008',
            flow_id: 'ee0e8400-e29b-41d4-a716-446655440009',
            flow_node_id: 'ff0e8400-e29b-41d4-a716-446655440010',
          })
          /* eslint-enable @typescript-eslint/naming-convention */
        },
        knowledgeBase: () => {
          /* eslint-disable @typescript-eslint/naming-convention */
          // @ts-expect-error - Calling dev helper
          window.Botonic.devTestSystemDebugTrace({
            action: 'knowledgebase',
            format_version: 2,
            bot_version: '1.2.3',
            flow_version: '4.5.6',
            chat_language: 'en-US',
            chat_country: 'US',
            bot_interaction_id: '110e8400-e29b-41d4-a716-446655440011',
            user_input: 'How do I reset my password?',
            knowledgebase_inference_id: '220e8400-e29b-41d4-a716-446655440012',
            knowledgebase_fail_reason: '',
            knowledgebase_sources_ids: [
              '330e8400-e29b-41d4-a716-446655440013',
              '440e8400-e29b-41d4-a716-446655440014',
            ],
            knowledgebase_chunks_ids: [
              '550e8400-e29b-41d4-a716-446655440015',
              '660e8400-e29b-41d4-a716-446655440016',
            ],
            knowledgebase_message_id: '770e8400-e29b-41d4-a716-446655440017',
            flow_thread_id: '880e8400-e29b-41d4-a716-446655440018',
            flow_id: '990e8400-e29b-41d4-a716-446655440019',
            flow_node_id: 'aa0e8400-e29b-41d4-a716-446655440020',
          })
          /* eslint-enable @typescript-eslint/naming-convention */
        },
        aiAgent: () => {
          /* eslint-disable @typescript-eslint/naming-convention */
          // @ts-expect-error - Calling dev helper
          window.Botonic.devTestSystemDebugTrace({
            action: 'ai_agent',
            format_version: 2,
            bot_version: '1.2.3',
            flow_version: '4.5.6',
            chat_language: 'en-US',
            chat_country: 'US',
            bot_interaction_id: 'bb0e8400-e29b-41d4-a716-446655440021',
            flow_thread_id: 'cc0e8400-e29b-41d4-a716-446655440022',
            flow_id: 'dd0e8400-e29b-41d4-a716-446655440023',
            flow_name: 'Customer Support Flow',
            flow_node_id: 'ee0e8400-e29b-41d4-a716-446655440024',
            flow_node_content_id: 'ai_agent_node_1',
            flow_node_is_meaningful: true,
            tools_executed: ['search_knowledge_base', 'calculate_price'],
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
            format_version: 2,
            bot_version: '1.2.3',
            flow_version: '4.5.6',
            chat_language: 'en-US',
            chat_country: 'US',
            bot_interaction_id: '110e8400-e29b-41d4-a716-446655440026',
            user_input: 'asdfghjkl',
            fallback_message_id: '220e8400-e29b-41d4-a716-446655440027',
            fallback_out: 1,
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
