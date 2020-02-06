import React from 'react'
import { RequestContext } from '../../contexts'
import { Carousel } from '../carousel'
import { Image } from '../image'
import { MultichannelText } from './multichannel-text'
import { MultichannelButton } from './multichannel-button'
import { Providers } from '@botonic/core'

const carouselToCaption = (index, title, subtitle, imageSrc, buttonProps) => {
  let caption = ''
  let header = `${title ? `*${title}*` : ''}`
  header += `${subtitle ? ` - _${subtitle}_` : ''}`
  let buttons = ''
  if (buttonProps.url) {
    buttons += ` - ${buttonProps.children}: ${buttonProps.url}`
    caption = `${header ? `${header}\n` : ''}${buttons}`
  }
  if (buttonProps.payload || buttonProps.path) {
    buttons += `${index}. `
    caption = `${buttons}${buttonProps.children}`
  }
  return caption
}

export class MultichannelCarousel extends React.Component {
  static contextType = RequestContext
  constructor(props) {
    super(props)
    this.enableURL = this.props.enableURL
  }
  render() {
    if (
      this.context.session &&
      this.context.session.user &&
      this.context.session.user.provider == Providers.Messaging.WHATSAPPNEW
    ) {
      return this.props.children
        .map(e => e.props.children)
        .map((element, i) => {
          let imageSrc = undefined
          let title = undefined
          let subtitle = undefined
          let buttonProps = {}

          for (let e of element) {
            if (e.type.name == 'Pic') {
              imageSrc = e.props.src
            }
            if (e.type.name == 'Title') {
              title = e.props.children
            }
            if (e.type.name == 'Subtitle') {
              subtitle = e.props.children
            }
            if (e.type.name == 'Button') {
              buttonProps = e.props
            }
          }
          if (this.enableURL) {
            let header = `${title ? `*${title}*` : ''}`
            header += `${subtitle ? ` - _${subtitle}_` : ''}`
            return (
              <React.Fragment key={i}>
                <MultichannelText index={i}>
                  {header}
                  <MultichannelButton {...buttonProps}>
                    {`${buttonProps.children}`}
                  </MultichannelButton>
                </MultichannelText>
                {this.props.enablePics && <Image src={imageSrc}></Image>}
              </React.Fragment>
            )
          } else {
            return (
              <React.Fragment key={i}>
                <Image
                  src={imageSrc}
                  caption={carouselToCaption(
                    i + 1,
                    title,
                    subtitle,
                    imageSrc,
                    buttonProps
                  )}
                ></Image>
              </React.Fragment>
            )
          }
        })
    } else {
      return <Carousel {...props}>{this.props.children}</Carousel>
    }
  }
}
