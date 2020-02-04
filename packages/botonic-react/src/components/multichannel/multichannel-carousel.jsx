import React from 'react'
import { RequestContext } from '../../contexts'
import { Carousel } from '../carousel'
import { Image } from '../image'
import { MultichannelText } from './multichannel-text'
import { MultichannelButton } from './multichannel-button'
import { Providers } from '@botonic/core'

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
          let button = {}

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
              button.text = e.props.children
              button.url = e.props.url
            }
          }
          if (this.enableURL) {
            return (
              <React.Fragment key={i}>
                <MultichannelText>
                  {`*${title}* - _${subtitle}_`}
                  <MultichannelButton url={button.url}>
                    {`${button.text}`}
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
                  caption={`*${title}* - _${subtitle}_\n${button.text}: ${button.url}`}
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
