import * as cms from '../../src/cms'
import * as render from '../../src/render'

test('Test: convert a text with text followup and buttons correctly', async () => {
  const opt = {
    common: {
      id: 'id',
      name: 'name',
      followup: new cms.Text({
        common: {
          id: 'id',
          name: 'name',
        },
        text: 'http://test-cms-directus-alb-1959632461.eu-west-1.elb.amazonaws.com:8055/assets/59a3cf05-c6e1-4482-8c3a-2ab926b0b884',
      }),
      keywords: ['basket', ' michael'],
    },
    text: 'Michael Jordan era solito volare.',
    buttons: [
      {
        common: {
          id: 'id',
          name: 'name',
        },
        text: 'pulsante numero uno',
        target: 'payloadFromDirectus',
      } as cms.Button,
      {
        common: {
          id: 'id',
          name: 'name',
        },
        text: 'yiyiyi',
        target: 'text$d5f41da7-18a5-4a1d-a819-079da1749f70',
      } as cms.Button,
    ],
    customFields: '',
  }

  const directusText = new cms.Text(opt)
  const options = new render.RenderOptions()
  options.followUpDelaySeconds = 1
  const converter = new render.BotonicMsgConverter(options)
  const convertedText = converter.convert(directusText)
  const correctConvertedText = [
    {
      type: 'text',
      delay: 0,
      data: { text: 'Michael Jordan era solito volare.' },
      buttons: [
        {
          title: 'pulsante numero uno',
          payload: 'payloadFromDirectus',
        },
        {
          title: 'yiyiyi',
          payload: 'text$d5f41da7-18a5-4a1d-a819-079da1749f70',
        },
      ],
    },
    {
      type: 'text',
      delay: 1,
      data: {
        text: 'http://test-cms-directus-alb-1959632461.eu-west-1.elb.amazonaws.com:8055/assets/59a3cf05-c6e1-4482-8c3a-2ab926b0b884',
      },
      buttons: undefined,
    },
  ]
  expect(convertedText).toEqual(correctConvertedText)
})
