import React, { useContext } from 'react'

import { WEBCHAT } from '../../constants'
import { WebchatContext } from '../context'

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

  if (!Cover || !webchatState.isCoverComponentOpen) {
    return null
  }

  return <Cover closeComponent={closeCoverComponent} {...coverComponentProps} />
}
