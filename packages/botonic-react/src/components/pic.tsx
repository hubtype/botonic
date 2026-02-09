import styled from 'styled-components'

import { COLORS, WEBCHAT } from '../constants'
import { staticAsset } from '../util/environment'
import { renderComponent } from '../util/react'
import { COMPONENT_DISPLAY_NAMES } from './constants'

const PicStyled = styled.img`
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  width: ${WEBCHAT.DEFAULTS.ELEMENT_WIDTH}px;
  height: 140px;
  background: ${COLORS.SOLID_WHITE};
  object-fit: center/cover;
  border-bottom: 1px solid ${COLORS.SEASHELL_WHITE};
`
export interface PicProps {
  src: string
}

export const Pic = (props: PicProps) => {
  props = { ...props, src: staticAsset(props.src) }

  const renderBrowser = () => <PicStyled src={props.src} />

  // @ts-expect-error
  const renderNode = () => <pic>{props.src}</pic>

  return renderComponent({ renderBrowser, renderNode })
}

Pic.displayName = COMPONENT_DISPLAY_NAMES.Pic

Pic.serialize = (props: PicProps) => {
  return { pic: props.src }
}
