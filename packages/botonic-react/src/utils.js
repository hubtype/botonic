import React from 'react'
import { Text } from './components/text'
import { Title } from './components/title'
import { Subtitle } from './components/subtitle'
import { Element } from './components/element'
import { Button } from './components/button'
import { Carousel } from './components/carousel'
import { Reply } from './components/reply'
import { Image } from './components/image'
import { Audio } from './components/audio'
import { Pic } from './components/pic'
import { Video } from './components/video'
import { Document } from './components/document'
import { Location } from './components/location'

export function isFunction(o) {
  return typeof o === 'function'
}

export function isDev() {
  return process.env.NODE_ENV == 'development'
}

export function isProd() {
  return process.env.NODE_ENV == 'production'
}

export function loadPlugins(plugins) {
  if (!plugins) return
  let _plugins = {}
  let pluginsLength = plugins.length
  for (let i = 0; i < pluginsLength; i++) {
    let pluginRequired = plugins[i].resolve
    let options = plugins[i].options
    let Plugin = pluginRequired.default
    let instance = new Plugin(options)
    let id = plugins[i].id || `${instance.constructor.name}`
    _plugins[id] = instance
  }
  return _plugins
}

export async function runPlugins(
  plugins,
  mode,
  input,
  session,
  lastRoutePath,
  response = null
) {
  // TODO execute all plugins in parallel
  for (let key in plugins) {
    let p = await plugins[key]
    try {
      if (mode == 'pre')
        await p.pre({ input, session, lastRoutePath })
      if (mode == 'post')
        await p.post({ input, session, lastRoutePath, response })
    } catch (e) {
      console.log(e)
    }
  }
}

export function msgToBotonic(msg) {
  delete msg.display
  if (msg.type == 'text') {
    if (
      (msg.replies && msg.replies.length) ||
      (msg.keyboard && msg.keyboard.length)
    )
      return (
        <Text {...msg}>
          {msg.data.text || msg.data}
          {quickreplies_parse(msg)}
        </Text>
      )
    if (msg.buttons && msg.buttons.length)
      return (
        <Text {...msg}>
          {msg.data.text || msg.data}
          {buttons_parse(msg.buttons)}
        </Text>
      )
    return <Text {...msg}>{msg.data.text || msg.data}</Text>
  } else if (msg.type == 'carousel') {
    let elements = msg.elements || msg.data.elements
    return <Carousel {...msg}>{elements_parse(elements)}</Carousel>
  } else if (msg.type == 'image') {
    return <Image {...msg} src={msg.data.image || msg.data} />
  } else if (msg.type == 'video') {
    return <Video {...msg} src={msg.data.video || msg.data} />
  } else if (msg.type == 'audio') {
    return <Audio {...msg} src={msg.data.audio || msg.data} />
  } else if (msg.type == 'document') {
    return <Document {...msg} src={msg.data.document || msg.data} />
  } else if (msg.type == 'location') {
    let lat = msg.data ? msg.data.location.lat : msg.latitude
    let long = msg.data ? msg.data.location.long : msg.longitude
    return <Location {...msg} lat={lat} long={long} />
  } else if (msg.type == 'buttonmessage') {
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
  return buttons.map(b => {
    let payload = b.props ? b.props.payload : b.payload
    if ((b.props && b.props.path) || b.path)
      payload = `__PATH_PAYLOAD__${b.path}`
    let url = b.props ? b.props.url : b.url
    let title = b.props ? b.props.children : b.title
    return (
      <Button payload={payload} url={url}>
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
    replies = msg.keyboard.map(el => (
      <Reply payload={el.data}>{el.label}</Reply>
    ))
  }
  return replies
}
