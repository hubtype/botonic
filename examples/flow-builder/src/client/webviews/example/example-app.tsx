import React, { useContext, useEffect } from 'react'

import { MyWebviewContentsContext } from '../../constants'
import { Footer } from '../shared-components/footer'
import { Header } from '../shared-components/header'
import { WebviewModal } from '../shared-components/webview-modal'
import { steps } from './components/steps'
import { useFooter } from './hooks/use-footer'
import { WebviewContainer } from './styles'

interface ExampleAppProps {
  isWhatsAppDesktop: boolean
}

export const ExampleApp = (props: ExampleAppProps) => {
  const { contents } = useContext(MyWebviewContentsContext)

  const viewState = { isWhatsAppDesktop: false }
  const currentStep = steps[0]
  const footerProps = useFooter()

  return (
    <WebviewContainer>
      <Header title={'WEBVIEW HEADER TITLE'} />
      {contents.myContent}
      {currentStep.compontent}
      <Footer {...footerProps} />

      {viewState.modal && (
        <WebviewModal isWhatsAppDesktop={false}>
          <>{currentModal[viewState.modal]}</>
        </WebviewModal>
      )}
    </WebviewContainer>
  )
}
