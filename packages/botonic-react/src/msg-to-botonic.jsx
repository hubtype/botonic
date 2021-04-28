import React from 'react'

import {
  isAudio,
  isButtonMessage,
  isCarousel,
  isCustom,
  isDocument,
  isImage,
  isLocation,
  isText,
  isVideo,
} from '../src/message-utils'
import { Audio } from './components/audio'
import { Button } from './components/button'
import { ButtonsDisabler } from './components/buttons-disabler'
import { Carousel } from './components/carousel'
import { Document } from './components/document'
import { Element } from './components/element'
import { Image } from './components/image'
import { Location } from './components/location'
import { Pic } from './components/pic'
import { Reply } from './components/reply'
import { Subtitle } from './components/subtitle'
import { Text } from './components/text'
import { Title } from './components/title'
import { Video } from './components/video'

/**
 *
 * @param msg {object}
 * @param customMessageTypes {{customTypeName}[]?}
 * @return {React.ReactNode}
 */
export function msgToBotonic(msg, customMessageTypes) {
  delete msg.display
  if (isCustom(msg)) {
    try {
      return customMessageTypes
        .find(mt => mt.customTypeName === msg.data.customTypeName)
        .deserialize(msg)
    } catch (e) {
      console.log(e)
    }
  } else if (isText(msg)) {
    return textToBotonic(msg)
  } else if (isCarousel(msg)) {
    const elements = msg.elements || msg.data.elements
    return (
      <Carousel {...msg} key={msg.key}>
        {elementsParse(elements)}
      </Carousel>
    )
  } else if (isImage(msg)) {
    return <Image key={msg.key} {...msg} />
  } else if (isVideo(msg)) {
    return <Video {...msg} />
  } else if (isAudio(msg)) {
    return <Audio {...msg} />
  } else if (isDocument(msg)) {
    return <Document {...msg} />
  } else if (isLocation(msg)) {
    const lat = msg.data ? msg.data.location.lat : msg.latitude
    const long = msg.data ? msg.data.location.long : msg.longitude
    return <Location {...msg} lat={lat} long={long} />
  } else if (isButtonMessage(msg)) {
    const buttons = buttonsParse(msg.buttons)
    return (
      <>
        <Text {...msg}>
          {msg.text}
          {buttons}
        </Text>
      </>
    )
  }
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

function textToBotonic(msg) {
  const text = msg.text
  if (
    (msg.replies && msg.replies.length) ||
    (msg.keyboard && msg.keyboard.length)
  )
    return (
      <Text {...msg} key={msg.key}>
        {text}
        {quickrepliesParse(msg)}
      </Text>
    )
  if (msg.buttons && msg.buttons.length)
    return (
      <Text {...msg} key={msg.key}>
        {text}
        {buttonsParse(msg.buttons)}
      </Text>
    )
  return (
    <Text {...msg} key={msg.key}>
      {text}
    </Text>
  )
}

function elementsParse(elements) {
  return elements.map((e, i) => (
    <Element key={i}>
      <Pic src={e.img || e.pic || e.image_url} />
      <Title>{e.title}</Title>
      <Subtitle>{e.subtitle}</Subtitle>
      {buttonsParse(e.button || e.buttons)}
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
  if (msg.keyboard) {
    replies = msg.keyboard.map((el, i) => (
      <Reply key={i} payload={el.data}>
        {el.label}
      </Reply>
    ))
  }
  return replies
}
