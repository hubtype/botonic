import { INPUT } from '@botonic/core'
import type { ReactNode } from 'react'
import { createContext, useCallback, useContext, useRef } from 'react'

import type { CampaignMessageProps } from '../components/index-types'

export const CAMPAIGN_MESSAGE_PROP_KEYS = [
  'isCampaignFirstMessage',
  'campaignId',
] as const satisfies readonly (keyof CampaignMessageProps)[]

/**
 * Botonic message `type` values that must not consume
 * {@link CampaignMessageAttributesProvider}'s single "first campaign message" slot
 * or receive campaign attrs injected from that provider.
 *
 * Components that render `<message>` without `Message` / `useCampaignMessageAttributes`
 * (e.g. {@link WebchatSettings}) are excluded implicitly — add types here when they
 * go through `Message` but should behave like non-campaign traffic.
 */
export const CAMPAIGN_MESSAGE_PROVIDER_SKIP_MESSAGE_TYPES = [
  INPUT.SYSTEM_DEBUG_TRACE,
  INPUT.WEBCHAT_SETTINGS,
  INPUT.CHAT_EVENT,
  INPUT.EVENT_AGENT_MESSAGE_CREATED,
  INPUT.EVENT_QUEUE_POSITION_CHANGED,
  INPUT.EVENT_CASE_STATUS_CHANGED,
] as const satisfies readonly string[]

export function shouldSkipCampaignMessageProvider(
  messageType: string | undefined
): boolean {
  if (!messageType) {
    return false
  }
  return (
    CAMPAIGN_MESSAGE_PROVIDER_SKIP_MESSAGE_TYPES as readonly string[]
  ).includes(messageType)
}

export type CampaignMessagePropKey = (typeof CAMPAIGN_MESSAGE_PROP_KEYS)[number]

export type CampaignMessagePropsSlice = Pick<
  CampaignMessageProps,
  CampaignMessagePropKey
>

export type CampaignMessagePropsWithoutCampaign<
  T extends CampaignMessageProps,
> = Omit<T, CampaignMessagePropKey>

type CampaignMessageAttributesContextValue = {
  takeCampaignMessageProps: () => CampaignMessagePropsSlice
}

const defaultCampaignMessageAttributesContext: CampaignMessageAttributesContextValue =
  {
    takeCampaignMessageProps: () => ({}),
  }

const CampaignMessageAttributesContext =
  createContext<CampaignMessageAttributesContextValue>(
    defaultCampaignMessageAttributesContext
  )

export type CampaignMessageAttributesProviderProps = {
  campaignId: string
  children: ReactNode
}

export function CampaignMessageAttributesProvider({
  campaignId,
  children,
}: CampaignMessageAttributesProviderProps) {
  const consumedRef = useRef(false)

  const takeCampaignMessageProps =
    useCallback((): CampaignMessagePropsSlice => {
      if (!campaignId || consumedRef.current) {
        return {}
      }
      consumedRef.current = true
      return { isCampaignFirstMessage: true, campaignId }
    }, [campaignId])

  return (
    <CampaignMessageAttributesContext.Provider
      value={{ takeCampaignMessageProps }}
    >
      {children}
    </CampaignMessageAttributesContext.Provider>
  )
}

function pickCampaignMessagePropsSlice(
  props: CampaignMessageProps
): CampaignMessagePropsSlice {
  return Object.fromEntries(
    CAMPAIGN_MESSAGE_PROP_KEYS.map(key => [key, props[key]])
  ) as CampaignMessagePropsSlice
}

function omitCampaignMessageProps<T extends CampaignMessageProps>(
  props: T
): CampaignMessagePropsWithoutCampaign<T> {
  const rest = { ...props }
  for (const key of CAMPAIGN_MESSAGE_PROP_KEYS) {
    delete rest[key]
  }
  return rest as CampaignMessagePropsWithoutCampaign<T>
}

function mergeCampaignMessageProps(
  explicit: CampaignMessagePropsSlice,
  takeCampaignMessageProps: () => CampaignMessagePropsSlice
): CampaignMessagePropsSlice {
  const fromProvider = takeCampaignMessageProps()
  return {
    isCampaignFirstMessage:
      explicit.isCampaignFirstMessage !== undefined
        ? explicit.isCampaignFirstMessage
        : fromProvider.isCampaignFirstMessage,
    campaignId:
      explicit.campaignId !== undefined
        ? explicit.campaignId
        : fromProvider.campaignId,
  }
}

export type CampaignHtmlAttributes = {
  iscampaignfirstmessage?: '0' | '1'
  campaignid?: string
}

function isCampaignFirstMessageTrue(value: unknown): boolean {
  return value === true || value === 1
}

function isCampaignFirstMessageFalse(value: unknown): boolean {
  return value === false || value === 0
}

function toCampaignHtmlAttributes(
  props: CampaignMessagePropsSlice
): CampaignHtmlAttributes {
  const attrs: CampaignHtmlAttributes = {}
  const isCampaignFirstMessage = props.isCampaignFirstMessage as unknown

  if (isCampaignFirstMessageTrue(isCampaignFirstMessage)) {
    attrs.iscampaignfirstmessage = '1'
  } else if (isCampaignFirstMessageFalse(isCampaignFirstMessage)) {
    attrs.iscampaignfirstmessage = '0'
  }

  if (props.campaignId !== undefined) {
    attrs.campaignid = props.campaignId
  }

  return attrs
}

export type UseCampaignMessageAttributesOptions = {
  /** When true, props from CampaignMessageAttributesProvider are ignored and not consumed. */
  skipProvider?: boolean
}

export function useCampaignMessageAttributes<T extends CampaignMessageProps>(
  props: T,
  options?: UseCampaignMessageAttributesOptions
): {
  campaignHtmlAttributes: CampaignHtmlAttributes
  messageProps: CampaignMessagePropsWithoutCampaign<T>
} {
  const { takeCampaignMessageProps } = useContext(
    CampaignMessageAttributesContext
  )
  const takeFromProvider = options?.skipProvider
    ? (): CampaignMessagePropsSlice => ({})
    : takeCampaignMessageProps
  const merged = mergeCampaignMessageProps(
    pickCampaignMessagePropsSlice(props),
    takeFromProvider
  )
  return {
    campaignHtmlAttributes: toCampaignHtmlAttributes(merged),
    messageProps: omitCampaignMessageProps(props),
  }
}
