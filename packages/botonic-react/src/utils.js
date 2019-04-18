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
  try {
    switch (component[0].type) {
      case 'div':
        let carousel = []
        component[0].props.children.map((e, i) => {
          let c = e.props.children
          carousel[i] = {
            img: c[0].props.src,
            title: c[1].props.children,
            subtitle: c[2].props.children,
            button: c.slice(3)
          }
        })
        componentJSON = carousel
        break
      case 'img':
        componentJSON = component[0].props.src
        break
      case 'video':
        componentJSON = component[0].props.children.props.src
        break
      case 'audio':
        componentJSON = component[0].props.children[0].props.src
        break
      case 'embed':
        componentJSON = component[0].props.src
        break
      case 'a':
        componentJSON = component[0].props.href
        break
    }
    return componentJSON
  } catch (e) {
    console.log(`Error decomposing Component ${e}`)
  }
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
      return quickreplies_parse(msg)
    return (
      <Text {...msg}>
        {msg.data} {buttons_parse(msg.buttons)}
      </Text>
    )
  } else if (msg.type == 'carousel') {
    let elements = msg.data || msg.elements
    return <Carousel {...msg}>{elements_parse(elements)}</Carousel>
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
      <Pic src={e.img || e.image_url} />
      <Title>{e.title}</Title>
      <Subtitle>{e.subtitle}</Subtitle>
      {buttons_parse(e.button || e.buttons)}
    </Element>
  ))
}

// function elements_parse(elements) {
//   return elements.map(el => {
//     return (
//       <Element>
//         <Pic src={el.image_url} />
//         <Title>{el.title}</Title>
//         <Subtitle>{el.subtitle}</Subtitle>
//         {buttons_parse(el.buttons)}
//       </Element>
//     )
//   })
// }

function buttons_parse(buttons) {
  return buttons.map(b => {
    let payload = b.props ? b.props.payload : b.payload
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
  let repliesKeyboard = null
  if (msg.replies) {
    replies = msg.replies.map((el, i) => {
      return (
        <Reply key={i} payload={el.payload}>
          {el.text}
        </Reply>
      )
    })
  }
  if (msg.keyboard) {
    repliesKeyboard = msg.keyboard.map(el => {
      return <Reply payload={el.data}>{el.label}</Reply>
    })
  }
  return (
    <>
      <Text>
        {msg.data}
        {replies}
        {repliesKeyboard}
      </Text>
    </>
  )
}
