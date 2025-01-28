import { PartialFlowTesterState } from '@hubtype/flow-tester'

export function getState(initial = false): PartialFlowTesterState {
  return {
    session: {
      is_first_interaction: initial,
      user: {
        extra_data: { language: 'es', country: 'ES' },
      },
    },
  }
}
