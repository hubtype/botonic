import React from 'react'
import { JSONTree } from 'react-json-tree'
import styled from 'styled-components'

import { COLORS } from '../constants'
import { useWebchat } from './context/use-webchat'

const AttributeContainer = styled.div`
  display: flex;
  flex: none;
  padding: 12px;
  padding-bottom: 0px;
  font-size: 12px;
  font-weight: 600;
  color: ${COLORS.SOLID_WHITE};
  align-items: center;
`

const Label = styled.div`
  flex: none;
`

const Value = styled.div`
  flex: 1 1 auto;
  max-height: 20px;
  font-size: 16px;
  font-weight: 400;
  margin-left: 6px;
  color: ${COLORS.CURIOUS_BLUE};
  overflow-x: hidden;
`

const SessionViewAttribute = props => (
  <AttributeContainer>
    <Label>{props.label}</Label>
    <Value>{props.value}</Value>
  </AttributeContainer>
)

const SessionViewContent = styled.div`
  position: relative;
  width: ${props => (props.show ? '100%' : '0%')};
  height: 100%;
  display: flex;
  background-color: ${COLORS.DAINTREE_BLUE};
  font-family: Arial, Helvetica, sans-serif;
  flex-direction: column;
  z-index: 100000;
  transition: all 0.2s ease-in-out;
`

const ToggleTab = styled.div`
  position: absolute;
  top: 10px;
  right: -32px;
  width: 32px;
  height: 32px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${COLORS.SOLID_WHITE_ALPHA_0_8};
  font-size: 14px;
  font-weight: 600;
  background-color: ${COLORS.DAINTREE_BLUE};
  flex-direction: column;
  z-index: 100000;
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
`

const ContentContainer = styled.div`
  overflow-y: auto;
  overflow-x: auto;
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
`

const Title = styled.div`
  padding: 12px;
  text-align: center;
  color: ${COLORS.SOLID_WHITE};
  border-bottom: 1px solid ${COLORS.SOLID_WHITE_ALPHA_0_2};
`

const SessionContainer = styled.div`
  flex: 1 1 auto;
  height: 100%;
  overflow-y: auto;
`

const KeepSessionContainer = styled.div`
  flex: none;
  padding: 12px;
  color: ${COLORS.SOLID_WHITE_ALPHA_0_8};
  font-size: 12px;
`

export const SessionView = props => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { webchatState, updateDevSettings } = props.webchatHooks || useWebchat()
  const { latestInput: input, session, lastRoutePath } = webchatState
  const toggleSessionView = () =>
    updateDevSettings({
      ...webchatState.devSettings,
      showSessionView: !webchatState.devSettings.showSessionView,
    })
  const toggleKeepSessionOnReload = () =>
    updateDevSettings({
      ...webchatState.devSettings,
      keepSessionOnReload: !webchatState.devSettings.keepSessionOnReload,
    })
  return (
    <SessionViewContent show={webchatState.devSettings.showSessionView}>
      <ToggleTab onClick={toggleSessionView}>
        {webchatState.devSettings.showSessionView ? '⇤' : '⇥'}
      </ToggleTab>
      <ContentContainer>
        <Title>Botonic Dev Console</Title>
        <SessionViewAttribute
          label='INPUT:'
          value={
            input && Object.keys(input).length
              ? `[${input.type}] ${input.data || ''}`
              : ''
          }
        />
        <SessionViewAttribute label='PAYLOAD:' value={input.payload} />
        <SessionViewAttribute
          label='INTENT:'
          value={
            input.intent
              ? `${input.intent} (${(input.confidence * 100).toFixed(1)}%)`
              : ''
          }
        />
        <SessionViewAttribute
          label='PATH:'
          value={lastRoutePath ? `/${lastRoutePath}` : '/'}
        />
        <SessionViewAttribute label='SESSION:' />
        <SessionContainer>
          <JSONTree data={session} hideRoot={true} />
        </SessionContainer>
        <KeepSessionContainer>
          <label>
            <input
              type='checkbox'
              name='toggleKeepSessionOnReload'
              checked={Boolean(webchatState.devSettings.keepSessionOnReload)}
              onChange={toggleKeepSessionOnReload}
            />
            Keep session on reload
          </label>
        </KeepSessionContainer>
      </ContentContainer>
    </SessionViewContent>
  )
}
