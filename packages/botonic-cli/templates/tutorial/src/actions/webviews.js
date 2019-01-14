import React from 'react'
import {
  Text,
  Carousel,
  Element,
  Image,
  Button,
  Title,
  Subtitle
} from '@botonic/react'

export default class extends React.Component {
  render() {
    //Here we render a Facebook Carrousel with its propers assets and url routes for these webviews
    return (
      <>
        <Text>
          Here I lend you some options of how helpful the use of Facebook
          webviews could be.
        </Text>
        <Carousel>
          <Element>
            <Image src="/assets/bot_vader.jpeg" />
            <Title>ReactJs Components</Title>
            <Subtitle>This will prompt a webview with a component</Subtitle>
            <Button webview_height_ratio="compact" url="/webviews/my_webview">
              Go
            </Button>
          </Element>
          <Element>
            <Image src="/assets/interact_with_bot.jpeg" />
            <Title>Interacting with the bot</Title>
            <Subtitle>See how the communication bot-webview is done</Subtitle>
            <Button
              webview_height_ratio="tall"
              url="/webviews/interaction_with_bot"
            >
              Go
            </Button>
          </Element>
        </Carousel>
      </>
    )
  }
}
