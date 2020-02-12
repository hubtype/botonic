import React, { useContext } from 'react'
import { RequestContext } from '../../contexts'
import { Carousel } from '../carousel'
// import { Image } from '../image'
import { MultichannelText } from './multichannel-text'
import {
  isWhatsapp,
  isNodeKind,
  getFilteredElements,
  isMultichannelButton,
} from './multichannel-utils'

export const MultichannelCarousel = props => {
  let requestContext = useContext(RequestContext)

  const getButtons = node =>
    [].concat(getFilteredElements(node, isMultichannelButton))

  if (isWhatsapp(requestContext)) {
    return props.children
      .map(e => e.props.children)
      .map((element, i) => {
        let imageProps = undefined
        let title = undefined
        let subtitle = undefined
        let buttons = []

        for (let node of element) {
          if (isNodeKind(node, 'Pic')) {
            imageProps = node.props
          }
          if (isNodeKind(node, 'Title')) {
            title = node.props.children
          }
          if (isNodeKind(node, 'Subtitle')) {
            subtitle = node.props.children
          }

          if (isNodeKind(node, 'MultichannelButton')) {
            buttons.push(node)
          }
          if (Array.isArray(node)) {
            buttons.push(getButtons(node))
          }
        }

        let header = `${title ? `*${title}*` : ''}`
        if (title && subtitle) {
          header += ' '
        }
        if (subtitle) {
          header += `_${subtitle}_`
        }

        return (
          // TODO: newkey only for 1 nested button
          <MultichannelText key={i} newkey={i}>
            {header}
            {buttons}
          </MultichannelText>
        )

        // TODO: in the future, this would be the default mode
        // } else {
        // return (
        //   <React.Fragment key={i}>
        //     <Image
        //       src={imageSrc}
        //       caption={carouselToCaption(
        //         i + 1,
        //         title,
        //         subtitle,
        //         imageSrc,
        //         buttonProps
        //       )}
        //     ></Image>
        //   </React.Fragment>
        // )
        // }
      })
  } else {
    return <Carousel {...props}>{props.children}</Carousel>
  }
}

// const carouselToCaption = (index, title, subtitle, imageSrc, buttonProps) => {
//   let caption = ''
//   let header = `${title ? `*${title}*` : ''}`
//   header += `${subtitle ? ` - _${subtitle}_` : ''}`
//   let buttons = ''
//   if (buttonProps.url) {
//     buttons += ` - ${buttonProps.children}: ${buttonProps.url}`
//     caption = `${header ? `${header}\n` : ''}${buttons}`
//   }
//   if (buttonProps.payload || buttonProps.path) {
//     buttons += `${index}. `
//     caption = `${buttons}${buttonProps.children}`
//   }
//   return caption
// }
