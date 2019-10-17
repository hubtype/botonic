import React from 'react'
import {
  Text,
  Carousel,
  Element,
  Pic,
  Button,
  Title,
  Subtitle
} from '@botonic/react'

import MyWebview from '../webviews/myWebview'
import InteractionWithBot from '../webviews/interactionWithBot'
import BotVader from '../assets/bot_vader.jpg'
import InteractWithBot from '../assets/interact_with_bot.jpg'

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
            <Pic src={BotVader} />
            <Title>ReactJs Components</Title>
            <Subtitle>This will prompt a webview with a component</Subtitle>
            <Button webview={MyWebview}>Go</Button>
          </Element>
          <Element>
            <Pic src={InteractWithBot} />
            <Title>Interacting with the bot</Title>
            <Subtitle>See how the communication bot-webview is done</Subtitle>
            <Button webview={InteractionWithBot} params={{ whatever: 'hi' }}>
              Go
            </Button>
          </Element>
        </Carousel>
      </>
    )
  }
}
