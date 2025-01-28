import * as React from 'react'

import { PrimaryButton, SecondaryButton } from '../../../webchat/shared-styles'
import { FooterContainer } from './styles'

export interface FooterProps {
  buttonTexts: {
    previous: string
    next: string
    submit: string
  }
  footerState: {
    primary: {
      disabled: boolean
    }
    secondary: {
      disabled: boolean
    }
  }
  handlePrevious: () => void
  handleNext: () => void
  isFinalStep: boolean
  isLoading: boolean
  numStep: number
}

export const Footer = ({
  buttonTexts,
  footerState,
  handlePrevious,
  handleNext,
  isFinalStep,
  isLoading,
  numStep,
}: FooterProps): React.ReactElement => {
  return (
    <FooterContainer>
      {numStep > 0 && (
        <SecondaryButton
          disabled={footerState.secondary.disabled}
          onClick={handlePrevious}
        >
          {buttonTexts.previous}
        </SecondaryButton>
      )}
      <PrimaryButton
        disabled={footerState.primary.disabled || isLoading}
        onClick={handleNext}
      >
        {isFinalStep ? buttonTexts.submit : buttonTexts.next}
      </PrimaryButton>
    </FooterContainer>
  )
}
