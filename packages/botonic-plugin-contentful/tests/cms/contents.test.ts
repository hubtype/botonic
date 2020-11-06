import { instance, mock, when } from 'ts-mockito'
import { Content, Text } from '../../src/cms'
import {
  RndStartUpBuilder,
  RndTextBuilder,
} from '../../src/cms/test-helpers/builders'
import { expectEqualExceptOneField } from '../helpers/expect'

test('TEST: cloneWithButtons copies all fields except buttons', () => {
  const t1 = new RndTextBuilder().withRandomFields().build()
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
  const t1 = new RndTextBuilder().withRandomFields().build()
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
  const builder = new RndTextBuilder().withRandomFields()
  const t1 = builder.build()
  const oldFollowUp = t1.common.followUp

  // act
  const newFollowUp = builder.build()
  const clone = t1.cloneWithFollowUp(newFollowUp)

  // assert
  expect(clone).toBeInstanceOf(Text)
  expect(clone.common.followUp).toBe(newFollowUp)
  expect(clone).not.toEqual(t1)
  expect(t1.common.followUp).toBe(oldFollowUp)

  expectEqualExceptOneField(clone, t1, 'common')
  expectEqualExceptOneField(clone.common, t1.common, 'followUp')
})

test('TEST: cloneWithFollowUpLast appends at the end of the followup chain', () => {
  const text = new RndTextBuilder('txt', 'txt')
    .withRandomFields()
    .withFollowUp(undefined)
    .build()
  const main = new RndStartUpBuilder('su', 'su')
    .withRandomFields()
    .withFollowUp(text)
    .build()
  const last = new RndTextBuilder('last', 'last').withRandomFields().build()

  // act
  const clone = main.cloneWithFollowUpLast(last)

  // assert
  expectEqualExceptOneField(clone, main, 'common')
  expectEqualExceptOneField(clone.common, main.common, 'followUp')
  expectEqualExceptOneField(clone.common.followUp, text, 'common')
  expectEqualExceptOneField(
    clone.common.followUp?.common,
    text?.common,
    'followUp'
  )
  expectEqualExceptOneField(
    clone.common.followUp?.common.followUp,
    last,
    'common'
  )
})

test('TEST: findRecursively', () => {
  const startUpBuilder = new RndStartUpBuilder().withRandomFields()
  const followUp = new RndTextBuilder().withRandomFields().build()
  const main = startUpBuilder.withFollowUp(followUp).build()

  expect(main.findRecursively(c => c.common.id == main.common.id)).toEqual(main)
  expect(main.findRecursively(c => c.common.id == followUp.common.id)).toEqual(
    followUp
  )
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
