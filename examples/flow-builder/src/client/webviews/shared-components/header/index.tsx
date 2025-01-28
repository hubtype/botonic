import { WebviewRequestContext } from '@botonic/react'
import * as React from 'react'

import { isWhatsApp } from '../../../../server/utils/env-utils'
import { ArrowLeftSvg } from '../../example/svgs/arrow-left-svg'
import { isMobile } from '../../utils'
import { HubtypeSvg } from './hubtype-svg'
import {
  HeaderArrowButton,
  HeaderContainer,
  HeaderTitleContainer,
  HeaderTitleWhatsappContainer,
  Title,
} from './styles'

interface HeaderProps {
  title: string
}

export const Header = ({ title }: HeaderProps): React.ReactElement => {
  const webviewRequestContext = React.useContext(WebviewRequestContext)
  const session = webviewRequestContext.session
  const isWhatsapp = isWhatsApp(session)

  const handleClickMenu = () => {
    void webviewRequestContext.closeWebview()
    return
  }

  return (
    <HeaderContainer withoutBorderRadius={isWhatsapp || isMobile()}>
      {isWhatsapp ? (
        <HeaderTitleWhatsappContainer>
          <Title>{title}</Title>
          <HubtypeSvg />
        </HeaderTitleWhatsappContainer>
      ) : (
        <HeaderTitleContainer>
          <HeaderArrowButton onClick={handleClickMenu}>
            <ArrowLeftSvg />
          </HeaderArrowButton>
          <Title>{title}</Title>
        </HeaderTitleContainer>
      )}
    </HeaderContainer>
  )
}
