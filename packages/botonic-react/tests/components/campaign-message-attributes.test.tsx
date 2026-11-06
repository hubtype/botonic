import { INPUT } from '@botonic/core'
import { describe, expect, test } from '@jest/globals'
import { renderToStaticMarkup } from 'react-dom/server'
import { Image } from '../../src/components/image'
import { Message } from '../../src/components/message'
import { Text } from '../../src/components/text'
import { WebchatSettings } from '../../src/components/webchat-settings'
import { WhatsappTemplate } from '../../src/components/whatsapp-template/index'
import {
  CAMPAIGN_MESSAGE_PROVIDER_SKIP_MESSAGE_TYPES,
  CampaignMessageAttributesProvider,
  shouldSkipCampaignMessageProvider,
} from '../../src/contexts/campaign-message-attributes'

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

  test('CampaignMessageAttributesProvider does not mark WebchatSettings; next message is first', () => {
    const html = renderToStaticMarkup(
      <CampaignMessageAttributesProvider campaignId={CAMPAIGN_ID}>
        <WebchatSettings theme={{}} />
        <Text>Hello</Text>
      </CampaignMessageAttributesProvider>
    )

    const messageTags = getMessageOpenTags(html)
    expect(messageTags).toHaveLength(2)
    expect(messageTags[0]).toContain('type="webchatsettings"')
    expect(messageTags[0]).not.toContain('iscampaignfirstmessage')
    expect(messageTags[0]).not.toContain('campaignid')
    expect(messageTags[1]).toContain('iscampaignfirstmessage="1"')
    expect(messageTags[1]).toContain(`campaignid="${CAMPAIGN_ID}"`)
  })

  test.each(CAMPAIGN_MESSAGE_PROVIDER_SKIP_MESSAGE_TYPES)(
    'shouldSkipCampaignMessageProvider returns true for %s',
    messageType => {
      expect(shouldSkipCampaignMessageProvider(messageType)).toBe(true)
    }
  )

  test('shouldSkipCampaignMessageProvider returns false for content message types', () => {
    expect(shouldSkipCampaignMessageProvider(undefined)).toBe(false)
    expect(shouldSkipCampaignMessageProvider(INPUT.TEXT)).toBe(false)
  })

  test('CAMPAIGN_MESSAGE_PROVIDER_SKIP_MESSAGE_TYPES do not consume provider; next Text is first campaign message', () => {
    const html = renderToStaticMarkup(
      <CampaignMessageAttributesProvider campaignId={CAMPAIGN_ID}>
        {CAMPAIGN_MESSAGE_PROVIDER_SKIP_MESSAGE_TYPES.map(messageType => (
          <Message key={messageType} type={messageType}>
            skip
          </Message>
        ))}
        <Text>Hello</Text>
      </CampaignMessageAttributesProvider>
    )

    const messageTags = getMessageOpenTags(html)
    expect(messageTags).toHaveLength(
      CAMPAIGN_MESSAGE_PROVIDER_SKIP_MESSAGE_TYPES.length + 1
    )

    for (
      let i = 0;
      i < CAMPAIGN_MESSAGE_PROVIDER_SKIP_MESSAGE_TYPES.length;
      i++
    ) {
      expect(messageTags[i]).not.toContain('iscampaignfirstmessage')
      expect(messageTags[i]).not.toContain('campaignid')
    }

    const campaignMessage = messageTags[messageTags.length - 1]
    expect(campaignMessage).toContain('iscampaignfirstmessage="1"')
    expect(campaignMessage).toContain(`campaignid="${CAMPAIGN_ID}"`)
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
