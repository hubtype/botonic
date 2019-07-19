import React, { useContext, useState } from 'react'
import { WebchatContext } from '../contexts'
import { Flex } from '@rebass/grid'
import { Button } from '@botonic/react/src/components/button'
import { WebchatMessageList } from './messageList'

const DefaultMenu = () => {
  //const [reset, setReset] = useState(false)
  //const { webchatState } = useContext(WebchatContext)
  /*const resetBot = () => {
    if (!reset) {
      webchatState.messagesComponents = []
      webchatState.replies = []
      webchatState.messagesJSON = []
      setReset(true)
    }
  }*/
  return (
    <Flex
      flexDirection="column"
      style={{
        position: 'absolute',
        top: 284,
        left: 14
      }}
    >
      <Flex width={200} flexDirection="column">
        <Flex>
          <Button onClick={() => resetBot()} top={`8px`}>
            Start Over
          </Button>
        </Flex>
        <Flex>
          <Button>Help</Button>
        </Flex>
        <Flex>
          <Button bottom={`8px`}>Rate this bot</Button>
        </Flex>
      </Flex>
    </Flex>
  )
}

const CustomMenu = ({ options }) => {
  return (
    <Flex
      flexDirection="column"
      style={{
        position: 'absolute',
        top: 284,
        left: 14
      }}
    >
      <Flex width={200} flexDirection="column">
        {options.map((e, i) => (
          <Flex key={i}>
            <Button payload={e.payload}>{e.label}</Button>
          </Flex>
        ))}
      </Flex>
    </Flex>
  )
}

export const Menu = props => {
  if (props.options) {
    return <CustomMenu options={props.options} />
  } else {
    return <DefaultMenu />
  }
}
