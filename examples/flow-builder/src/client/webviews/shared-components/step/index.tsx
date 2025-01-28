import * as React from 'react'

import { Steper } from '../steper'
import { ScrollContainer, StepContainer, StepTitle } from './styles'

interface StepProps {
  children: React.ReactElement
  maxStep: number
  numStep: number
  title: string
}

export const Step = ({
  children,
  maxStep,
  numStep,
  title,
}: StepProps): React.ReactElement => {
  return (
    <StepContainer>
      <Steper numStep={numStep} maxStep={maxStep} />
      <ScrollContainer>
        <StepTitle>{title}</StepTitle>
        {children}
      </ScrollContainer>
    </StepContainer>
  )
}
