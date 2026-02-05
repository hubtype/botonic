import {
  Element,
  MultichannelButton,
  MultichannelCarousel,
  Pic,
  Subtitle,
  Title,
} from '../../../src/components'
import { whatsappRenderer } from '../../helpers/test-utils'

const movieElements = [
  {
    title: 'Snatch',
    subtitle: 'Five minutes, Turkish',
    url: 'https://www.imdb.com/title/tt0208092',
    pic: 'https://nebula.wsimg.com/obj/NzQ3QUYxQzZBNzE4NjNFRTc1MTU6NmM4YjgzZWVlZTE2MGMzM2RkMTdlZjdjNGUyZmFhNDE6Ojo6OjA=',
  },
  {
    title: 'El laberinto del fauno',
    subtitle: '2006',
    url: 'https://www.imdb.com/title/tt0457430',
    pic: 'https://m.media-amazon.com/images/M/MV5BMDBjOWYyMDQtOWRmOC00MDgxLWIxM2UtMTNjYzFiN2RkYTBlXkEyXkFqcGdeQXVyMTAyOTE2ODg0._V1_UY268_CR6,0,182,268_AL_.jpg',
  },
]

const LEGACY_CONTEXT = {
  indexSeparator: '.',
  messageSeparator: null,
}

describe('Multichannel carousel COMPACT mode', () => {
  test('dynamic carousel with url buttons', () => {
    const sut = (
      <MultichannelCarousel>
        {movieElements.map((element, i) => (
          <Element key={`${element.title}-${i}`}>
            <Pic src={element.pic} />
            <Title>{element.title}</Title>
            <Subtitle>{element.subtitle}</Subtitle>
            <MultichannelButton url={element.url}>
              Visit website
            </MultichannelButton>
          </Element>
        ))}
      </MultichannelCarousel>
    )
    const renderer = whatsappRenderer(sut, LEGACY_CONTEXT)
    const tree = renderer.toJSON()
    expect(tree).toMatchSnapshot()
  })

  const elements = [
    {
      title: 'Title1',
      subtitle: 'Subtitle1',
      payload: 'Payload1',
      buttonText: 'Previo a la compra',
      pic: 'https://cdn.slidesharecdn.com/profile-photo-sumeet.moghe-48x48.jpg?cb=1527568614',
    },
    {
      title: 'Title2',
      subtitle: 'Subtitle2',
      payload: 'Payload2',
      buttonText: 'Durante la compra',
      pic: 'https://nebula.wsimg.com/obj/NzQ3QUYxQzZBNzE4NjNFRTc1MTU6NmM4YjgzZWVlZTE2MGMzM2RkMTdlZjdjNGUyZmFhNDE6Ojo6OjA=',
    },
  ]

  test('dynamic carousel with payload/path buttons', () => {
    const sut = (
      <MultichannelCarousel>
        {elements.map((element, i) => (
          <Element key={`${element.title}-${i}`}>
            <Pic src={element.pic} />
            <Title>{element.title}</Title>
            <Subtitle>{element.subtitle}</Subtitle>
            <MultichannelButton payload={element.payload}>
              {element.buttonText}
            </MultichannelButton>
          </Element>
        ))}
      </MultichannelCarousel>
    )
    const renderer = whatsappRenderer(sut, LEGACY_CONTEXT)
    const tree = renderer.toJSON()
    expect(tree).toMatchSnapshot()
  })

  const elementsWithoutSubtitle = [
    {
      title: 'Title 1',
      subtitle: '',
      payload: 'Payload1',
      buttonText: 'Previo a la compra',
      pic: 'https://cdn.slidesharecdn.com/profile-photo-sumeet.moghe-48x48.jpg?cb=1527568614',
    },
    {
      title: 'Title 2',
      subtitle: '',
      payload: 'Payload2',
      buttonText: 'Durante la compra',
      pic: 'https://nebula.wsimg.com/obj/NzQ3QUYxQzZBNzE4NjNFRTc1MTU6NmM4YjgzZWVlZTE2MGMzM2RkMTdlZjdjNGUyZmFhNDE6Ojo6OjA=',
    },
  ]

  test('dynamic carousel (just text in button) with payload/path buttons', () => {
    const sut = (
      <MultichannelCarousel>
        {elementsWithoutSubtitle.map((element, i) => (
          <Element key={`${element.title}-${i}`}>
            <Pic src={element.pic} />
            <Title>{element.title}</Title>
            <Subtitle>{element.subtitle}</Subtitle>
            <MultichannelButton payload={element.payload}>
              {element.buttonText}
            </MultichannelButton>
          </Element>
        ))}
      </MultichannelCarousel>
    )
    const renderer = whatsappRenderer(sut, LEGACY_CONTEXT)
    const tree = renderer.toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('dynamic carousel with URL and postback buttons and displaying only postback buttons as whatsapp buttons', () => {
    const postbackButtons = elements.map((e, i) => (
      <Element key={`${e.title}-${i}`}>
        <Pic src={e.pic} />
        <Title>{e.title}</Title>
        <Subtitle>{e.subtitle}</Subtitle>
        <MultichannelButton payload={e.payload}>
          {e.buttonText}
        </MultichannelButton>
      </Element>
    ))
    const urlButtons = movieElements.map((e, i) => (
      <Element key={`${e.title}-${i}`}>
        <Pic src={e.pic} />
        <Title>{e.title}</Title>
        <Subtitle>{e.subtitle}</Subtitle>
        <MultichannelButton url={e.url}>Visit website</MultichannelButton>
      </Element>
    ))
    const sut = (
      <MultichannelCarousel buttonsAsText={false}>
        {[...postbackButtons, ...urlButtons]}
      </MultichannelCarousel>
    )
    const renderer = whatsappRenderer(sut, LEGACY_CONTEXT)
    const tree = renderer.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
