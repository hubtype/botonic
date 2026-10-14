import type { CampaignMessageProps } from '../components/index-types'

export function omitCampaignMessageProps<T extends CampaignMessageProps>(
  props: T
): Omit<T, 'isCampaignFirstMessage' | 'campaignId'> {
  const {
    isCampaignFirstMessage: _isCampaignFirstMessage,
    campaignId: _campaignId,
    ...rest
  } = props
  return rest
}

export type CampaignHtmlAttributes = {
  iscampaignfirstmessage?: '0' | '1'
  campaignid?: string
}

export function toCampaignHtmlAttributes(
  props: Pick<CampaignMessageProps, 'isCampaignFirstMessage' | 'campaignId'>
): CampaignHtmlAttributes {
  const attrs: CampaignHtmlAttributes = {}

  if (props.isCampaignFirstMessage === true) {
    attrs.iscampaignfirstmessage = '1'
  } else if (props.isCampaignFirstMessage === false) {
    attrs.iscampaignfirstmessage = '0'
  }

  if (props.campaignId !== undefined) {
    attrs.campaignid = props.campaignId
  }

  return attrs
}
