import { BotRequest, INPUT, Input } from '../../src'
import { Router } from '../../src/routing'
import { testRoute, testSession } from '../helpers/routing'

const textInput: Input = {
  type: INPUT.TEXT,
  text: 'hi',
  bot_interaction_id: 'testInteractionId',
  message_id: 'testMessageId',
}

const textInputComplex: Input = {
  type: INPUT.TEXT,
  text: 'Cömplêx input &% 🚀',
  bot_interaction_id: 'testInteractionId',
  message_id: 'testMessageId',
}

const textPayloadInput: Input = {
  type: INPUT.TEXT,
  text: 'hi',
  payload: 'foo',
  bot_interaction_id: 'testInteractionId',
  message_id: 'testMessageId',
}

const postbackInput: Input = {
  type: INPUT.POSTBACK,
  payload: 'foo',
  bot_interaction_id: 'testInteractionId',
  message_id: 'testMessageId',
}

const audioInput: Input = {
  type: INPUT.AUDIO,
  src: 'data:audio/mpeg;base64,iVBORw0KG',
  bot_interaction_id: 'testInteractionId',
  message_id: 'testMessageId',
}

const documentInput: Input = {
  type: INPUT.DOCUMENT,
  src: 'data:application/pdf;base64,iVBORw0KG',
  bot_interaction_id: 'testInteractionId',
  message_id: 'testMessageId',
}

const imageInput: Input = {
  type: INPUT.IMAGE,
  src: 'data:image/png;base64,iVBORw0KG',
  bot_interaction_id: 'testInteractionId',
  message_id: 'testMessageId',
}

const videoInput: Input = {
  type: INPUT.VIDEO,
  src: 'data:video/mp4;base64,iVBORw0KG',
  bot_interaction_id: 'testInteractionId',
  message_id: 'testMessageId',
}

const requestInput: BotRequest = {
  input: textInput,
  session: { ...testSession(), organization: 'myOrg' },
  lastRoutePath: 'initial',
}

describe('TEST: Match route by MATCHER <> INPUT', () => {
  const router = new Router([])
  const matchTextProp = (matcher, textInput) =>
    router.matchRoute(
      testRoute(),
      'text',
      matcher,
      textInput,
      testSession(),
      null
    )
  const matchPayloadProp = (matcher, payload) =>
    router.matchRoute(
      testRoute(),
      'payload',
      matcher,
      payload,
      testSession(),
      null
    )
  const matchTypeProp = (type, input) =>
    router.matchRoute(testRoute(), 'type', type, input, testSession(), null)
  const matchRequestProp = (matcher, request) =>
    router.matchRoute(
      testRoute(),
      'request',
      matcher,
      request.input,
      request.session,
      request.lastRoutePath
    )
  it('text <> text', () => {
    expect(matchTextProp('hi', textInput)).toBeTruthy()
    expect(matchTextProp('hii', textInput)).toBeFalsy()
    expect(matchTextProp('bye', textInput)).toBeFalsy()
    expect(matchTextProp('', textInput)).toBeFalsy()
    expect(matchTextProp(null, textInput)).toBeFalsy()
    expect(matchTextProp('Cömplêx input &% 🚀', textInputComplex)).toBeTruthy()
    expect(matchTextProp(' Cömplêx input &% 🚀', textInputComplex)).toBeFalsy() // has a space at the beginning
  })
  it('regex <> text', () => {
    expect(matchTextProp(/hi/, textInput)).toBeTruthy()
    expect(matchTextProp(/bye/, textInput)).toBeFalsy()
    expect(matchTextProp(/🚀/, textInputComplex)).toBeTruthy()
    expect(matchTextProp(/complex/, textInputComplex)).toBeFalsy()
  })
  it('function <> text', () => {
    expect(matchTextProp(v => v.startsWith('hi'), textInput)).toBeTruthy()
    expect(matchTextProp(v => !v.startsWith('hi'), textInput)).toBeFalsy()
  })
  it('input <> text', () => {
    expect(
      router.matchRoute(
        testRoute(),
        'input',
        i => i.text.startsWith('hi'),
        textInput,
        testSession(),
        null
      )
    ).toBeTruthy()
    expect(
      router.matchRoute(
        testRoute(),
        'input',
        i => !i.text.startsWith('hi'),
        textInput,
        testSession(),
        null
      )
    ).toBeFalsy()
  })
  it('text <> text payload', () => {
    expect(matchPayloadProp('foo', textPayloadInput)).toBeTruthy()
    expect(matchPayloadProp('fooo', textPayloadInput)).toBeFalsy()
    expect(matchPayloadProp('bar', textPayloadInput)).toBeFalsy()
    expect(matchPayloadProp('', textPayloadInput)).toBeFalsy()
    expect(matchPayloadProp(null, textPayloadInput)).toBeFalsy()
  })
  it('regex <> text payload', () => {
    expect(matchPayloadProp(/foo/, textPayloadInput)).toBeTruthy()
    expect(matchPayloadProp(/bar/, textPayloadInput)).toBeFalsy()
  })
  it('function <> text payload', () => {
    expect(
      matchPayloadProp(v => v.startsWith('fo'), textPayloadInput)
    ).toBeTruthy()
    expect(
      matchPayloadProp(v => !v.startsWith('fo'), textPayloadInput)
    ).toBeFalsy()
  })
  it('text <> postback', () => {
    expect(matchPayloadProp('foo', postbackInput)).toBeTruthy()
    expect(matchPayloadProp('fooo', postbackInput)).toBeFalsy()
    expect(matchPayloadProp('bar', postbackInput)).toBeFalsy()
    expect(matchPayloadProp('', postbackInput)).toBeFalsy()
    expect(matchPayloadProp(null, postbackInput)).toBeFalsy()
  })
  it('regex <> postback', () => {
    expect(matchPayloadProp(/foo/, postbackInput)).toBeTruthy()
    expect(matchPayloadProp(/bar/, postbackInput)).toBeFalsy()
  })
  it('function <> postback', () => {
    expect(
      matchPayloadProp(v => v.startsWith('fo'), postbackInput)
    ).toBeTruthy()
    expect(
      matchPayloadProp(v => !v.startsWith('fo'), postbackInput)
    ).toBeFalsy()
  })
  it('function <> request', () => {
    expect(
      matchRequestProp(
        request =>
          request.input.text === 'hi' &&
          request.session.organization === 'myOrg' &&
          request.lastRoutePath === 'initial',
        requestInput
      )
    ).toBeTruthy()
    expect(
      matchRequestProp(
        request =>
          request.input.text === 'hello' &&
          request.session.organization === 'myOrg' &&
          request.lastRoutePath === 'initial',
        requestInput
      )
    ).toBeFalsy()
  })
  it('type <> audio, document, image, video', () => {
    expect(matchTypeProp('audio', audioInput)).toBeTruthy()
    expect(matchTypeProp('document', documentInput)).toBeTruthy()
    expect(matchTypeProp('image', imageInput)).toBeTruthy()
    expect(matchTypeProp('video', videoInput)).toBeTruthy()
  })
  it('type <> other inputs', () => {
    expect(matchTypeProp(/.*/, { type: 'anyOtherInput' })).toBeTruthy()
  })
})
