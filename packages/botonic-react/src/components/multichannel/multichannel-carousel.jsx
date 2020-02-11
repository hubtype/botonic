import React from 'react'
import { RequestContext } from '../../contexts'
import { Carousel } from '../carousel'
// import { Image } from '../image'
import { MultichannelText } from './multichannel-text'
import { MultichannelButton } from './multichannel-button'
import { isWhatsapp, isNodeKind } from './multichannel-utils'

export class MultichannelCarousel extends React.Component {
  static contextType = RequestContext
  constructor(props) {
    super(props)
    // this.enableURL = this.props.enableURL
  }
  render() {
    if (isWhatsapp(this.context)) {
      return this.props.children
        .map(e => e.props.children)
        .map((element, i) => {
          let imageProps = undefined
          let title = undefined
          let subtitle = undefined
          let buttonProps = {}

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
            if (isNodeKind(node, 'Button')) {
              buttonProps = node.props
            }
          }

          let header = `${title ? `*${title}*` : ''}`
          header += `${subtitle ? ` - _${subtitle}_` : ''}`
          return (
            // Compact mode (show url if cached)
            <MultichannelText key={i} newkey={i}>
              {header}
              <MultichannelButton {...buttonProps}>
                {buttonProps.children}
              </MultichannelButton>
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
      return <Carousel {...props}>{this.props.children}</Carousel>
    }
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
