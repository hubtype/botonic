import * as cms from '../../src/cms'
import * as render from '../../src/render'

test('Test: convert a text with text followup and buttons correctly', () => {
  const opt = {
    common: {
      id: 'id',
      name: 'name',
      followUp: new cms.Text({
        common: {
          id: 'id',
          name: 'name',
        },
        buttons: [],
        text: 'skkkk',
      }),
      keywords: ['basket', ' michael'],
      customFields: {},
    },
    text: 'Michael Jordan era solito volare.',
    buttons: [
      {
        common: {
          id: 'id1',
          name: 'name1',
        },
        text: 'pulsante numero uno',
        callback: { payload: 'payloadFromDirectus', url: undefined },
      } as cms.Button,
      {
        common: {
          id: 'id2',
          name: 'name2',
        },
        text: 'yiyiyi',
        callback: {
          payload: 'text$d5f41da7-18a5-4a1d-a819-079da1749f70',
          url: undefined,
        },
      } as cms.Button,
      {
        common: {
          id: 'id3',
          name: 'id3',
        },
        text: 'button3_text',
        callback: {
          payload: undefined,
          url: 'www.hubtype.com',
        },
      } as cms.Button,
    ],
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
          url: undefined,
        },
        {
          title: 'yiyiyi',
          payload: 'text$d5f41da7-18a5-4a1d-a819-079da1749f70',
          url: undefined,
        },
        {
          title: 'button3_text',
          payload: undefined,
          url: 'www.hubtype.com',
        },
      ],
    },
    {
      type: 'text',
      delay: 1,
      data: {
        text: 'skkkk',
      },
      buttons: [],
    },
  ]
  expect(convertedText).toEqual(correctConvertedText)
})

test('Test: convert text with reply button correctly', () => {
  const opt = {
    common: {
      id: 'id',
      name: 'name',
    },
    text: 'Leo Messi is the best.',
    buttons: [
      {
        common: {
          id: 'id1',
          name: 'name1',
        },
        text: 'quick reply button',
        callback: { payload: 'payload', url: undefined },
      } as cms.Button,
    ],
    buttonsStyle: cms.ButtonStyle.QUICK_REPLY,
  }
  const directusText = new cms.Text(opt)
  const options = new render.RenderOptions()
  const converter = new render.BotonicMsgConverter(options)
  const convertedText = converter.convert(directusText)
  const correctConvertedText = {
    type: 'text',
    delay: 0,
    data: { text: 'Leo Messi is the best.' },
    replies: [
      {
        text: 'quick reply button',
        payload: 'payload',
        url: undefined,
      },
    ],
  }

  expect(convertedText).toEqual(correctConvertedText)
})
