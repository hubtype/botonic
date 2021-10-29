import { BotState, PATH_PAYLOAD_IDENTIFIER, Session } from '../../src'

export function testRoute(): any {
  return {}
}

export function testSession(): Session {
  return {}
}

type BotStateAttrs = {
  isFirstInteraction?: boolean
  lastRoutePath?: string
  retries?: number
}
export function testBotState(botStateAttrs?: BotStateAttrs): BotState {
  return {
    botId: '1234',
    isFirstInteraction: botStateAttrs?.isFirstInteraction
      ? botStateAttrs?.isFirstInteraction
      : true,
    isHandoff: false,
    isShadowing: false,
    lastRoutePath: botStateAttrs?.lastRoutePath ?? null,
    locale: undefined,
    retries: botStateAttrs?.retries ?? 0,
  }
}

export const botStateWithLastRoutePath = (lastRoutePath: any): BotState => {
  return testBotState({ lastRoutePath })
}

export const botStateWithLastRoutePathAndRetries = (
  lastRoutePath: any,
  retries: number
): BotState => {
  return testBotState({ lastRoutePath, retries })
}

export const createPathPayload = (pathWithParams: string): string =>
  `${PATH_PAYLOAD_IDENTIFIER}${pathWithParams}`
