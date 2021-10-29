import { Text } from '@botonic/react/src/experimental'
import React from 'react'

import AudioAction from './actions/Audio'
import ButtonsAction from './actions/Buttons'
import CarouselAction from './actions/Carousel'
import CustomAction from './actions/Custom'
import DocumentAction from './actions/Document'
// import Handoff from './actions/Handoff'
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
  // { path: 'handoff', text: 'handoff', action: Handoff },
  { path: 'welcome', text: /hi/i, action: Welcome },
  { path: 'text', text: 't', action: TextAction },
  { path: 'text-all', text: 'ta', action: TextAllAction },
  { path: 'buttons', text: 'b', action: ButtonsAction },
  { path: 'replies', text: 'r', action: RepliesAction },
  { path: 'image', text: 'i', action: ImageAction },
  { path: 'audio', text: 'a', action: AudioAction },
  { path: 'doc', text: 'd', action: DocumentAction },
  { path: 'location', text: 'l', action: LocationAction },
  { path: 'video', text: 'v', action: VideoAction },
  { path: 'carousel', text: 'c', action: CarouselAction },
  { path: 'custom', text: 'cus', action: CustomAction },
  {
    path: 'default-fallback',
    text: /.*/,
    action: DefaultAction,
  },
]
