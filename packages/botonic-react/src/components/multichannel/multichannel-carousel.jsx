import { isWhatsapp } from '@botonic/core'
import React, { useContext } from 'react'

import { RequestContext } from '../../contexts'
import { Carousel } from '../carousel'
import { MultichannelText } from './multichannel-text'
import {
  getFilteredElements,
  isMultichannelButton,
  isNodePic,
  isNodeSubtitle,
  isNodeTitle,
} from './multichannel-utils'

export const MultichannelCarousel = props => {
  const requestContext = useContext(RequestContext)

  const getButtons = node =>
    [].concat(getFilteredElements(node, isMultichannelButton))

  if (isWhatsapp(requestContext.session)) {
    const elements = props.children
      .map(e => e.props.children)
      .map((element, i) => {
        let imageProps = undefined
        let title = undefined
        let subtitle = undefined
        const buttons = []

        for (const node of element) {
          if (isNodePic(node)) {
            imageProps = node.props
          }
          if (isNodeTitle(node)) {
            title = node.props.children
          }
          if (isNodeSubtitle(node)) {
            subtitle = node.props.children
          }

          if (isMultichannelButton(node)) {
            buttons.push(node)
          }
          //TODO support fragment containing an array
          if (Array.isArray(node)) {
            buttons.push(getButtons(node))
          }
        }

        let header = ''
        if (props.showTitle && title) {
          header += `${title ? `**${title}**` : ''}`
          if (title && subtitle) {
            header += ' '
          }
        }
        if (props.showSubtitle && subtitle) {
          header += `_${subtitle}_`
        }

        return (
          // TODO: newkey only for 1 nested button
          <MultichannelText
            key={i}
            newkey={i}
            indexMode={props.indexMode}
            buttonsAsText={props.buttonsAsText}
          >
            {header || null}
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
    return elements
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
