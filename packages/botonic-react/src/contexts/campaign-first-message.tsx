import type { ReactNode } from 'react'
import { createContext, useCallback, useContext, useRef } from 'react'

import type { CampaignMessageProps } from '../components/index-types'
import {
  type CampaignHtmlAttributes,
  toCampaignHtmlAttributes,
} from '../util/campaign-message-attributes'

export type CampaignMessagePropsSlice = Pick<
  CampaignMessageProps,
  'isCampaignFirstMessage' | 'campaignId'
>

type CampaignFirstMessageContextValue = {
  takeCampaignMessageProps: () => CampaignMessagePropsSlice
}

const defaultCampaignFirstMessageContext: CampaignFirstMessageContextValue = {
  takeCampaignMessageProps: () => ({}),
}

export const CampaignFirstMessageContext =
  createContext<CampaignFirstMessageContextValue>(
    defaultCampaignFirstMessageContext
  )

export type CampaignFirstMessageProviderProps = {
  campaignId: string
  children: ReactNode
}

export function CampaignFirstMessageProvider({
  campaignId,
  children,
}: CampaignFirstMessageProviderProps) {
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
    <CampaignFirstMessageContext.Provider value={{ takeCampaignMessageProps }}>
      {children}
    </CampaignFirstMessageContext.Provider>
  )
}

export function mergeCampaignMessageProps(
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

export function useCampaignFirstMessageContext(): CampaignFirstMessageContextValue {
  return useContext(CampaignFirstMessageContext)
}

export function resolveCampaignHtmlAttributes(
  explicit: CampaignMessagePropsSlice,
  takeCampaignMessageProps: () => CampaignMessagePropsSlice
): CampaignHtmlAttributes {
  return toCampaignHtmlAttributes(
    mergeCampaignMessageProps(explicit, takeCampaignMessageProps)
  )
}
