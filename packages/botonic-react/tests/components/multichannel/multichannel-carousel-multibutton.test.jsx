import React from 'react'

import {
  Carousel,
  Element,
  Pic,
  Subtitle,
  Title,
} from '../../../src/components'
import {
  MultichannelButton,
  MultichannelCarousel,
} from '../../../src/components/multichannel'
import { whatsappRenderer } from '../../helpers/test-utils'

export const LEGACY_CONTEXT = {
  indexSeparator: '.',
  messageSeparator: null,
}

export const LEGACY_PROPS = {
  indexMode: 'number',
  showTitle: true,
  showSubtitle: true,
}

const movies = [
  {
    name: 'Snatch',
    desc: 'Five minutes, Turkish',
    url: 'https://www.imdb.com/title/tt0208092',
    pic: 'https://nebula.wsimg.com/obj/NzQ3QUYxQzZBNzE4NjNFRTc1MTU6NmM4YjgzZWVlZTE2MGMzM2RkMTdlZjdjNGUyZmFhNDE6Ojo6OjA=',
  },
  {
    name: 'El laberinto del fauno',
    desc: '2006',
    url: 'https://www.imdb.com/title/tt0457430',
    pic: 'https://m.media-amazon.com/images/M/MV5BMDBjOWYyMDQtOWRmOC00MDgxLWIxM2UtMTNjYzFiN2RkYTBlXkEyXkFqcGdeQXVyMTAyOTE2ODg0._V1_UY268_CR6,0,182,268_AL_.jpg',
  },
]

describe('Multichannel carousel COMPACT mode N Buttons', () => {
  test('dynamic carousel with url buttons', () => {
    const carousel = (
      <Carousel>
        {movies.map((e, i) => (
          <Element key={e.name}>
            <Pic src={e.pic} />
            <Title>{e.name}</Title>
            <Subtitle>{e.desc}</Subtitle>
            {[
              <MultichannelButton key={'1'} url={e.url}>
                Visit website
              </MultichannelButton>,
              <MultichannelButton key={'2'} url={'anotherurl.com'}>
                Another website
              </MultichannelButton>,
            ]}
          </Element>
        ))}
      </Carousel>
    )
    const sut = (
      <MultichannelCarousel {...carousel.props} {...LEGACY_PROPS}>
        {carousel.props.children}
      </MultichannelCarousel>
    )
    const renderer = whatsappRenderer(sut, LEGACY_CONTEXT)
    const tree = renderer.toJSON()
    expect(tree).toMatchSnapshot()
  })

  const options = [
    {
      name: 'Title1',
      desc: 'Subtitle1',
      payload: 'Payload1',
      buttonText: 'Previo a la compra',
      pic: 'https://cdn.slidesharecdn.com/profile-photo-sumeet.moghe-48x48.jpg?cb=1527568614',
    },
    {
      name: 'Title2',
      desc: 'Subtitle2',
      payload: 'Payload2',
      buttonText: 'Durante la compra',
      pic: 'https://nebula.wsimg.com/obj/NzQ3QUYxQzZBNzE4NjNFRTc1MTU6NmM4YjgzZWVlZTE2MGMzM2RkMTdlZjdjNGUyZmFhNDE6Ojo6OjA=',
    },
  ]

  test('dynamic carousel with payload/path buttons N Buttons', () => {
    const carousel = (
      <Carousel>
        {options.map((e, i) => (
          <Element key={e.name}>
            <Pic src={e.pic} />
            <Title>{e.name}</Title>
            <Subtitle>{e.desc}</Subtitle>
            {[
              <MultichannelButton key={'1'} payload={'payload1'}>
                {e.buttonText}
              </MultichannelButton>,
              <MultichannelButton key={'2'} payload={'payload2'}>
                another button{i}
              </MultichannelButton>,
            ]}
          </Element>
        ))}
      </Carousel>
    )
    const sut = (
      <MultichannelCarousel {...carousel.props} {...LEGACY_PROPS}>
        {carousel.props.children}
      </MultichannelCarousel>
    )
    const renderer = whatsappRenderer(sut, LEGACY_CONTEXT)
    const tree = renderer.toJSON()
    expect(tree).toMatchSnapshot()
  })

  const optionsNoTitleNoSubtitle = [
    {
      name: '',
      desc: '',
      payload: 'Payload1',
      buttonText: 'Previo a la compra',
      pic: 'https://cdn.slidesharecdn.com/profile-photo-sumeet.moghe-48x48.jpg?cb=1527568614',
    },
    {
      name: '',
      desc: '',
      payload: 'Payload2',
      buttonText: 'Durante la compra',
      pic: 'https://nebula.wsimg.com/obj/NzQ3QUYxQzZBNzE4NjNFRTc1MTU6NmM4YjgzZWVlZTE2MGMzM2RkMTdlZjdjNGUyZmFhNDE6Ojo6OjA=',
    },
  ]

  test('dynamic carousel (just text in button) with payload/path buttons N Buttons', () => {
    const carousel = (
      <Carousel>
        {optionsNoTitleNoSubtitle.map((e, i) => (
          <Element key={e.name}>
            <Pic src={e.pic} />
            <Title>{e.name}</Title>
            <Subtitle>{e.desc}</Subtitle>
            {[
              <MultichannelButton key={'1'} payload={e.payload}>
                {e.buttonText}
              </MultichannelButton>,
              <MultichannelButton key={'2'} payload={e.payload}>
                another button{i}
              </MultichannelButton>,
            ]}
          </Element>
        ))}
      </Carousel>
    )
    const sut = (
      <MultichannelCarousel {...carousel.props} {...LEGACY_PROPS}>
        {carousel.props.children}
      </MultichannelCarousel>
    )
    const renderer = whatsappRenderer(sut, LEGACY_CONTEXT)
    const tree = renderer.toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('dynamic carousel with URL and postback buttons N Buttons displaying only postback buttons as whatsapp buttons', () => {
    const postbackButtons = options.map((e, i) => (
      <Element key={e.name}>
        <Pic src={e.pic} />
        <Title>{e.name}</Title>
        <Subtitle>{e.desc}</Subtitle>
        {[
          <MultichannelButton key={'1'} payload={'payload1'}>
            {e.buttonText}
          </MultichannelButton>,
          <MultichannelButton key={'2'} payload={'payload2'}>
            another button{i}
          </MultichannelButton>,
        ]}
      </Element>
    ))
    const urlButtons = movies.map((e, i) => (
      <Element key={e.name}>
        <Pic src={e.pic} />
        <Title>{e.name}</Title>
        <Subtitle>{e.desc}</Subtitle>
        {[
          <MultichannelButton key={'1'} url={e.url}>
            Visit website
          </MultichannelButton>,
          <MultichannelButton key={'2'} url={'anotherurl.com'}>
            Another website{i}
          </MultichannelButton>,
        ]}
      </Element>
    ))
    const sut = (
      <MultichannelCarousel {...LEGACY_PROPS} buttonsAsText={false}>
        {[...postbackButtons, ...urlButtons]}
      </MultichannelCarousel>
    )
    const renderer = whatsappRenderer(sut, LEGACY_CONTEXT)
    const tree = renderer.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
