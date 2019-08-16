import React from 'react'
import {
  RequestContext,
  Text,
  Button,
  Carousel,
  Pic,
  Element,
  Title,
  Subtitle
} from '@botonic/react'

import Rest1 from '../assets/Rest1.jpg'
import Rest2 from '../assets/Rest2.jpg'
import Rest3 from '../assets/Rest3.jpg'

export default class extends React.Component {
  static contextType = RequestContext

  render() {
    return (
      <>
        <Text>For sure! These are some of the best places I've found!</Text>
        <Carousel>
          <Element>
            <Pic src={Rest1} />
            <Title>The Salty Yardt</Title>
            <Subtitle>Who said that salads were boring?</Subtitle>
            <Button payload='selected_restaurant-The Salty Yardt'>
              This one!
            </Button>
          </Element>
          <Element>
            <Pic src={Rest2} />
            <Title>The Chocolate Leaf</Title>
            <Subtitle>The coffee of your life with the best dishes</Subtitle>
            <Button payload='selected_restaurant-The Chocolate Leaf'>
              This one!
            </Button>
          </Element>
          <Element>
            <Pic src={Rest3} />
            <Title>The Vineyard</Title>
            <Subtitle>The best dishes and wines in the earth!</Subtitle>
            <Button payload='selected_restaurant-The Vineyard'>
              This one!
            </Button>
          </Element>
        </Carousel>
      </>
    )
  }
}
