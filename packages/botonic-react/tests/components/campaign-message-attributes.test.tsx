import { describe, expect, test } from '@jest/globals'
import { renderToStaticMarkup } from 'react-dom/server'
import { Image } from '../../src/components/image'
import { Text } from '../../src/components/text'
import { WhatsappTemplate } from '../../src/components/whatsapp-template/index'
import { CampaignMessageAttributesProvider } from '../../src/contexts/campaign-message-attributes'

const CAMPAIGN_ID = '0197a2b1-0000-7000-8000-000000000001'

function getMessageOpenTags(html: string): string[] {
  return html.match(/<message\b[^>]*>/g) ?? []
}

describe('Campaign message HTML attributes', () => {
  test('Text serializes explicit campaign props to lowercase HTML attributes', () => {
    const html = renderToStaticMarkup(
      <Text isCampaignFirstMessage campaignId={CAMPAIGN_ID}>
        Hello
      </Text>
    )

    expect(html).toContain('iscampaignfirstmessage="1"')
    expect(html).toContain(`campaignid="${CAMPAIGN_ID}"`)
    expect(html).not.toContain('isCampaignFirstMessage')
    expect(html).not.toContain('campaignId')
  })

  test('Image serializes isCampaignFirstMessage=false as "0"', () => {
    const html = renderToStaticMarkup(
      <Image
        src='https://example.com/pic.png'
        isCampaignFirstMessage={false}
        campaignId={CAMPAIGN_ID}
      />
    )

    expect(html).toContain('iscampaignfirstmessage="0"')
    expect(html).toContain(`campaignid="${CAMPAIGN_ID}"`)
  })

  test('WhatsappTemplate omits campaign attributes when props are not set', () => {
    const html = renderToStaticMarkup(
      <WhatsappTemplate name='order_confirmation' language='en' />
    )

    expect(html).not.toContain('iscampaignfirstmessage')
    expect(html).not.toContain('campaignid')
  })

  test('CampaignMessageAttributesProvider marks only the first message', () => {
    const html = renderToStaticMarkup(
      <CampaignMessageAttributesProvider campaignId={CAMPAIGN_ID}>
        <Text>First</Text>
        <Text>Second</Text>
      </CampaignMessageAttributesProvider>
    )

    const messageTags = getMessageOpenTags(html)
    expect(messageTags).toHaveLength(2)
    expect(messageTags[0]).toContain('iscampaignfirstmessage="1"')
    expect(messageTags[0]).toContain(`campaignid="${CAMPAIGN_ID}"`)
    expect(messageTags[1]).not.toContain('iscampaignfirstmessage')
    expect(messageTags[1]).not.toContain('campaignid')
  })
})
