import { Element } from './components/element'
import { Pic } from './components/pic'
import { Title } from './components/title'
import { Subtitle } from './components/subtitle'
import React from 'react'
import { Button } from './components/button'
import { Text } from './components/text'
import { Carousel } from './components/carousel'
import { Image } from './components/image'
import { Video } from './components/video'
import { Audio } from './components/audio'
import { Document } from './components/document'
import { Location } from './components/location'
import { Reply } from './components/reply'

/**
 *
 * @param msg {object}
 * @param customMessageTypes {{customTypeName}[]?}
 * @return {React.ReactNode}
 */
export function msgToBotonic(msg, customMessageTypes) {
  delete msg.display
  if (msg.type === 'custom') {
    try {
      return customMessageTypes
        .find(mt => mt.customTypeName === msg.data.customTypeName)
        .deserialize(msg)
    } catch (e) {
      console.log(e)
    }
  } else if (msg.type === 'text') {
    const txt = msg.data.text != undefined ? msg.data.text : String(msg.data)
    if (
      (msg.replies && msg.replies.length) ||
      (msg.keyboard && msg.keyboard.length)
    )
      return (
        <Text {...msg}>
          {txt}
          {quickrepliesParse(msg)}
        </Text>
      )
    if (msg.buttons && msg.buttons.length)
      return (
        <Text {...msg}>
          {txt}
          {buttonsParse(msg.buttons)}
        </Text>
      )
    return <Text {...msg}>{txt}</Text>
  } else if (msg.type === 'carousel') {
    const elements = msg.elements || msg.data.elements
    return <Carousel {...msg}>{elementsParse(elements)}</Carousel>
  } else if (msg.type === 'image') {
    return (
      <Image
        {...msg}
        src={msg.data.image != undefined ? msg.data.image : msg.data}
      />
    )
  } else if (msg.type === 'video') {
    return (
      <Video
        {...msg}
        src={msg.data.video != undefined ? msg.data.video : msg.data}
      />
    )
  } else if (msg.type === 'audio') {
    return (
      <Audio
        {...msg}
        src={msg.data.audio != undefined ? msg.data.audio : msg.data}
      />
    )
  } else if (msg.type === 'document') {
    return (
      <Document
        {...msg}
        src={msg.data.document != undefined ? msg.data.document : msg.data}
      />
    )
  } else if (msg.type === 'location') {
    const lat = msg.data ? msg.data.location.lat : msg.latitude
    const long = msg.data ? msg.data.location.long : msg.longitude
    return <Location {...msg} lat={lat} long={long} />
  } else if (msg.type === 'buttonmessage') {
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
          return msgToBotonic(msg, customMessageTypes, decorator)
        })}
      </>
    )
  }
  return msgToBotonic(msgs, customMessageTypes, decorator)
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
    const props = b.props || b
    let payload = props.payload
    if (props.path) payload = `__PATH_PAYLOAD__${props.path}`
    const url = props.messenger_extensions ? null : props.url
    const title = props.title
    const webview = props.messenger_extensions ? props.url : props.webview
    return (
      <Button key={i} payload={payload} url={url} webview={webview}>
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
          {el.text}
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
