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

export function msgToBotonic(msg, customMessageTypes) {
  delete msg.display
  if (msg.type === 'custom') {
    try {
      return customMessageTypes
        .find(mt => mt.customTypeName == msg.data.customTypeName)
        .deserialize(msg)
    } catch (e) {
      console.log(e)
    }
  } else if (msg.type === 'text') {
    let txt = msg.data.text != undefined ? msg.data.text : String(msg.data)
    if (
      (msg.replies && msg.replies.length) ||
      (msg.keyboard && msg.keyboard.length)
    )
      return (
        <Text {...msg}>
          {txt}
          {quickreplies_parse(msg)}
        </Text>
      )
    if (msg.buttons && msg.buttons.length)
      return (
        <Text {...msg}>
          {txt}
          {buttons_parse(msg.buttons)}
        </Text>
      )
    return <Text {...msg}>{txt}</Text>
  } else if (msg.type === 'carousel') {
    let elements = msg.elements || msg.data.elements
    return <Carousel {...msg}>{elements_parse(elements)}</Carousel>
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
    let lat = msg.data ? msg.data.location.lat : msg.latitude
    let long = msg.data ? msg.data.location.long : msg.longitude
    return <Location {...msg} lat={lat} long={long} />
  } else if (msg.type === 'buttonmessage') {
    let buttons = buttons_parse(msg.buttons)
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

export function msgsToBotonic(msgs, customMessageTypes) {
  if (Array.isArray(msgs)) {
    return (
      <>
        {msgs.map((msg, i) => {
          if (msg['key'] == null) {
            msg['key'] = `msg${i}`
          }
          return msgToBotonic(msg, customMessageTypes)
        })}
      </>
    )
  }
  return msgToBotonic(msgs, customMessageTypes)
}

function elements_parse(elements) {
  return elements.map((e, i) => (
    <Element key={i}>
      <Pic src={e.img || e.pic || e.image_url} />
      <Title>{e.title}</Title>
      <Subtitle>{e.subtitle}</Subtitle>
      {buttons_parse(e.button || e.buttons)}
    </Element>
  ))
}

function buttons_parse(buttons) {
  return buttons.map((b, i) => {
    let props = b.props || b
    let payload = props.payload
    if (props.path) payload = `__PATH_PAYLOAD__${props.path}`
    let url = props.messenger_extensions ? null : props.url
    let title = props.title
    let webview = props.messenger_extensions ? props.url : props.webview
    return (
      <Button key={i} payload={payload} url={url} webview={webview}>
        {title}
      </Button>
    )
  })
}

function quickreplies_parse(msg) {
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
