import React from 'react'

import { SteperContainer, StepItem } from './styles'

interface SteperProps {
  maxStep: number
  numStep: number
}
export const Steper = ({ numStep, maxStep }: SteperProps) => {
  const steps = new Array(maxStep).fill(0, 0, maxStep)
  return (
    <SteperContainer>
      {steps.map((_step, index) => (
        <StepItem key={`steper-${index}`} next={index > numStep} />
      ))}
    </SteperContainer>
  )
}
