import React from 'react'
import { Text } from './components/text'
import { Title } from './components/title'
import { Subtitle } from './components/subtitle'
import { Element } from './components/element'
import { Button } from './components/button'
import { Carousel } from './components/carousel'
import { Reply } from './components/reply'
import { Image } from './components/image'
import { Pic } from './components/pic'
import { Video } from './components/video'
import { Document } from './components/document'
import { Location } from './components/location'

export function decomposeComponent(component) {
  let componentJSON = null
  let carousel = []
  try {
    component[0].props.children.map((e, i) => {
      let c = e.props.children
      carousel[i] = {
        img: c[0].props.src,
        title: c[1].props.children,
        subtitle: c[2].props.children,
        button: c[3].props
      }
    })
  } catch (e) {}
  if (carousel.length) {
    componentJSON = carousel
  }
  try {
    if (component[0].type == 'img') componentJSON = component[0].props.src
  } catch (e) {}

  try {
    if (component[0].type == 'video')
      componentJSON = component[0].props.children.props.src
  } catch (e) {}

  try {
    if (component[0].type == 'audio')
      componentJSON = component[0].props.children[0].props.src
  } catch (e) {}

  try {
    if (component[0].type == 'embed') componentJSON = component[0].props.src
  } catch (e) {}
  try {
    if (component[0].type == 'a') componentJSON = component[0].props.href
  } catch (e) {}
  return componentJSON
}

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
  for (let key in plugins) {
    let p = plugins[key]
    try {
      if (mode == 'pre') return await p.pre({ input, session, lastRoutePath })
      if (mode == 'post')
        return await p.post({ input, session, lastRoutePath, response })
    } catch (e) {
      console.log(e)
    }
  }
}

export function msgToBotonic(msg) {
  delete msg.display
  if (msg.type == 'text') {
    if (msg.replies && msg.replies.length) return quickreplies_parse(msg)
    return <Text {...msg}>{msg.data}</Text>
  } else if (msg.type == 'carousel') {
    return <Carousel {...msg}>{elements_parse(msg.data)}</Carousel>
  } else if (msg.type == 'image') {
    return <Image {...msg} src={msg.data} />
  } else if (msg.type == 'video') {
    return <Video {...msg} src={msg.data} />
  } else if (msg.type == 'document') {
    return <Document {...msg} src={msg.data} />
  } else if (msg.type == 'location') {
    return <Location {...msg} lat={msg.latitude} long={msg.longitude} />
  } else if (msg.type == 'buttonmessage') {
    let buttons = buttons_parse(msg.buttons)
    return (
      <>
        <Text {...msg}>{msg.text}</Text>
        {buttons}
      </>
    )
  }
}

function elements_parse(elements) {
  return elements.map((e, i) => (
    <Element key={i}>
      <Pic src={e.img} />
      <Title>{e.title}</Title>
      <Subtitle>{e.subtitle}</Subtitle>
      <Button url={e.button.url} payload={e.button.payload}>
        {e.button.children}
      </Button>
    </Element>
  ))
}

function quickreplies_parse(msg) {
  let replies = msg.replies.map((el, i) => {
    return (
      <Reply key={i} payload={el.payload}>
        {el.text}
      </Reply>
    )
  })
  return (
    <>
      <Text>
        {msg.data}
        {replies}
      </Text>
    </>
  )
}
