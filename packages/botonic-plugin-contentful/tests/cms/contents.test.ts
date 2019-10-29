import { instance, mock, when } from 'ts-mockito'
import { Content, Text } from '../../src/cms'
import { RndTextBuilder } from '../helpers/builders'
import { expectEqualExceptOneField } from '../helpers/expect'

test('TEST: cloneWithButtons copies all fields except buttons', () => {
  const builder = new RndTextBuilder()
  const t1 = builder.build()
  expect(t1).toBeInstanceOf(Text)

  const clone = t1.cloneWithButtons(t1.buttons.slice(1, 2))

  expect(clone).toBeInstanceOf(Text)
  expect(clone).not.toEqual(t1)
  expect(clone.buttons).toHaveLength(1)
  expect(t1.buttons).not.toHaveLength(1)
  expect(clone.buttons[0]).toBe(t1.buttons[1])

  expectEqualExceptOneField(t1, clone, 'buttons')
})

test('TEST: cloneWithText copies all fields except text', () => {
  const builder = new RndTextBuilder()
  const t1 = builder.build()
  const oldText = t1.text
  expect(t1).toBeInstanceOf(Text)

  const clone = t1.cloneWithText('modified text')

  expect(clone).toBeInstanceOf(Text)
  expect(clone.text).toEqual('modified text')
  expect(clone).not.toEqual(t1)
  expect(t1.text).toEqual(oldText)

  expectEqualExceptOneField(t1, clone, 'text')
})

test('TEST: cloneWithFollowUp copies all fields except followUp', () => {
  const builder = new RndTextBuilder()
  const t1 = builder.build()
  const oldFollowUp = t1.common.followUp
  expect(t1).toBeInstanceOf(Text)

  const newFollowUp = builder.build()
  const clone = t1.cloneWithFollowUp(newFollowUp)

  expect(clone).toBeInstanceOf(Text)
  expect(clone.common.followUp).toBe(newFollowUp)
  expect(clone).not.toEqual(t1)
  expect(t1.common.followUp).toBe(oldFollowUp)

  expectEqualExceptOneField(t1, clone, 'common')
  expectEqualExceptOneField(t1.common, clone.common, 'followUp')
})

test('TEST: validateContents', () => {
  const invalidContent = mock(Content)
  when(invalidContent.validate()).thenReturn('wrong button')

  const validContent = mock(Content)
  when(validContent.validate()).thenReturn(undefined)

  expect(
    Content.validateContents([instance(validContent), instance(validContent)])
  ).toBeUndefined()
  expect(
    Content.validateContents([
      instance(validContent),
      instance(invalidContent),
      instance(validContent),
      instance(invalidContent),
    ])
  ).toEqual('wrong button. wrong button')
})
