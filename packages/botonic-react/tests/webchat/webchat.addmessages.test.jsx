/**
 * @jest-environment jsdom
 * @jest-environment-options {"url": "https://jestjs.io/"}
 */

import 'intersection-observer'

import { act, render, screen } from '@testing-library/react'
import React from 'react'

import { Audio, Document, Image, Video } from '../../src/components'
import { ROLES } from '../../src/constants'
import { Webchat } from '../../src/webchat/webchat'
import {
  expectNotToHaveRoles,
  expectToHaveRoles,
  renderUseWebchatHook,
} from '../helpers/test-utils'

describe('Adding webchat messageComponent', () => {
  // To avoid TypeError: frame.scrollTo is not a function (same for scrollIntoView)
  window.HTMLElement.prototype.scrollTo = function () {}
  window.HTMLElement.prototype.scrollIntoView = function () {}

  it('TEST: When adding an Image message the webchat has StyledWebchat, MessageList, StyledMessage and ImageMessage', async () => {
    const { result } = renderUseWebchatHook()
    act(() => {
      result.current.toggleWebchat(true)
      result.current.addMessageComponent(
        <Image src='https://botonic.io/images/botonic_react_logo-p-500.png' />
      )
    })
    await act(async () => {
      render(<Webchat webchatHooks={result.current} />)
    })
    expectToHaveRoles(
      [ROLES.WEBCHAT, ROLES.MESSAGE_LIST, ROLES.MESSAGE, ROLES.IMAGE_MESSAGE],
      screen
    )
    expectNotToHaveRoles(
      [ROLES.AUDIO_MESSAGE, ROLES.VIDEO_MESSAGE, ROLES.DOCUMENT_MESSAGE],
      screen
    )
  })

  it('TEST: When adding an Audio message the webchat has StyledWebchat, MessageList, StyledMessage and AudioMessage', async () => {
    const { result } = renderUseWebchatHook()
    act(() => {
      result.current.toggleWebchat(true)
      result.current.addMessageComponent(
        <Audio src='https://www.w3schools.com/html/horse.mp3' />
      )
    })
    await act(async () => {
      render(<Webchat webchatHooks={result.current} />)
    })
    expectToHaveRoles(
      [ROLES.WEBCHAT, ROLES.MESSAGE_LIST, ROLES.MESSAGE, ROLES.AUDIO_MESSAGE],
      screen
    )
    expectNotToHaveRoles(
      [ROLES.IMAGE_MESSAGE, ROLES.VIDEO_MESSAGE, ROLES.DOCUMENT_MESSAGE],
      screen
    )
  })

  it('TEST: When adding a Video message the webchat has StyledWebchat, MessageList, StyledMessage and VideoMessage', async () => {
    const { result } = renderUseWebchatHook()
    act(() => {
      result.current.toggleWebchat(true)
      result.current.addMessageComponent(
        <Video src='https://www.w3schools.com/html/mov_bbb.mp4' />
      )
    })
    await act(async () => {
      render(<Webchat webchatHooks={result.current} />)
    })
    expectToHaveRoles(
      [ROLES.WEBCHAT, ROLES.MESSAGE_LIST, ROLES.MESSAGE, ROLES.VIDEO_MESSAGE],
      screen
    )
    expectNotToHaveRoles(
      [ROLES.IMAGE_MESSAGE, ROLES.AUDIO_MESSAGE, ROLES.DOCUMENT_MESSAGE],
      screen
    )
  })

  it('TEST: When adding a Document message the webchat has StyledWebchat, MessageList, StyledMessage and DocumentMessage', async () => {
    const { result } = renderUseWebchatHook()
    act(() => {
      result.current.toggleWebchat(true)
      result.current.addMessageComponent(
        <Document src='http://unec.edu.az/application/uploads/2014/12/pdf-sample.pdf' />
      )
    })
    await act(async () => {
      render(<Webchat webchatHooks={result.current} />)
    })
    expectToHaveRoles(
      [
        ROLES.WEBCHAT,
        ROLES.MESSAGE_LIST,
        ROLES.MESSAGE,
        ROLES.DOCUMENT_MESSAGE,
      ],
      screen
    )
    expectNotToHaveRoles(
      [ROLES.IMAGE_MESSAGE, ROLES.AUDIO_MESSAGE, ROLES.VIDEO_MESSAGE],
      screen
    )
  })
})
