import React from 'react'

import {
  isAudio,
  isCarousel,
  isCustom,
  isDocument,
  isImage,
  isLocation,
  isText,
  isVideo,
} from '../../src/message-utils'
import { Button } from '../components/button'
import { ButtonsDisabler } from '../components/buttons-disabler'
import { Element } from '../components/element'
import { Pic } from '../components/pic'
import { Reply } from '../components/reply'
import { Subtitle } from '../components/subtitle'
import { Title } from '../components/title'
// Experimental
import { Audio } from './components/audio'
import { Carousel } from './components/carousel'
import { Document } from './components/document'
import { Image } from './components/image'
import { Location } from './components/location'
import { Text } from './components/text'
import { Video } from './components/video'

/**
 *
 * @param msg {object}
 * @param customMessageTypes {{customTypeName}[]?}
 * @return {React.ReactNode}
 */

export function msgToBotonic(msg, customMessageTypes) {
  console.log('calling msgToBotonic', { msg })
  delete msg.display
  if (isCustom(msg)) {
    try {
      return customMessageTypes
        .find(mt => mt.customTypeName === msg.customTypeName)
        .deserialize(msg)
    } catch (e) {
      console.log(e)
    }
  } else if (isText(msg)) {
    return (
      <Text {...msg} key={msg.key}>
        {msg.text}
        {msg.buttons && msg.buttons.length > 0 && buttonsParse(msg.buttons)}
        {msg.replies && msg.replies.length > 0 && quickrepliesParse(msg)}
      </Text>
    )
  } else if (isCarousel(msg)) {
    return (
      <Carousel {...msg} key={msg.key}>
        {elementsParse(msg.elements)}
      </Carousel>
    )
  } else if (isImage(msg)) {
    return (
      <Image key={msg.key} {...msg}>
        {msg.buttons && buttonsParse(msg.buttons)}
      </Image>
    )
  } else if (isVideo(msg)) {
    return <Video {...msg}>{msg.buttons && buttonsParse(msg.buttons)}</Video>
  } else if (isAudio(msg)) {
    return <Audio {...msg}>{msg.buttons && buttonsParse(msg.buttons)}</Audio>
  } else if (isDocument(msg)) {
    return (
      <Document {...msg}>{msg.buttons && buttonsParse(msg.buttons)}</Document>
    )
  } else if (isLocation(msg)) return <Location {...msg} />

  console.warn(`Not converting message of type ${msg.type}`)
  return null
}

function rndStr() {
  return Math.random().toString()
}

/**
 * @param msgs {object|object[]}
 * @param customMessageTypes {{customTypeName}[]?}
 * @return {React.ReactNode}
 */
export function msgsToBotonic(msgs, customMessageTypes) {
  if (Array.isArray(msgs)) {
    return (
      <>
        {msgs.map((msg, i) => {
          if (msg.key == null) {
            msg.key = `msg${i}`
          }
          return msgToBotonic(msg, customMessageTypes)
        })}
      </>
    )
  }
  return msgToBotonic(msgs, customMessageTypes)
}

function elementsParse(elements) {
  return elements.map((e, i) => (
    <Element key={i}>
      <Pic src={e.pic} />
      <Title>{e.title}</Title>
      <Subtitle>{e.subtitle}</Subtitle>
      {e.buttons && buttonsParse(e.buttons)}
    </Element>
  ))
}

function buttonsParse(buttons) {
  return buttons.map((b, i) => {
    let payload = b.payload
    if (b.path) payload = `__PATH_PAYLOAD__${b.path}`
    const url = b.messenger_extensions ? null : b.url
    const target = b.messenger_extensions ? null : b.target
    const title = b.title
    const webview = b.messenger_extensions ? b.url : b.webview
    const disabledProps = ButtonsDisabler.constructBrowserProps(b)
    return (
      <Button
        key={i}
        payload={payload}
        url={url}
        target={target}
        webview={webview}
        {...disabledProps}
      >
        {title}
      </Button>
    )
  })
}

function quickrepliesParse(msg) {
  let replies = null
  if (msg.replies) {
    replies = msg.replies.map((el, i) => {
      let payload = el.payload
      if (el.path) payload = `__PATH_PAYLOAD__${el.path}`
      return (
        <Reply key={i} payload={payload}>
          {el.title}
        </Reply>
      )
    })
  }
  return replies
}
