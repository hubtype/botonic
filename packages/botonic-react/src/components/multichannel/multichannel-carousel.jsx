import React from 'react'
import { RequestContext } from '../../contexts'
import { Carousel } from '../carousel'
import { Image } from '../image'
import { MultichannelText } from './multichannel-text'
import { MultichannelButton } from './multichannel-button'
import { Providers } from '@botonic/core'
import { getButtons } from './multichannel-utils'

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
    this.optionIndex = 1
    if (
      this.context.session &&
      this.context.session.user &&
      this.context.session.user.provider == Providers.Messaging.WHATSAPPNEW
    ) {
      return this.props.children
        .map(e => e.props.children)
        .map((element, elementIndex) => {
          return this.renderElement(element, elementIndex)
        })
    } else {
      return <Carousel {...this.props}>{this.props.children}</Carousel>
    }
  }

  renderElement(carouselElement, elementIndex) {
    let imageSrc = undefined
    let title = undefined
    let subtitle = undefined
    let buttons = getButtons(carouselElement)

    try {
      for (let e of carouselElement) {
        if (!e.type) {
          continue
        }
        if (e.type.name == 'Pic') {
          imageSrc = e.props.src
        }
        if (e.type.name == 'Title') {
          title = e.props.children
        }
        if (e.type.name == 'Subtitle') {
          subtitle = e.props.children
        }
      }
      if (this.enableURL) {
        let header = `${title ? `*${title}*` : ''}`
        header += `${subtitle ? ` - _${subtitle}_` : ''}`
        return (
          <React.Fragment key={elementIndex}>
            <MultichannelText index={elementIndex}>
              {header}
              {buttons.map((button, buttonIndex) => (
                <MultichannelButton key={buttonIndex} {...button.props}>
                  {`${button.props.children}`}
                </MultichannelButton>
              ))}
            </MultichannelText>
            {this.props.enablePics && <Image src={imageSrc}></Image>}
          </React.Fragment>
        )
      } else {
        return (<React.Fragment key={elementIndex}>
            {buttons.map((button, buttonIndex) => (
              <Image key={buttonIndex}
                     src={imageSrc}
                     caption={carouselToCaption(
                       this.optionIndex,
                       title,
                       subtitle,
                       imageSrc,
                       button.props
                     )}
              ></Image>))
            }
          </React.Fragment>
        )
      }
    } finally {
      this.optionIndex += buttons.length
    }
  }
}

