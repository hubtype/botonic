import type { ReactNode } from 'react'
import { createContext, useCallback, useContext, useRef } from 'react'

import type { CampaignMessageProps } from '../components/index-types'

export const CAMPAIGN_MESSAGE_PROP_KEYS = [
  'isCampaignFirstMessage',
  'campaignId',
] as const satisfies readonly (keyof CampaignMessageProps)[]

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

export function useCampaignMessageAttributes<T extends CampaignMessageProps>(
  props: T
): {
  campaignHtmlAttributes: CampaignHtmlAttributes
  messageProps: CampaignMessagePropsWithoutCampaign<T>
} {
  const { takeCampaignMessageProps } = useContext(
    CampaignMessageAttributesContext
  )
  const merged = mergeCampaignMessageProps(
    pickCampaignMessagePropsSlice(props),
    takeCampaignMessageProps
  )
  return {
    campaignHtmlAttributes: toCampaignHtmlAttributes(merged),
    messageProps: omitCampaignMessageProps(props),
  }
}
