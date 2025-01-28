import * as React from 'react'

import { Step } from '../../../shared-components/step'
import { ViewStep } from '../../redux/view-slice'

export const steps = [
  {
    value: ViewStep.firstStep,
    numStep: 0,
    compontent: (
      <Step title={'Title first step'} numStep={0} maxStep={3}>
        <div>First Step Component</div>
      </Step>
    ),
  },
  {
    value: ViewStep.secondStep,
    numStep: 1,
    compontent: (
      <Step title={'Title Second step'} numStep={1} maxStep={3}>
        <div>Second Step Component</div>
      </Step>
    ),
  },
  {
    value: ViewStep.lastStep,
    numStep: 2,
    compontent: (
      <Step title={'Title Third step'} numStep={2} maxStep={3}>
        <div>Third Step Component</div>
      </Step>
    ),
  },
]
