import { Button, Carousel, Element, Pic, Subtitle, Title } from '../../../src'
import { MultichannelCarousel } from '../../../src/components/multichannel'
import React from 'react'
import TestRenderer from 'react-test-renderer'
import { withContext, withProvider } from '../../helpers/react-traverser'

describe('multiChannel carousel', () => {

  test('with pic, title & subtitle', () => {
    const carousel = <Carousel style='style1'>
      {[
        <Element key={0}>
          <Pic src="htp://pic"/>
          <Title>tit1</Title>
          <Subtitle>sub1</Subtitle>
          {[
            <Button key='0' payload='payload1'>
              button text
            </Button>,
          ]}
        </Element>,
      ]}
    </Carousel>
    const sut = <MultichannelCarousel {...carousel.props}>
      {carousel.props.children}
    </MultichannelCarousel>
    // ReactDOMServer.renderToStaticMarkup(sut)
    const renderer = TestRenderer.create(withContext(sut, {session:{user:{provider:'whatsappnew'}}}))
    const tree = renderer.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
