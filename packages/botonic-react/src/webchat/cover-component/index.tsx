import React, { useContext } from 'react'

import { WEBCHAT } from '../../constants'
import { WebchatContext } from '../../contexts'

interface Props {
  component: any
  componentProps: any
}

export const CoverComponent = ({ component, componentProps }: Props) => {
  const { getThemeProperty, toggleCoverComponent, webchatState } =
    useContext(WebchatContext)

  const Cover = component

  const coverComponentProps = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.coverComponentProps,
    componentProps
  )

  const closeCoverComponent = () => {
    toggleCoverComponent(false)
  }

  if (!Cover) {
    return null
  }

  return Cover && webchatState.isCoverComponentOpen ? (
    <Cover closeComponent={closeCoverComponent} {...coverComponentProps} />
  ) : null
}
