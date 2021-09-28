import { Text } from '@botonic/react/src/experimental'
import React from 'react'

import AudioAction from './actions/Audio'
import ButtonsAction from './actions/Buttons'
import CarouselAction from './actions/Carousel'
import CustomAction from './actions/Custom'
import DocumentAction from './actions/Document'
import ImageAction from './actions/Image'
import LocationAction from './actions/Location'
import RepliesAction from './actions/Replies'
import TextAction from './actions/Text'
import TextAllAction from './actions/TextAll'
import VideoAction from './actions/Video'
import Welcome from './actions/Welcome'

const DefaultAction = ({ counter }) => <Text>Hi there! {counter}</Text>
DefaultAction.botonicInit = ({ session }) => {
  session.counter = (session.counter || 0) + 1
  return {
    counter: session.counter,
  }
}

export const routes = [
  { text: /hi/i, action: Welcome },
  { text: 't', action: TextAction },
  { text: 'ta', action: TextAllAction },
  { text: 'b', action: ButtonsAction },
  { text: 'r', action: RepliesAction },
  { text: 'i', action: ImageAction },
  { text: 'a', action: AudioAction },
  { text: 'd', action: DocumentAction },
  { text: 'l', action: LocationAction },
  { text: 'v', action: VideoAction },
  { text: 'c', action: CarouselAction },
  { text: 'cus', action: CustomAction },
  {
    text: /.*/,
    action: DefaultAction,
  },
]
