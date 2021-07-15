import { PROVIDER } from '@botonic/core'
import merge from 'lodash.merge'
import QRCode from 'qrcode.react'
import React, { forwardRef, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import styled from 'styled-components'

import { useWebchat } from '../../webchat/hooks'
import { SessionView } from '../../webchat/session-view'
import MessengerLogo from './assets/messenger.svg'
import Open from './assets/open.svg'
import OpenNewWindow from './assets/open-new-window.svg'
import TelegramLogo from './assets/telegram.svg'
import WebchatLogo from './assets/webchat.svg'
import WhatsappLogo from './assets/whatsapp.svg'
import { Webchat } from './webchat'

export const DebugTab = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: ${props => (props.show ? '350px' : '32px')};
  height: ${props => (props.show ? '100%' : '42px')};
`

// We want the debug tab to be rendered in the <body> even if the
// webchat is being rendered in a shadowDOM, that's why we need a portal
export const DebugTabPortal = ({ webchatHooks, ...props }) =>
  createPortal(
    <DebugTab {...props}>
      <SessionView webchatHooks={webchatHooks} />
    </DebugTab>,
    document.body
  )

const ChannelCardLabel = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2px;
  img {
    width: 18px;
    height: 18px;
  }
`

const ChannelCardAction = styled.a`
  transition: all 0.2s ease;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 8px 12px;
  background: #383f55;
  border-radius: 4px;
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 13px;
  line-height: 21px;
  display: flex;
  align-items: center;
  color: #2df2ff;
  :hover {
    background: #14171f;
  }
`

const ChannelCardText = styled.div`
  font-style: normal;
  font-weight: normal;
  font-size: 13px;
  line-height: 26px;
`

const ChannelCard = ({
  label,
  icon,
  isOpen,
  onClick,
  onActionClick,
  children,
  className,
}) => {
  return (
    <div className={className} onClick={onClick}>
      <ChannelCardLabel>
        <div>{label}</div>
        <img src={icon} />
      </ChannelCardLabel>
      {isOpen && children}
    </div>
  )
}

const ChannelCardStyled = styled(ChannelCard)`
  transition: all 0.4s ease;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  margin-right: 20px;
  padding: 16px;
  overflow: hidden;
  cursor: ${({ isOpen }) => (isOpen ? 'auto' : 'pointer')};
  width: 160px;
  height: ${({ isOpen }) => (isOpen ? '275px' : '48px')};

  border: 1px solid #ffffff;
  box-sizing: border-box;
  border-radius: 4px;

  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 15px;
  line-height: 18px;

  color: ${({ isOpen }) => (isOpen ? '#383F55' : '#FFFFFF')};
  background-color: ${({ isOpen }) => (isOpen ? '#FFFFFF' : 'transparent')};

  &:hover {
    color: #383f55;
    background-color: #ffffff;
  }
`

const ChannelCardMessaging = ({ url }) => (
  <>
    <ChannelCardText>Phone:</ChannelCardText>
    <div>
      <QRCode
        value={url}
        size={128}
        bgColor={'#ffffff'}
        fgColor={'#000000'}
        level={'Q'}
        includeMargin={false}
        renderAs={'svg'}
      />
    </div>
    <ChannelCardText>Browser:</ChannelCardText>
    <ChannelCardAction onClick={() => window.open(url, '_blank')}>
      Open
      <img src={OpenNewWindow} />
    </ChannelCardAction>
  </>
)

const ChannelCardWebchat = () => (
  <div
    style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'stretch',
    }}
  >
    <ChannelCardText></ChannelCardText>
    <ChannelCardText style={{ lineHeight: '19px' }}>
      <strong style={{ marginBottom: 2 }}>Right here!</strong>
      <br></br>
      Click the chat icon on the bottom right corner or click open below.
    </ChannelCardText>
    <ChannelCardAction onClick={() => window.Botonic.open()}>
      Open
      <img src={Open} />
    </ChannelCardAction>
  </div>
)

const ChannelSelector = ({ playgroundCode }) => {
  const [channel, setChannel] = useState(0)
  const channels = [
    {
      name: 'Whatsapp',
      url: `https://wa.me/34631914102?text=CODE%3D${playgroundCode}`,
      logo: WhatsappLogo,
    },
    {
      name: 'Messenger',
      url: `https://m.me/BotonicPlayground?ref=CODE%3D${playgroundCode}`,
      logo: MessengerLogo,
    },
    {
      name: 'Telegram',
      url: `https://t.me/BotonicPlaygroundBot?start=CODE%3D${playgroundCode}`,
      logo: TelegramLogo,
    },
    {
      name: 'Webchat',
      logo: WebchatLogo,
    },
  ]
  return (
    <div
      style={{
        display: 'flex',
        flex: 'none',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
        height: 275,
      }}
    >
      {channels.map((c, i) => (
        <ChannelCardStyled
          key={i}
          label={c.name}
          icon={c.logo}
          isOpen={channels[channel].name == c.name}
          onClick={() => setChannel(i)}
        >
          {c.name === 'Webchat' ? (
            <ChannelCardWebchat />
          ) : (
            <ChannelCardMessaging url={c.url} />
          )}
        </ChannelCardStyled>
      ))}
    </div>
  )
}

const PlaygroundTitle = styled.h1`
  font-family: Inter;
  font-style: normal;
  font-weight: bold;
  font-size: 38px;
  line-height: 62px;
  letter-spacing: -0.02em;
  color: #ffffff;
`

const PlaygroundSubtitle = styled.h3`
  font-family: Inter;
  font-style: normal;
  font-weight: normal;
  font-size: 17px;
  line-height: 26px;
  letter-spacing: -0.02em;
  color: #ffffff;
`

const PlaygroundHelpText = styled.div`
  font-family: Inter;
  font-style: normal;
  font-weight: normal;
  font-size: 15px;
  line-height: 38px;
  letter-spacing: -0.02em;
  color: #cccccc;
  a {
    color: #2df2ff;
    text-decoration: none;
  }
`

export const Playground = styled.div`
  z-index: -1;
  position: fixed;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: start;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  min-height: min-content;
  background: #383f55;
`

export const PlaygroundContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
  width: 100%;
  max-width: 800px;
  padding: 60px 0px;
`

export const PlaygroundPortal = props =>
  createPortal(
    <Playground {...props}>
      <PlaygroundContent>
        <PlaygroundTitle>Your Botonic app is up and running!</PlaygroundTitle>
        <PlaygroundSubtitle>
          Try your app now using the code{' '}
          <strong>{props.playgroundCode}</strong> on:
        </PlaygroundSubtitle>
        <ChannelSelector playgroundCode={props.playgroundCode} />
        <PlaygroundHelpText>
          <p style={{ fontWeight: 600, marginBottom: 0 }}>
            Here some resources to get you started:
          </p>
          <ol style={{ paddingLeft: 16, marginTop: 0 }}>
            <li>
              Our{' '}
              <a
                href='https://botonic.io/docs/getting-started/'
                target='_blank'
                rel='noreferrer'
              >
                getting started guide
              </a>{' '}
              has some great first steps.
            </li>
            <li>
              Our{' '}
              <a
                href='https://slack.botonic.io'
                target='_blank'
                rel='noreferrer'
              >
                slack community
              </a>{' '}
              is full of friendly humans who can help answer questions.
            </li>
            <li>
              If you want to pair with a Botonic engineer, grab a slot at one of
              our upcoming{' '}
              <a
                href='https://botonic.io/blog/2021/03/10/introducing-botonic-office-hours/'
                target='_blank'
                rel='noreferrer'
              >
                office hours
              </a>
              .
            </li>
          </ol>
        </PlaygroundHelpText>
      </PlaygroundContent>
    </Playground>,
    document.body
  )

const initialSession = {
  is_first_interaction: true,
  last_session: {},
  user: {
    id: '000001',
    username: 'johndoe',
    name: 'John Doe',
    provider: PROVIDER.DEV,
    provider_id: '0000000',
    extra_data: {},
  },
  organization: '',
  bot: {
    id: '0000000',
    name: 'botName',
  },
}

// eslint-disable-next-line react/display-name
export const WebchatDev = forwardRef((props, ref) => {
  const webchatHooks = useWebchat()
  const { webchatState, updateTheme } = webchatHooks
  /* TODO: webchatState.theme should be included in the dependencies array
  together with props.theme. The problem is that this effect modifies webchatState
  so we enter an infinite rerender loop. */
  useEffect(() => {
    updateTheme(merge(webchatState.theme, props.theme))
  }, [props.theme])

  return (
    <>
      <Webchat
        style={{ flex: 1, position: 'relative' }}
        {...props}
        ref={ref}
        webchatHooks={webchatHooks}
        initialSession={initialSession}
        initialDevSettings={{
          keepSessionOnReload: webchatState.devSettings.keepSessionOnReload,
          showSessionView: webchatState.devSettings.showSessionView,
        }}
      />
      <PlaygroundPortal playgroundCode={props.playgroundCode} />
      <DebugTabPortal
        show={webchatState.devSettings.showSessionView}
        webchatHooks={webchatHooks}
      />
    </>
  )
})
