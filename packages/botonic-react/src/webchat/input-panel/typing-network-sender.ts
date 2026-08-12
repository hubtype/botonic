import type { Session as CoreSession } from '@botonic/core'
import { INPUT } from '@botonic/core'
import { v7 as uuidv7 } from 'uuid'

import { Typing } from '../../index-types'

/** Network debounce before `typing_off` is sent after a stop signal. */
export const TYPING_OFF_DEBOUNCE_MS = 2000

export type TypingChatEvent = Typing.On | Typing.Off

/** `true` when `typing_on` was delivered to the server. */
export type TypingOnSendResult = boolean

/** `true` when `typing_off` was scheduled; delivery happens after debounce. */
export type TypingOffSendResult = boolean

export interface ChatEventContext {
  session: Partial<CoreSession>
  lastRoutePath?: string
}

export type SendToServer = (
  chatEvent: TypingChatEvent,
  context: ChatEventContext
) => Promise<boolean>

export function buildChatEventPayload(
  chatEvent: TypingChatEvent,
  { session, lastRoutePath }: ChatEventContext
) {
  return {
    user: session.user,
    input: {
      id: uuidv7(),
      type: INPUT.CHAT_EVENT,
      data: chatEvent,
    },
    session,
    lastRoutePath,
  }
}

/**
 * Sends typing_on / typing_off to the server without duplicates:
 * - at most one typing_on while the user is typing
 * - typing_off debounced to avoid bursts of stop signals
 * - typing_off always uses the same session context as its typing_on
 */
export class TypingNetworkSender {
  private disposed = false
  private isTypingOnServer = false
  private activeContext: ChatEventContext | null = null
  private pendingOffTimer: ReturnType<typeof setTimeout> | null = null
  private pendingTypingOn: Promise<TypingOnSendResult> | null = null

  constructor(
    private readonly getContext: () => ChatEventContext,
    private readonly sendToServer: SendToServer
  ) {}

  /**
   * For `Typing.On`, returns whether the event was delivered.
   * For `Typing.Off`, returns whether the stop was scheduled.
   */
  async send(
    chatEvent: TypingChatEvent
  ): Promise<TypingOnSendResult | TypingOffSendResult> {
    if (chatEvent === Typing.On) {
      return this.userStartedTyping()
    }

    return this.userStoppedTyping()
  }

  dispose() {
    this.disposed = true
    this.cancelPendingOff()

    if (!this.isTypingOnServer || !this.activeContext) {
      return
    }

    const context = this.activeContext
    this.resetTypingState()
    void this.sendToServer(Typing.Off, context)
  }

  private async userStartedTyping(): Promise<TypingOnSendResult> {
    if (this.pendingTypingOn) {
      return this.pendingTypingOn
    }

    this.cancelPendingOff()

    if (this.isTypingOnServer) {
      return true
    }

    this.pendingTypingOn = (async () => {
      const context = this.getContext()

      try {
        const delivered = await this.sendToServer(Typing.On, context)

        if (this.disposed) {
          if (delivered) {
            void this.sendToServer(Typing.Off, context)
          }

          return false
        }

        if (delivered) {
          this.isTypingOnServer = true
          this.activeContext = context
        }

        return delivered
      } finally {
        this.pendingTypingOn = null
      }
    })()

    return this.pendingTypingOn
  }

  private userStoppedTyping(): Promise<TypingOffSendResult> {
    if (!this.isTypingOnServer || !this.activeContext) {
      return Promise.resolve(false)
    }

    this.cancelPendingOff()

    const context = this.activeContext

    this.pendingOffTimer = setTimeout(() => {
      this.pendingOffTimer = null
      this.resetTypingState()
      void this.sendToServer(Typing.Off, context)
    }, TYPING_OFF_DEBOUNCE_MS)

    return Promise.resolve(true)
  }

  private resetTypingState() {
    this.isTypingOnServer = false
    this.activeContext = null
  }

  private cancelPendingOff() {
    if (!this.pendingOffTimer) {
      return
    }

    clearTimeout(this.pendingOffTimer)
    this.pendingOffTimer = null
  }
}
