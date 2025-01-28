import styled from 'styled-components'

import { colors, fontInterRegular } from '../../constants-styles'

const defaultTextWidth = 220
const bubbleDiameter = 80

export const Container = styled.div`
  position: fixed;
  right: 20px;
  bottom: 20px;
`

export const ContainerIntegrationMenu = styled.div`
  position: relative;
  top: -100px;
  right: 0px;

  background: ${colors.white};
  border-radius: 16px;
  filter: drop-shadow(0px 4px 16px rgba(0, 0, 0, 0.12))
    drop-shadow(0px 2px 6px rgba(0, 0, 0, 0.09))
    drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.08));
`

interface IntegrationButtonProps {
  isFirstElement?: boolean
  isLastElement?: boolean
}

export const IntegrationButton = styled.div<IntegrationButtonProps>`
  cursor: pointer;
  width: 168px;
  height: 49px;
  padding: 14px 24px;
  box-sizing: border-box;
  border-bottom: ${props =>
    props.isLastElement ? '0px' : `1px solid ${colors.neutral[50]}`};
  border-radius: 0px;
  border-radius: ${props =>
    props.isFirstElement ? '16px 16px 0px 0px' : '0px'};
  border-radius: ${props =>
    props.isLastElement ? '0px 0px 16px 16px' : '0px'};
  display: flex;
  justify-content: space-between;
  align-items: center;

  font-family: ${fontInterRegular};
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 21px;
  color: ${colors.neutral[500]};

  img {
    width: 20px;
    height: auto;
  }

  &:hover {
    background: ${colors.neutral[50]};
  }
`
type ContainerTriggerButtonProps = {
  text?: string
}

export const ContainerTriggerButton = styled.div<ContainerTriggerButtonProps>`
  background-color: ${colors.main[500]};
  cursor: pointer;
  display: flex !important;
  justify-content: center;
  align-items: center;
  border-radius: 60px;
  height: ${bubbleDiameter}px;
  width: ${bubbleDiameter}px;
  transition: 0.5s;
  bottom: 20px;
  right: 20px;
  z-index: 1002;
  position: fixed;
  overflow: hidden;
  &.hover {
    width: ${({ text }) => getTextWidth(text) + bubbleDiameter + 20}px;
    padding-left: 5px;
    transition: width 0.5s;
    > div {
      width: ${({ text }) => getTextWidth(text) + 20}px;
      padding-left: 10px;
      transition: width 0.5s;
    }
  }
  &.no-hover {
    > div {
      opacity: 0;
      width: 0px;
      transition: 0.5s;
    }
  }
  > div {
    display: flex;
    flex-direction: column;
  }
`

export const AnimatedText = styled.div`
  display: block;
  width: 0px;
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.3px;
  line-height: 20px;
  font-family: 'Inter', Helvetica, Arial, sans-serif;
  color: ${colors.white};
  white-space: nowrap;
  p {
    margin: 0px;
  }
`

export const TriggerButtonImage = styled.img`
  height: auto;
  width: 32px;
`

export const TriggerButtonImageContainer = styled.span`
  position: relative;
  svg {
    height: auto;
    width: 32px;
    margin: 2px 0px;
  }
`

function getTextWidth(text?: string, fontStyle = '14px sans-serif'): number {
  if (!text) {
    return 0
  }
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  if (!context) return defaultTextWidth
  context.font = fontStyle
  const width = context.measureText(getLongestLine(text)).width
  return Math.ceil(width)
}

function getLongestLine(text: string): string {
  return text.split('\n').sort((a, b) => b.length - a.length)[0]
}
